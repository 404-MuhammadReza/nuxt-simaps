export default defineNuxtRouteMiddleware((to) => {
  const session = useCookie('session_simaps')

  if (session.value && to.path === '/auth') {
    return navigateTo('/')
  }

  if (!session.value && to.path !== '/auth') {
    return navigateTo('/auth')
  }
})
