<template>
  <div class="login-card">

    <!-- Logo -->
    <div class="login-logo">
      <div class="logo-icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/>
          <line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      </div>
      <div class="logo-text">
        <p class="logo-name">Omni Dashboard</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="auth-tabs">
      <button class="auth-tab" :class="{ 'auth-tab-active': mode === 'login' }" @click="mode = 'login'; clearState()">
        Masuk
      </button>
      <button class="auth-tab" :class="{ 'auth-tab-active': mode === 'register' }" @click="mode = 'register'; clearState()">
        Daftar
      </button>
    </div>

    <!-- Form -->
    <div class="login-form-body">

      <!-- Error -->
      <div v-if="error" class="alert alert-error">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        {{ error }}
      </div>

      <!-- Success -->
      <div v-if="successMsg" class="alert alert-success">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        {{ successMsg }}
      </div>

      <form @submit.prevent="handleSubmit">

        <!-- Name (register only) -->
        <div v-if="mode === 'register'" class="form-group">
          <label class="form-label" for="f-name">Nama</label>
          <input id="f-name" v-model="form.name" type="text" class="form-input" placeholder="Nama Anda" />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label" for="f-email">Email</label>
          <input id="f-email" v-model="form.email" type="email" class="form-input" placeholder="contoh@email.com" required />
        </div>

        <!-- Password -->
        <div class="form-group">
          <div class="flex items-center justify-between">
            <label class="form-label" for="f-password">Password</label>
            <button v-if="mode === 'login'" type="button" class="forgot-btn" @click="handleForgotPassword">
              Lupa password?
            </button>
          </div>
          <div class="input-pw-wrap">
            <input
              id="f-password"
              v-model="form.password"
              :type="showPw ? 'text' : 'password'"
              class="form-input"
              :placeholder="mode === 'register' ? 'Minimal 6 karakter' : 'Password'"
              required
              minlength="6"
            />
            <button type="button" class="pw-toggle" @click="showPw = !showPw">
              <svg v-if="!showPw" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Confirm Password (register only) -->
        <div v-if="mode === 'register'" class="form-group">
          <label class="form-label" for="f-confirm">Konfirmasi Password</label>
          <input id="f-confirm" v-model="form.confirmPassword" type="password" class="form-input" placeholder="Ulangi password" />
        </div>

        <!-- Submit -->
        <button type="submit" class="btn-submit" :disabled="loading">
          <svg v-if="loading" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          {{ loading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Buat Akun') }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({ layout: 'auth' })
useHead({ title: 'Login | Omni Dashboard' })

const supabase = useSupabaseClient()
const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const loading = ref(false)
const showPw = ref(false)
const error = ref('')
const successMsg = ref('')

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })

function clearState() {
  error.value = ''
  successMsg.value = ''
}

async function handleSubmit() {
  clearState()
  loading.value = true

  if (mode.value === 'login') {
    const { error: err } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })
    if (err) { error.value = translateError(err.message); loading.value = false; return }
    
    // Wait for Supabase Nuxt module to sync the user state before routing
    await new Promise(r => setTimeout(r, 200))
    router.push('/')

  } else {
    if (form.password !== form.confirmPassword) {
      error.value = 'Password tidak cocok!'
      loading.value = false
      return
    }
    const { error: err } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name } },
    })
    if (err) { error.value = translateError(err.message); loading.value = false; return }
    successMsg.value = 'Akun dibuat! Cek email Anda untuk verifikasi, lalu login.'
    mode.value = 'login'
    form.password = ''
    form.confirmPassword = ''
  }

  loading.value = false
}

async function handleForgotPassword() {
  if (!form.email) { error.value = 'Masukkan email terlebih dahulu.'; return }
  loading.value = true
  const { error: err } = await supabase.auth.resetPasswordForEmail(form.email)
  loading.value = false
  if (err) { error.value = translateError(err.message); return }
  successMsg.value = 'Link reset password telah dikirim ke email Anda.'
}

function translateError(msg: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email atau password salah.',
    'Email not confirmed': 'Email belum diverifikasi. Cek inbox Anda.',
    'User already registered': 'Email sudah terdaftar. Silakan login.',
    'Password should be at least 6 characters': 'Password minimal 6 karakter.',
    'Email rate limit exceeded': 'Terlalu banyak percobaan. Coba lagi nanti.',
  }
  return map[msg] ?? msg
}
</script>

<style scoped>
.login-card {
  background: white;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  animation: slideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

/* === Logo === */
.login-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 28px 32px 0;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--gradient-primary);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  animation: pulseLogo 2.5s infinite alternate ease-in-out;
}

@keyframes pulseLogo {
  0% { transform: scale(1); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
  100% { transform: scale(1.08); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4); }
}

.logo-icon svg {
  animation: floatSvg 3.5s infinite ease-in-out;
}

@keyframes floatSvg {
  0%, 100% { transform: translateY(0) rotate(0); }
  50% { transform: translateY(-2px) rotate(6deg); }
}

.logo-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
}

/* === Tabs === */
.auth-tabs {
  display: flex;
  margin: 20px 32px 0;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  padding: 4px;
  gap: 4px;
}

.auth-tab {
  flex: 1;
  padding: 8px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.auth-tab:hover { color: var(--color-primary); }

.auth-tab-active {
  background: white !important;
  color: var(--color-primary) !important;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(37, 99, 235, 0.1);
}

/* === Form === */
.login-form-body {
  padding: 20px 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}

.alert-error {
  background: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid #FCA5A5;
}

.alert-success {
  background: var(--color-success-bg);
  color: var(--color-success);
  border: 1px solid #6EE7B7;
}

/* Password field */
.input-pw-wrap {
  position: relative;
}

.input-pw-wrap .form-input {
  padding-right: 38px;
}

.pw-toggle {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color var(--transition-fast);
}

.pw-toggle:hover { color: var(--color-primary); }

.forgot-btn {
  background: none;
  border: none;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-primary);
  cursor: pointer;
  padding: 0;
  transition: opacity var(--transition-fast);
}

.forgot-btn:hover { opacity: 0.7; }

/* Submit */
.btn-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  transition: all var(--transition-base);
  margin-top: 4px;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.btn-submit:active:not(:disabled) { transform: translateY(0); }

.btn-submit:disabled { opacity: 0.65; cursor: not-allowed; }

@keyframes spin { to { transform: rotate(360deg); } }
.spin-icon { animation: spin 1s linear infinite; }
</style>
