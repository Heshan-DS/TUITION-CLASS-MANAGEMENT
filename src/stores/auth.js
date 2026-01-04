import { defineStore } from 'pinia'
import { supabase } from 'boot/supabase'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)

  // Initialize session
  const init = async () => {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user || null

    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
    })
  }

  const logout = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  return {
    user,
    init,
    logout
  }
})
