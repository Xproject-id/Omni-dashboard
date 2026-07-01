export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()

  // Pages that don't require auth
  const publicPages = ['/login']

  if (publicPages.includes(to.path)) {
    // If already logged in, redirect to dashboard
    if (user.value) return navigateTo('/')
    return
  }

  // Require auth for all other pages
  if (!user.value) {
    return navigateTo('/login')
  }
})
