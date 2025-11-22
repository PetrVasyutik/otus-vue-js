<template>
  <div class="order-form">
    <h2 class="order-form__title">Сделать заказ</h2>
    <div class="order-form__container">
      <form
        class="order-form__form"
        id="order-form"
        name="order-form"
        action="/api/orders"
        method="post"
        @submit.prevent="onSubmit"
        novalidate
        autocomplete="on"
        aria-label="Форма оформления заказа"
      >
        <label>
          <input
            type="text"
            name="first_name"
            v-model="firstName"
            @blur="firstNameBlur"
            @input="firstNameChange"
            autocomplete="given-name"
            placeholder="Имя"
            :class="{ 'order-form__input--error': errors.first_name }"
            class="order-form__input"
          />
          <ErrorMessage name="first_name" class="order-form__error" />
        </label>

        <label>
          <input
            type="text"
            name="last_name"
            v-model="lastName"
            @blur="lastNameBlur"
            @input="lastNameChange"
            autocomplete="family-name"
            placeholder="Фамилия"
            :class="{ 'order-form__input--error': errors.last_name }"
            class="order-form__input"
          />
          <ErrorMessage name="last_name" class="order-form__error" />
        </label>

        <label>
          <input
            type="tel"
            name="phone"
            v-model="phone"
            @blur="phoneBlur"
            @input="phoneChange"
            autocomplete="tel"
            placeholder="Телефон"
            :class="{ 'order-form__input--error': errors.phone }"
            class="order-form__input"
          />
          <ErrorMessage name="phone" class="order-form__error" />
        </label>

        <label>
          <input
            type="email"
            name="email"
            v-model="email"
            @blur="emailBlur"
            @input="emailChange"
            autocomplete="email"
            placeholder="E-mail"
            :class="{ 'order-form__input--error': errors.email }"
            class="order-form__input"
          />
          <ErrorMessage name="email" class="order-form__error" />
        </label>

        <label>
          <input
            type="text"
            name="address"
            v-model="address"
            @blur="addressBlur"
            @input="addressChange"
            autocomplete="address"
            placeholder="Город, улица, дом, квартира"
            :class="{ 'order-form__input--error': errors.address }"
            class="order-form__input"
          />
          <ErrorMessage name="address" class="order-form__error" />
        </label>

        <label>
          <textarea
            name="order_description"
            v-model="orderDescription"
            @blur="orderDescriptionBlur"
            @input="orderDescriptionChange"
            rows="5"
            placeholder="Опишите Ваш заказ"
            :class="{ 'order-form__input--error': errors.order_description }"
            class="order-form__input order-form__textarea"
          ></textarea>
          <ErrorMessage name="order_description" class="order-form__error" />
        </label>

        <label for="privacy" class="order-form__checkbox-label">
          <input
            type="checkbox"
            id="privacy"
            name="privacy_agreed"
            v-model="privacyAgreed"
            @blur="privacyBlur"
            class="order-form__checkbox"
          />
          <span :class="{ 'order-form__error-text': errors.privacy_agreed }">
            Я согласен на обработку персональных данных *
          </span>
        </label>
        <ErrorMessage name="privacy_agreed" class="order-form__error" />

        <button
          type="submit"
          id="submit-order"
          aria-label="Отправить заказ"
          class="order-form__btn"
          :disabled="isSubmitting || !meta.valid || !privacyAgreed"
        >
          {{ isSubmitting ? 'Отправка...' : 'Оформить заказ' }}
        </button>

        <div v-if="submitMessage" :class="submitMessageClass" class="order-form__message">
          <p>{{ submitMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ErrorMessage, useForm, useField } from 'vee-validate'
import * as yup from 'yup'

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

const submitMessage = ref('')
const submitMessageClass = ref('')

const onSubmit = handleSubmit(async (values) => {
  try {
    submitMessage.value = ''

    const response = await fetch('https://httpbin.org/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    })

    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`)
    }

      const data = await response.json()

      submitMessage.value = 'Заказ успешно оформлен! Данные отправлены.'
      submitMessageClass.value = 'order-form__message--success'

      resetForm()

      setTimeout(() => {
        submitMessage.value = ''
      }, 5000)

      console.log('Ответ от сервера:', data)
  } catch (error) {
    submitMessage.value = `Ошибка отправки: ${error.message}. Пожалуйста, попробуйте еще раз.`
    submitMessageClass.value = 'order-form__message--error'

    console.error('Ошибка отправки формы:', error)
  }
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

.order-form__title {
  text-align: left;
  font-size: 20px;
  font-weight: 700;
  color:chocolate;
  margin-bottom: 20px;
}

.order-form__form {
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-form__form label {
  display: flex;
  width: 100%;
  position: relative;
}

.order-form__input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.order-form__input:focus {
  outline: none;
  border-color: chocolate;
  box-shadow: 0 0 0 2px rgba(210, 105, 30, 0.2);
}

.order-form__input--error {
  border-color: #dc3545;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.order-form__input--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2);
}

.order-form__textarea {
  resize: vertical;
  min-height: 100px;
}

.order-form__checkbox-label {
  flex-direction: row;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.order-form__checkbox {
  width: auto;
  cursor: pointer;
  flex-shrink: 0;
}

.order-form__error {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.order-form__error-text {
  color: #dc3545;
}

.order-form__btn {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  cursor: pointer;
  background-color: rgba(210, 105, 30, 0.6);
  color: white;
  font-weight: 700;
  transition: all 0.3s ease;
}
.order-form__btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 14px 0 rgba(222, 222, 222, 0.5);
  background-color: rgba(210, 105, 30, 1);
}

.order-form__btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.order-form__message {
  padding: 12px 16px;
  border-radius: 4px;
  margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
}

.order-form__message--success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.order-form__message--error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.order-form__message p {
  margin: 0;
}
</style>
