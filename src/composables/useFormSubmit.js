import { ref } from 'vue'

export function useFormSubmit() {
  const submitMessage = ref('')
  const submitMessageClass = ref('')

  const submitForm = async ({
    url,
    data,
    successMessage,
    successClass,
    errorClass,
    onSuccess,
    onError
  }) => {
    try {
      submitMessage.value = ''

      const headers = data instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }

      const body = data instanceof FormData ? data : JSON.stringify(data)

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body
      })

      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`)
      }

      const responseData = await response.json()

      submitMessage.value = successMessage
      submitMessageClass.value = successClass

      if (onSuccess) {
        onSuccess(responseData)
      }

      setTimeout(() => {
        submitMessage.value = ''
      }, 5000)

      console.log('Ответ от сервера:', responseData)

      return { success: true, data: responseData }
    } catch (error) {

      submitMessage.value = `Ошибка отправки: ${error.message}. Пожалуйста, попробуйте еще раз.`
      submitMessageClass.value = errorClass

      if (onError) {
        onError(error)
      }

      console.error('Ошибка отправки формы:', error)

      return { success: false, error }
    }
  }

  return {
    submitMessage,
    submitMessageClass,
    submitForm
  }
}

