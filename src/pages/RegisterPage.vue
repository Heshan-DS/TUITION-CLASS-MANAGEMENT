<template>
  <q-page class="bg-black text-white flex flex-center relative-position">
    <!-- Home Button -->
    <q-btn
      to="/"
      flat
      round
      color="white"
      icon="home"
      class="absolute-top-left q-ma-md"
      aria-label="Home"
    >
       <q-tooltip>Back to Home</q-tooltip>
    </q-btn>

    <div class="auth-card-container q-pa-md" style="width: 100%; max-width: 450px;">
      <q-card class="bg-black-glass no-shadow border-grey-9" style="border-radius: 20px;">
        <q-card-section class="q-pt-xl q-pb-lg text-center">
          <div class="text-h4 text-weight-bold q-mb-sm">Create Account</div>
          <div class="text-grey-5">Start managing your classes today</div>
        </q-card-section>

        <q-card-section class="q-px-lg">
          <q-form @submit.prevent="handleRegister" class="q-gutter-md">
            <!-- Email Input -->
            <div>
              <div class="text-grey-5 text-weight-medium q-mb-xs">Email Address</div>
              <q-input
                v-model="email"
                outlined
                dense
                dark
                class="auth-input"
                placeholder="hello@example.com"
                :rules="[val => !!val || 'Email is required', val => /.+@.+\..+/.test(val) || 'Invalid email']"
              >
                <template v-slot:prepend>
                  <q-icon name="mail" color="grey-6" />
                </template>
              </q-input>
            </div>

            <!-- Password Input -->
            <div>
              <div class="text-grey-5 text-weight-medium q-mb-xs">Password</div>
              <q-input
                v-model="password"
                outlined
                dense
                dark
                class="auth-input"
                type="password"
                placeholder="••••••••"
                :rules="[val => !!val || 'Password is required', val => val.length >= 6 || 'Min 6 characters']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="grey-6" />
                </template>
              </q-input>
            </div>

             <!-- Confirm Password Input -->
            <div>
              <div class="text-grey-5 text-weight-medium q-mb-xs">Confirm Password</div>
              <q-input
                v-model="confirmPassword"
                outlined
                dense
                dark
                class="auth-input"
                type="password"
                placeholder="••••••••"
                :rules="[
                  val => !!val || 'Please confirm your password',
                  val => val === password || 'Passwords do not match'
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="lock_clock" color="grey-6" />
                </template>
              </q-input>
            </div>

            <!-- Submit Button -->
            <div class="q-pt-md">
              <q-btn
                type="submit"
                label="Sign Up"
                color="white"
                text-color="black"
                class="full-width text-weight-bold"
                rounded
                size="lg"
                no-caps
                :loading="loading"
              />
            </div>
          </q-form>
        </q-card-section>

        <q-card-section class="text-center q-pb-xl">
          <div class="text-grey-6">
            Already have an account?
            <router-link to="/login" class="text-white text-weight-bold no-decoration hover-underline">
              Login
            </router-link>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'check_circle',
      message: 'Registration successful! Please check your email.'
    })

    router.push('/login')
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: error.message
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-black-glass {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.1);
}

.auth-input :deep(.q-field__control) {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.05);
}

.auth-input :deep(.q-field__control:hover) {
  background: rgba(255, 255, 255, 0.1);
}

.auth-input :deep(.q-field__native) {
  padding-left: 8px;
}

.no-decoration {
  text-decoration: none;
}

.hover-underline:hover {
  text-decoration: underline;
}
</style>
