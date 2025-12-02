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
          <input
            type="date"
            name="birth_date"
            v-model="birthDate"
            @blur="birthDateBlur"
            @input="birthDateChange"
            placeholder="Дата рождения"
            :class="{ 'form-input--error': errors.birth_date }"
            class="form-input"
          />
          <ErrorMessage name="birth_date" class="form-error" />
        </label>

        <div class="order-form__cart-summary">
          <h3 class="order-form__summary-title">Итого в корзине:</h3>
          <p class="order-form__summary-text">
            Количество товаров: <strong>{{ totalItems }}</strong>
          </p>
          <p class="order-form__summary-text">
            Общая стоимость: <strong>${{ totalPrice.toFixed(2) }}</strong>
          </p>
        </div>

        <div class="order-form__payment-section">
          <h3 class="order-form__section-title">Данные платежной карты</h3>

          <label class="form-label">
            <input
              type="text"
              name="card_number"
              v-model="cardNumber"
              @blur="cardNumberBlur"
              @input="handleCardNumberInput"
              placeholder="0000 0000 0000 0000"
              maxlength="19"
              :class="{ 'form-input--error': errors.card_number }"
              class="form-input"
            />
            <ErrorMessage name="card_number" class="form-error" />
          </label>

          <div class="order-form__card-row">
            <label class="form-label">
              <input
                type="text"
                name="card_expiry"
                v-model="cardExpiry"
                @blur="cardExpiryBlur"
                @input="handleCardExpiryInput"
                placeholder="MM/YY"
                maxlength="5"
                :class="{ 'form-input--error': errors.card_expiry }"
                class="form-input"
              />
              <ErrorMessage name="card_expiry" class="form-error" />
            </label>

            <label class="form-label">
              <input
                type="text"
                name="card_cvv"
                v-model="cardCvv"
                @blur="cardCvvBlur"
                @input="handleCardCvvInput"
                placeholder="CVV"
                maxlength="4"
                :class="{ 'form-input--error': errors.card_cvv }"
                class="form-input"
              />
              <ErrorMessage name="card_cvv" class="form-error" />
            </label>
          </div>
        </div>

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
import { useAppStore } from '@/stores/appStore'
import { storeToRefs } from 'pinia'

// Используем Pinia store вместо composable
const store = useAppStore()
const { totalItems, totalPrice } = storeToRefs(store)

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
  birth_date: yup
    .date()
    .required('Дата рождения обязательна для заполнения')
    .max(new Date(), 'Дата рождения не может быть в будущем')
    .typeError('Введите корректную дату'),
  card_number: yup
    .string()
    .required('Номер карты обязателен для заполнения')
    .matches(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, 'Номер карты должен быть в формате 0000 0000 0000 0000'),
  card_expiry: yup
    .string()
    .required('Срок действия карты обязателен для заполнения')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Срок действия должен быть в формате MM/YY'),
  card_cvv: yup
    .string()
    .required('CVV обязателен для заполнения')
    .matches(/^\d{3,4}$/, 'CVV должен содержать 3 или 4 цифры'),
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
const { value: birthDate, handleBlur: birthDateBlur, handleChange: birthDateChange } = useField('birth_date')
const { value: cardNumber, handleBlur: cardNumberBlur, handleChange: cardNumberChange } = useField('card_number')
const { value: cardExpiry, handleBlur: cardExpiryBlur, handleChange: cardExpiryChange } = useField('card_expiry')
const { value: cardCvv, handleBlur: cardCvvBlur, handleChange: cardCvvChange } = useField('card_cvv')
const { value: orderDescription, handleBlur: orderDescriptionBlur, handleChange: orderDescriptionChange } = useField('order_description')
const { value: privacyAgreed, handleBlur: privacyBlur } = useField('privacy_agreed', {
  type: 'checkbox',
  checkedValue: true,
  uncheckedValue: false,
  initialValue: false
})

const handleCardNumberInput = (e) => {
  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
  if (value.length > 16) value = value.slice(0, 16)
  const formatted = value.match(/.{1,4}/g)?.join(' ') || value
  e.target.value = formatted
  cardNumberChange(e)
}

const handleCardExpiryInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2)
  }
  e.target.value = value
  cardExpiryChange(e)
}

const handleCardCvvInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length > 4) value = value.slice(0, 4)
  e.target.value = value
  cardCvvChange(e)
}

const { submitMessage, submitMessageClass, submitForm } = useFormSubmit()

const onSubmit = handleSubmit(async (values) => {

  // Сохраняем / обновляем профиль пользователя в store
  store.login({
    firstName: values.first_name,
    lastName: values.last_name,
    email: values.email,
    phone: values.phone,
    address: values.address,
    birthDate: values.birth_date
  })

  // Отправляем заказ
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

.order-form__cart-summary {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid chocolate;
  margin: 20px 0;
}

.order-form__summary-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 10px 0;
}

.order-form__summary-text {
  font-size: 16px;
  color: #333;
  margin: 8px 0;
}

.order-form__summary-text strong {
  color: chocolate;
  font-size: 18px;
}

.order-form__payment-section {
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.order-form__section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin: 0 0 15px 0;
}

.order-form__card-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .order-form__card-row {
    grid-template-columns: 1fr;
  }
}
</style>
