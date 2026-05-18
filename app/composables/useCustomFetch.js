import { useAppStore } from "~/stores/useAppStore"

let refreshPromise = null
let isFatalError = false

const defaultMessage = {
  success: 'Request successfully processed',
  withErr: 'An error occurred while processing your request',
  session: 'Your session has expired. Please log in again'
}

export const useCustomFetch = async (request, options = {}) => {
  if (isFatalError) return null;
  const { setNotification } = useAppStore();

  try {
    const response = await $fetch(request, options)
    if (options.notify || options.notifySuccess) {
      const message = response?.message || defaultMessage.success
      setNotification('success', message);
    }

    return response?.data || response
  } catch (error) {
    const statusCode = error?.response?.status || 500
    const statusMessage = error?.response?.statusText || 'Internal Server Error'
    const message = error?.data?.detail || defaultMessage.withErr

    if ([502, 503, 504].includes(statusCode)) {
      if (!isFatalError) {
        isFatalError = true

        showError({
          statusCode: statusCode,
          statusMessage: statusMessage,
          message: message,
          fatal: true
        })
      }

      return null
    }

    if (([401, 403].includes(statusCode)) && !options._retry) {
      const session = useCookie('session_simaps')
      if (!refreshPromise) {
        refreshPromise = $fetch('/api/auth/refresh', { method: 'POST' })
        .finally(() => { refreshPromise = null })
      }

      try {
        await refreshPromise
        return await useCustomFetch(request, { ...options, _retry: true })
      } catch (refreshError) {
        session.value = null
        navigateTo('/auth')
        throw refreshError
      }
    }

    if (options.notify || options.notifyError) setNotification('danger', message)
    if (options.withErr) throw message
    else return null
  }
}
