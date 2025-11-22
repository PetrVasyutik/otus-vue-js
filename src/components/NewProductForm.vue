<template>
  <div class="new-product-form">
    <h2 class="form-title">Добавить новый товар</h2>
    <form class="form-container" @submit.prevent="onSubmit">
      <label class="form-label">
        <input
          type="text"
          name="title"
          v-model="title"
          @blur="titleBlur"
          @input="titleChange"
          placeholder="Название товара"
          :class="{ 'form-input--error': errors.title }"
          class="form-input"
        />
        <ErrorMessage name="title" class="form-error" />
      </label>

      <label class="form-label">
        <textarea
          name="description"
          v-model="description"
          @blur="descriptionBlur"
          @input="descriptionChange"
          placeholder="Описание товара"
          rows="4"
          :class="{ 'form-input--error': errors.description }"
          class="form-input form-textarea"
        ></textarea>
        <ErrorMessage name="description" class="form-error" />
      </label>

      <label class="form-label">
        <input
          type="number"
          name="price"
          v-model="price"
          @blur="priceBlur"
          @input="priceChange"
          placeholder="Цена товара"
          step="0.01"
          min="0"
          :class="{ 'form-input--error': errors.price }"
          class="form-input"
        />
        <ErrorMessage name="price" class="form-error" />
      </label>

      <label class="form-label">
        <input
          type="file"
          name="image"
          @change="handleImageChange"
          @blur="imageBlur"
          accept="image/png,image/jpg,image/jpeg"
          :class="{ 'form-input--error': errors.image }"
          class="form-input form-file-input"
        />
        <span v-if="imageFileName" class="form-file-name">
          Выбран файл: {{ imageFileName }}
        </span>
        <ErrorMessage name="image" class="form-error" />
      </label>

      <label class="form-label">Выберите категорию товара:
        <select
          name="category"
          v-model="category"
          @blur="categoryBlur"
          @change="categoryChange"
          :class="{ 'form-input--error': errors.category }"
          class="form-input form-select"
        >
          <option value="" disabled>Выберите категорию</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>
        <ErrorMessage name="category" class="form-error" />
      </label>

      <button
        type="submit"
        class="form-btn"
        :disabled="isSubmitting || !meta.valid"
      >
        {{ isSubmitting ? 'Добавление...' : 'Добавить товар' }}
      </button>

      <div v-if="submitMessage" :class="submitMessageClass" class="form-message">
        <p>{{ submitMessage }}</p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, toRef } from 'vue'
import { ErrorMessage, useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useCategories } from '@/composables/useCategories'
import { useFormSubmit } from '@/composables/useFormSubmit'

const props = defineProps({
  products: {
    type: Array,
    required: true,
    default: () => []
  }
})

const productsRef = toRef(props, 'products')
const { categories } = useCategories(productsRef)

const validationSchema = yup.object({
  title: yup
    .string()
    .required('Название товара обязательно для заполнения')
    .min(3, 'Название должно содержать минимум 3 символа')
    .max(100, 'Название не должно превышать 100 символов'),
  description: yup
    .string()
    .required('Описание товара обязательно для заполнения')
    .min(10, 'Описание должно содержать минимум 10 символов')
    .max(500, 'Описание не должно превышать 500 символов'),
  price: yup
    .number()
    .required('Цена товара обязательна для заполнения')
    .positive('Цена должна быть положительным числом')
    .min(0.01, 'Цена должна быть больше 0')
    .typeError('Цена должна быть числом'),
  image: yup
    .mixed()
    .required('Изображение товара обязательно для загрузки')
    .test('fileType', 'Файл должен быть изображением (PNG, JPG, JPEG)', (value) => {
      if (!value) return false
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']
      return allowedTypes.includes(value.type)
    })
    .test('fileSize', 'Размер файла не должен превышать 5MB', (value) => {
      if (!value) return false
      return value.size <= 5 * 1024 * 1024 // 5MB
    }),
  category: yup
    .string()
    .required('Категория товара обязательна для заполнения')
})

const { handleSubmit, errors, isSubmitting, meta, resetForm } = useForm({
  validationSchema
})

const { value: title, handleBlur: titleBlur, handleChange: titleChange } = useField('title')
const { value: description, handleBlur: descriptionBlur, handleChange: descriptionChange } = useField('description')
const { value: price, handleBlur: priceBlur, handleChange: priceChange } = useField('price')
const { value: image, handleBlur: imageBlur } = useField('image')
const { value: category, handleBlur: categoryBlur, handleChange: categoryChange } = useField('category', {
  initialValue: ''
})

const imageFileName = ref('')

const handleImageChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    image.value = file
    imageFileName.value = file.name
  } else {
    image.value = null
    imageFileName.value = ''
  }
}

const { submitMessage, submitMessageClass, submitForm } = useFormSubmit()

const onSubmit = handleSubmit(async (values) => {
  const formData = new FormData()
  formData.append('title', values.title)
  formData.append('description', values.description)
  formData.append('price', values.price)
  formData.append('image', values.image)
  formData.append('category', values.category)

  await submitForm({
    url: 'https://httpbin.org/post',
    data: formData,
    successMessage: 'Товар успешно добавлен!',
    successClass: 'form-message--success',
    errorClass: 'form-message--error',
    onSuccess: () => {
      resetForm()
      imageFileName.value = ''
    }
  })
})
</script>
<style scoped lang="css">
.new-product-form {
  max-width: 100%;
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
}
</style>
