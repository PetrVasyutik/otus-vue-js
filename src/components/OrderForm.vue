<template>
  <div class="order-form">
    <h2 class="form-title">Сделать заказ</h2>
    <div class="order-form__container">
      <form
        class="form-container"
        id="order-form"
        name="order-form"
        action="/api/orders"
        method="post"
        @submit.prevent="onSubmit"
        novalidate
        autocomplete="on"
        aria-label="Форма оформления заказа"
      >
        <label class="form-label">
          <input
            type="text"
            name="first_name"
            v-model="firstName"
            @blur="firstNameBlur"
            @input="firstNameChange"
            autocomplete="given-name"
            placeholder="Имя"
            :class="{ 'form-input--error': errors.first_name }"
            class="form-input"
          />
          <ErrorMessage name="first_name" class="form-error" />
        </label>

        <label class="form-label">
          <input
            type="text"
            name="last_name"
            v-model="lastName"
            @blur="lastNameBlur"
            @input="lastNameChange"
            autocomplete="family-name"
            placeholder="Фамилия"
            :class="{ 'form-input--error': errors.last_name }"
            class="form-input"
          />
          <ErrorMessage name="last_name" class="form-error" />
        </label>

        <label class="form-label">
          <input
            type="tel"
            name="phone"
            v-model="phone"
            @blur="phoneBlur"
            @input="phoneChange"
            autocomplete="tel"
            placeholder="Телефон"
            :class="{ 'form-input--error': errors.phone }"
            class="form-input"
          />
          <ErrorMessage name="phone" class="form-error" />
        </label>

        <label class="form-label">
          <input
            type="email"
            name="email"
            v-model="email"
            @blur="emailBlur"
            @input="emailChange"
            autocomplete="email"
            placeholder="E-mail"
            :class="{ 'form-input--error': errors.email }"
            class="form-input"
          />
          <ErrorMessage name="email" class="form-error" />
        </label>

        <label class="form-label">
          <input
            type="text"
            name="address"
            v-model="address"
            @blur="addressBlur"
            @input="addressChange"
            autocomplete="address"
            placeholder="Город, улица, дом, квартира"
            :class="{ 'form-input--error': errors.address }"
            class="form-input"
          />
          <ErrorMessage name="address" class="form-error" />
        </label>

        <label class="form-label">
          <textarea
            name="order_description"
            v-model="orderDescription"
            @blur="orderDescriptionBlur"
            @input="orderDescriptionChange"
            rows="5"
            placeholder="Опишите Ваш заказ"
            :class="{ 'form-input--error': errors.order_description }"
            class="form-input form-textarea"
          ></textarea>
          <ErrorMessage name="order_description" class="form-error" />
        </label>

        <label for="privacy" class="form-label form-label--row">
          <input
            type="checkbox"
            id="privacy"
            name="privacy_agreed"
            v-model="privacyAgreed"
            @blur="privacyBlur"
            class="form-checkbox"
          />
          <span :class="{ 'form-error-text': errors.privacy_agreed }">
            Я согласен на обработку персональных данных *
          </span>
        </label>
        <ErrorMessage name="privacy_agreed" class="form-error" />

        <button
          type="submit"
          id="submit-order"
          aria-label="Отправить заказ"
          class="form-btn"
          :disabled="isSubmitting || !meta.valid || !privacyAgreed"
        >
          {{ isSubmitting ? 'Отправка...' : 'Оформить заказ' }}
        </button>

        <div v-if="submitMessage" :class="submitMessageClass" class="form-message">
          <p>{{ submitMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ErrorMessage, useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useFormSubmit } from '@/composables/useFormSubmit'

// Схема валидации
const validationSchema = yup.object({
  first_name: yup
    .string()
    .required('Имя обязательно для заполнения')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Имя может содержать только буквы, дефисы и пробелы'),
  last_name: yup
    .string()
    .required('Фамилия обязательна для заполнения')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .matches(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, 'Фамилия может содержать только буквы, дефисы и пробелы'),
  phone: yup
    .string()
    .required('Телефон обязателен для заполнения')
    .matches(/^[\d\s\-+()]+$/, 'Телефон должен содержать только цифры и символы: +, -, (, ), пробел')
    .min(10, 'Телефон должен содержать минимум 10 символов'),
  email: yup
    .string()
    .required('E-mail обязателен для заполнения')
    .email('Введите корректный e-mail адрес'),
  address: yup
    .string()
    .required('Адрес обязателен для заполнения')
    .min(10, 'Адрес должен содержать минимум 10 символов'),
  order_description: yup
    .string()
    .required('Описание заказа обязательно для заполнения')
    .min(10, 'Описание должно содержать минимум 10 символов'),
  privacy_agreed: yup
    .boolean()
    .oneOf([true], 'Необходимо согласие на обработку персональных данных')
})

const { handleSubmit, errors, isSubmitting, meta, resetForm } = useForm({
  validationSchema
})

// Используем useField для каждого поля
const { value: firstName, handleBlur: firstNameBlur, handleChange: firstNameChange } = useField('first_name')
const { value: lastName, handleBlur: lastNameBlur, handleChange: lastNameChange } = useField('last_name')
const { value: phone, handleBlur: phoneBlur, handleChange: phoneChange } = useField('phone')
const { value: email, handleBlur: emailBlur, handleChange: emailChange } = useField('email')
const { value: address, handleBlur: addressBlur, handleChange: addressChange } = useField('address')
const { value: orderDescription, handleBlur: orderDescriptionBlur, handleChange: orderDescriptionChange } = useField('order_description')
const { value: privacyAgreed, handleBlur: privacyBlur } = useField('privacy_agreed', {
  type: 'checkbox',
  checkedValue: true,
  uncheckedValue: false,
  initialValue: false
})

const { submitMessage, submitMessageClass, submitForm } = useFormSubmit()

const onSubmit = handleSubmit(async (values) => {
  await submitForm({
    url: 'https://httpbin.org/post',
    data: values,
    successMessage: 'Заказ успешно оформлен! Данные отправлены.',
    successClass: 'form-message--success',
    errorClass: 'form-message--error',
    onSuccess: () => {
      resetForm()
    }
  })
})
</script>

<style scoped lang="css">
.order-form {
  width: 100%;
  height: 100%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}
</style>
