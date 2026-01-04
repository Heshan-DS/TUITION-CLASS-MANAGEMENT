<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Header -->
    <q-header class="bg-white text-grey-9 shadow-1" height-hint="64">
      <q-toolbar class="q-px-lg" style="height: 70px;">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-weight-bold text-h6">
          <span class="text-primary">Tuition</span>Manager
        </q-toolbar-title>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn round dense flat color="grey-7" icon="search">
            <q-tooltip>Search</q-tooltip>
          </q-btn>
          <q-btn round dense flat color="grey-7" icon="notifications">
            <q-badge color="red" text-color="white" floating>2</q-badge>
            <q-tooltip>Notifications</q-tooltip>
          </q-btn>
          <q-btn round flat class="q-ml-md">
            <q-avatar size="36px">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png">
            </q-avatar>
            <q-menu>
              <q-list style="min-width: 150px">
                <q-item clickable v-close-popup @click="router.push('/dashboard/profile')">
                   <q-item-section>Profile</q-item-section>
                </q-item>
                <q-separator />
                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section class="text-red">Logout</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Sidebar -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      class="bg-white"
      :width="260"
    >
      <q-scroll-area class="fit">
        <q-list padding class="text-grey-8">
          <q-item-label header class="text-weight-bold text-uppercase text-grey-6 q-mb-sm q-mt-sm">
            Main Menu
          </q-item-label>

          <q-item
            v-for="link in mainLinks"
            :key="link.text"
            clickable
            v-ripple
            :to="link.to"
            active-class="text-primary bg-blue-1"
            class="q-mb-xs"
            style="border-radius: 0 32px 32px 0; margin-right: 12px;"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section class="text-weight-medium">
              {{ link.text }}
            </q-item-section>
          </q-item>

          <q-separator class="q-my-md q-mx-lg" />

          <q-item-label header class="text-weight-bold text-uppercase text-grey-6 q-mb-sm">
            Management
          </q-item-label>

           <q-item
            v-for="link in manageLinks"
            :key="link.text"
            clickable
            v-ripple
            :to="link.to"
            active-class="text-primary bg-blue-1"
             class="q-mb-xs"
            style="border-radius: 0 32px 32px 0; margin-right: 12px;"
          >
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section class="text-weight-medium">
              {{ link.text }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'stores/auth'

const leftDrawerOpen = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const mainLinks = [
  { icon: 'dashboard', text: 'Dashboard', to: '/dashboard' },
]

const manageLinks = [
  { icon: 'class', text: 'Classes', to: '/dashboard/classes' },
  { icon: 'library_books', text: 'Subjects', to: '/dashboard/subjects' },
  { icon: 'event_note', text: 'Exams', to: '/dashboard/exams' },
  { icon: 'how_to_reg', text: 'Attendance', to: '/dashboard/attendance' },
  { icon: 'school', text: 'Students', to: '/dashboard/students' },
  { icon: 'people', text: 'Users', to: '/dashboard/users' },
]
</script>
