<template>
  <form
        class="form-container"
        id="login-form"
        name="login-form"
        action="/api/orders"
        method="post"
        @submit.prevent="onSubmit"
        novalidate
        autocomplete="on"
        aria-label="Форма входа в личный кабинет"
      >
    <label class="form-label">
          <input
            type="email"
            name="email"
            v-model="email"
            @blur="emailBlur"
            @input="emailChange"
            autocomplete="email"
            placeholder="Ваш e-mail"
            :class="{ 'form-input--error': errors.email }"
            class="form-input"
          />
          <ErrorMessage name="email" class="form-error" />
        </label>
    <label class="form-label">
          <input
            type="password"
            name="password"
            v-model="password"
            @blur="passwordBlur"
            @input="passwordChange"
            placeholder="Введите пароль"
            :class="{ 'form-input--error': errors.password }"
            class="form-input"
          />
          <ErrorMessage name="password" class="form-error" />
        </label>
    <button
          type="submit"
          id="submit-login"
          aria-label="Войти в личный кабинет"
          class="form-btn"
          :disabled="isSubmitting || !meta.valid"
        >
        {{ isSubmitting ? 'Вход...' : 'Войти' }}
      </button>

      <div v-if="submitMessage" :class="submitMessageClass" class="form-message">
        <p>{{ submitMessage }}</p>
      </div>
  </form>
</template>
<script setup>
import { ErrorMessage, useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useFormSubmit } from '@/composables/useFormSubmit'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/appStore'

// Схема валидации
const validationSchema = yup.object({
  email: yup
    .string()
    .required('E-mail обязателен для заполнения')
    .email('Введите корректный e-mail адрес'),
  password: yup
    .string()
    .required('Пароль обязателен для заполнения')
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .matches(/[A-ZА-Я]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[a-zа-я]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
})

const { handleSubmit, errors, isSubmitting, meta, resetForm } = useForm({
  validationSchema
})

const { value: password, handleBlur: passwordBlur, handleChange: passwordChange } = useField('password');
const { value: email, handleBlur: emailBlur, handleChange: emailChange } = useField('email');

const router = useRouter()
const route = useRoute()
const { submitMessage, submitMessageClass, submitForm } = useFormSubmit()
const store = useAppStore()

const onSubmit = handleSubmit(async (values) => {
  const result = await submitForm({
    url: 'https://httpbin.org/post',
    data: values,
    successMessage: 'Вход выполнен успешно!',
    successClass: 'form-message--success',
    errorClass: 'form-message--error',
    onSuccess: () => {
      resetForm()
    }
  })

  // Переход на страницу личного кабинета после успешной отправки
  if (result.success) {

    store.login({
      email: values.email
    })

    const redirect = route.query.redirect
    if (redirect && typeof redirect === 'string') {
      router.push(redirect)
    } else {
      router.push({ name: 'UserAccount' })
    }
  }
})
</script>
<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 500px;
}
</style>
