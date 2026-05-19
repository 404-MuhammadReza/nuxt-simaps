<script setup>
import TimahIndustri from '~/assets/logo/timah-industri.svg?component';
import IconLoading from '~/assets/icons/general/loading.svg?component';

definePageMeta({ layout: false })

const route = useRoute()
const code = route.query.code
const state = route.query.state

const isCallback = !!(code && state)
const handleAuthentication = async (code, state) => {
  if (isCallback) {
    try {
      await $fetch('/api/auth/callback', { query: { code, state } })
      await navigateTo('/')
    } catch {
      await navigateTo('/auth', { replace: true, query: {} })
    }
  }
  else {
    try {
      const response = await $fetch('/api/auth/login')
      if (response.success && response.data) await navigateTo(response.data, { external: true })
    } catch {
      console.error('Login error:', error)
    }
  }
}

const message = computed(() => {
  if (isCallback) {
    return {
      title: 'Authenticating',
      desc: 'Please wait while we authenticate your account'
    }
  }
  else return {
    title: 'Connecting',
    desc: 'Redirecting to Microsoft SSO portal'
  }
})

onMounted(async () => {
  await handleAuthentication(code, state)
})
</script>

<template>
  <div class="auth-page">
    <div class="container">
      <div class="logo">
        <TimahIndustri class="timah-industri" />
      </div>
      <div class="content">
        <IconLoading class="icon-loading" />
        <h1>
          {{ message.title }}
          <span v-for="dot in 3" :key="dot">.</span>
        </h1>
        <span>{{ message.desc }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  width: 100%;
  height: 100dvh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: var(--size-xxl);
}

.auth-page .container {
  width: 100%;
  max-width: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;

  border-radius: var(--size-m);
  background-color: var(--white);
  box-shadow: var(--shadow);
}

.auth-page .container .logo {
  width: 100%;

  display: flex;
  justify-content: center;

  padding: var(--size-l);
  border-bottom: 1px solid var(--grey-200);
}

.auth-page .container .logo .timah-industri {
  width: auto;
  height: calc(var(--size-xxl) * 1.25);
}

.auth-page .container .content {
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: var(--size-xl);
  gap: var(--size-xs);
}

.auth-page .container .content .icon-loading {
  width: calc(var(--size-xxl) * 1.5);
  height: calc(var(--size-xxl) * 1.5);

  color: var(--primary-100);
}

.auth-page .container .content h1 {
  display: flex;
  align-items: center;

  font-family: var(--font-primary);
  font-weight: var(--font-semi-bold);
  font-size: var(--size-xxl);

  color: var(--black);
}

.auth-page .container .content h1 span {
  font-family: var(--font-primary);
  font-weight: var(--font-semi-bold);
  font-size: var(--size-xxl);
  color: var(--black);

  margin-left: 1.5px;
  animation: typing-dots 1.4s infinite both;
}

.auth-page .container .content h1 span:nth-child(1) {
  animation-delay: 0s;
}

.auth-page .container .content h1 span:nth-child(2) {
  animation-delay: 0.2s;
}

.auth-page .container .content h1 span:nth-child(3) {
  animation-delay: 0.4s;
}

.auth-page .container .content span {
  font-family: var(--font-primary);
  font-size: var(--size-l);

  color: var(--grey-300);
}

@keyframes typing-dots {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}
</style>
