<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-weight-bold text-grey-9 q-mb-lg">My Profile</div>

    <div class="row q-col-gutter-lg">
      <!-- Profile Card -->
      <div class="col-12 col-md-4">
        <q-card flat bordered class="rounded-borders text-center q-pa-lg">
          <q-card-section>
            <q-avatar size="120px" class="q-mb-md relative-position">
              <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              <q-btn
                round
                color="primary"
                icon="edit"
                size="sm"
                class="absolute-bottom-right"
                style="bottom: 0; right: 0;"
              />
            </q-avatar>
            <div class="text-h5 text-weight-bold text-grey-9">{{ profile.name || 'User Name' }}</div>
            <div class="text-grey-6">{{ authStore.user?.email }}</div>
            <q-chip color="blue-1" text-color="blue" class="q-mt-sm">Administrator</q-chip>
          </q-card-section>

          <q-separator class="q-my-md" />

          <q-card-section class="q-pt-none text-left">
            <div class="text-weight-bold text-grey-8 q-mb-sm">Details</div>
            <q-list dense>
              <q-item class="q-px-none">
                <q-item-section avatar min-width="40px"><q-icon name="mail" color="grey-6" /></q-item-section>
                <q-item-section class="text-grey-8">{{ authStore.user?.email }}</q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section avatar min-width="40px"><q-icon name="phone" color="grey-6" /></q-item-section>
                <q-item-section class="text-grey-8">{{ profile.phone || '+94 77 123 4567' }}</q-item-section>
              </q-item>
              <q-item class="q-px-none">
                <q-item-section avatar min-width="40px"><q-icon name="location_on" color="grey-6" /></q-item-section>
                <q-item-section class="text-grey-8">{{ profile.location || 'Colombo, Sri Lanka' }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Edit Profile Form -->
      <div class="col-12 col-md-8">
        <q-card flat bordered class="rounded-borders full-height">
          <q-tabs
            v-model="tab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="general" label="General Info" />
            <q-tab name="security" label="Security" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <!-- General Info Tab -->
            <q-tab-panel name="general" class="q-pa-lg">
              <div class="text-h6 text-weight-bold text-grey-9 q-mb-md">Edit Profile</div>
              <q-form @submit.prevent="updateProfile">
                <div class="row q-col-gutter-md">
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="profile.name" label="Full Name" dense />
                  </div>
                  <div class="col-12 col-md-6">
                    <q-input outlined v-model="profile.phone" label="Phone Number" dense />
                  </div>
                  <div class="col-12">
                    <q-input outlined v-model="profile.location" label="Location" dense />
                  </div>
                  <div class="col-12">
                    <q-input outlined v-model="profile.bio" type="textarea" label="Bio" dense />
                  </div>
                </div>
                <div class="flex justify-end q-mt-lg">
                  <q-btn label="Save Changes" type="submit" color="primary" unelevated no-caps />
                </div>
              </q-form>
            </q-tab-panel>

            <!-- Security Tab -->
            <q-tab-panel name="security" class="q-pa-lg">
              <div class="text-h6 text-weight-bold text-grey-9 q-mb-md">Change Password</div>
              <q-form @submit.prevent="updatePassword">
                <div class="q-gutter-md" style="max-width: 400px;">
                  <q-input outlined v-model="passwords.current" type="password" label="Current Password" dense />
                  <q-input outlined v-model="passwords.new" type="password" label="New Password" dense />
                  <q-input outlined v-model="passwords.confirm" type="password" label="Confirm New Password" dense />

                  <q-btn label="Update Password" type="submit" color="primary" unelevated no-caps />
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const $q = useQuasar()

const tab = ref('general')

const profile = reactive({
  name: 'Heshan De Silva',
  phone: '',
  location: '',
  bio: 'Passionate educator and administrator.',
})

const passwords = reactive({
  current: '',
  new: '',
  confirm: '',
})

const updateProfile = () => {
  // Simulate API call
  setTimeout(() => {
    $q.notify({
      color: 'green',
      message: 'Profile updated successfully!',
      icon: 'check'
    })
  }, 500)
}

const updatePassword = () => {
    $q.notify({
      color: 'green',
      message: 'Password updated successfully!',
      icon: 'check'
    })
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
