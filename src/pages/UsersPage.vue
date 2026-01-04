<template>
  <q-page class="q-pa-lg bg-grey-1">
    <!-- Header Section -->
    <div class="row items-center justify-between q-mb-xl">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9 q-mb-xs">User Management</div>
        <div class="text-grey-7">Manage system access, roles, and user accounts.</div>
      </div>
      <q-btn
        color="primary"
        icon="add"
        label="Add New User"
        no-caps
        unelevated
        rounded
        size="md"
        class="q-px-md"
        @click="showAddUserDialog"
      />
    </div>

    <!-- Stats Cards -->
    <div class="row q-col-gutter-md q-mb-xl">
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="blue-1" text-color="primary" icon="group" size="lg" font-size="24px" />
            <div class="q-ml-md">
              <div class="text-grey-7 text-caption text-uppercase text-weight-bold">Total Users</div>
              <div class="text-h5 text-weight-bold text-grey-9">{{ users.length }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="green-1" text-color="green-7" icon="school" size="lg" font-size="24px" />
            <div class="q-ml-md">
              <div class="text-grey-7 text-caption text-uppercase text-weight-bold">Students</div>
              <div class="text-h5 text-weight-bold text-grey-9">{{ users.filter(u => u.role === 'student').length }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="purple-1" text-color="purple-7" icon="work_outline" size="lg" font-size="24px" />
            <div class="q-ml-md">
              <div class="text-grey-7 text-caption text-uppercase text-weight-bold">Staff</div>
              <div class="text-h5 text-weight-bold text-grey-9">{{ users.filter(u => u.role === 'staff').length }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
       <div class="col-12 col-md-3">
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center no-wrap">
            <q-avatar color="orange-1" text-color="orange-7" icon="admin_panel_settings" size="lg" font-size="24px" />
            <div class="q-ml-md">
              <div class="text-grey-7 text-caption text-uppercase text-weight-bold">Admins</div>
              <div class="text-h5 text-weight-bold text-grey-9">{{ users.filter(u => u.role === 'admin').length }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Users Table Card -->
    <q-card flat bordered class="rounded-borders shadow-1 bg-white">
      <q-card-section class="q-px-lg q-py-md row items-center justify-between border-bottom">
        <div class="text-h6 text-weight-bold text-grey-9">All Users</div>
        <div class="row q-gutter-sm">
             <q-input
                v-model="search"
                borderless
                dense
                placeholder="Search users..."
                class="bg-grey-1 rounded-borders q-px-md"
                style="min-width: 250px"
             >
                <template v-slot:append>
                  <q-icon name="search" color="grey-6" />
                </template>
             </q-input>
             <q-btn flat round color="grey-7" icon="refresh" @click="fetchUsers">
                <q-tooltip>Refresh List</q-tooltip>
             </q-btn>
        </div>
      </q-card-section>

      <q-separator />

      <q-table
        :rows="users"
        :columns="columns"
        row-key="id"
        flat
        :filter="search"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        table-header-class="text-grey-7 text-weight-bold bg-grey-1"
      >
        <template v-slot:body-cell-email="props">
            <q-td :props="props">
                <div class="row items-center">
                    <q-avatar size="sm" color="grey-3" text-color="grey-8" class="q-mr-sm">
                        {{ props.row.email.charAt(0).toUpperCase() }}
                    </q-avatar>
                    <span class="text-weight-medium">{{ props.row.email }}</span>
                </div>
            </q-td>
        </template>

        <template v-slot:body-cell-role="props">
          <q-td :props="props">
            <q-chip
              :color="getRoleColor(props.row.role)"
              text-color="white"
              size="sm"
              class="text-weight-bold text-uppercase q-ma-none"
              square
              outline
              :style="{ 'border-color': 'transparent', 'background': getRoleBgColor(props.row.role), 'color': getRoleTextColor(props.row.role) }"
            >
              {{ props.row.role || 'User' }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round color="primary" icon="edit_note" size="sm" class="q-mr-xs" @click="editUser(props.row)">
              <q-tooltip>Edit Details</q-tooltip>
            </q-btn>
            <q-btn flat round color="grey-5" icon="delete_outline" size="sm" class="hover-red" @click="confirmDelete(props.row)">
              <q-tooltip content-class="bg-negative">Delete User</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Edit User Dialog -->
    <q-dialog v-model="editDialog" transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 400px" class="rounded-borders">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Edit User Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg q-gutter-y-md">
           <q-input v-model="selectedUser.full_name" label="Full Name" outlined dense bg-color="grey-1" />
           <q-input v-model="selectedUser.email" label="Email Address" outlined dense bg-color="grey-1" />
           <q-select
            v-model="selectedUser.role"
            :options="roleOptions"
            label="User Role"
            outlined
            dense
            bg-color="grey-1"
            transition-show="jump-up"
            transition-hide="jump-up"
          />
           <q-input
            v-model="selectedUser.password"
            label="New Password"
            type="password"
            outlined
            dense
            bg-color="grey-1"
            hint="Leave empty to keep current password"
           />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps class="q-mr-sm" />
          <q-btn unelevated label="Save Changes" color="primary" @click="updateUserRole" :loading="updating" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Add User Dialog -->
    <q-dialog v-model="addUserDialog" transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 400px" class="rounded-borders">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add New User</div>
           <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg q-gutter-y-md">
           <q-input v-model="newUser.full_name" label="Full Name" outlined dense bg-color="grey-1" />
           <q-input v-model="newUser.email" label="Email Address" type="email" outlined dense bg-color="grey-1" />
           <q-input v-model="newUser.password" label="Password" type="password" outlined dense bg-color="grey-1" />
           <q-select
            v-model="newUser.role"
            :options="roleOptions"
            label="Assign Role"
            outlined
            dense
            bg-color="grey-1"
            transition-show="jump-up"
            transition-hide="jump-up"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn flat label="Cancel" color="grey" v-close-popup no-caps class="q-mr-sm" />
          <q-btn unelevated label="Create User" @click="createUser" :loading="creating" color="primary" no-caps />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const users = ref([])
const editDialog = ref(false)
const addUserDialog = ref(false)
const selectedUser = ref({})
const updating = ref(false)
const creating = ref(false)

const newUser = reactive({
    full_name: '',
    email: '',
    password: '',
    role: 'student'
})

const roleOptions = ['admin', 'staff', 'student']

const columns = [
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: true },
  { name: 'full_name', label: 'Full Name', align: 'left', field: 'full_name', sortable: true },
  { name: 'role', label: 'Role', align: 'center', field: 'role', sortable: true },
  { name: 'created_at', label: 'Joined Date', align: 'left', field: row => new Date(row.created_at).toLocaleDateString(), sortable: true },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const fetchUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    users.value = data
  } catch (error) {
    console.error('Error fetching users:', error)
     $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Failed to fetch users'
    })
  } finally {
    loading.value = false
  }
}

const search = ref('')

const getRoleColor = () => {
    // Return transparent or outline friendly colors if using custom style,
    // but for simple chips keep solid colors or use soft bg
   return 'transparent'
}

const getRoleBgColor = (role) => {
  switch (role) {
    case 'admin': return '#ffebee' // red-1
    case 'staff': return '#f3e5f5' // purple-1
    case 'student': return '#e8f5e9' // green-1
    default: return '#f5f5f5'
  }
}

const getRoleTextColor = (role) => {
  switch (role) {
    case 'admin': return '#c62828' // red-8
    case 'staff': return '#6a1b9a' // purple-8
    case 'student': return '#2e7d32' // green-8
    default: return '#616161'
  }
}

const showAddUserDialog = () => {
    newUser.full_name = ''
    newUser.email = ''
    newUser.password = ''
    newUser.role = 'student'
    addUserDialog.value = true
}

const createUser = async () => {
    creating.value = true
    try {
        const { error } = await supabase.functions.invoke('create-user', {
            body: newUser
        })

        if (error) throw error

        $q.notify({ type: 'positive', message: 'User created successfully!' })
        addUserDialog.value = false
        setTimeout(fetchUsers, 1000) // Small delay to allow trigger to settle
    } catch (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: error.message || 'Failed to create user' })
    } finally {
        creating.value = false
    }
}

const editUser = (user) => {
  selectedUser.value = { ...user } // Make a copy
  editDialog.value = true
}

const updateUserRole = async () => {
    updating.value = true
    try {
        const payload = {
            user_id: selectedUser.value.id,
            email: selectedUser.value.email,
            full_name: selectedUser.value.full_name,
            role: selectedUser.value.role
        }

        if (selectedUser.value.password) {
            payload.password = selectedUser.value.password
        }

        const { error } = await supabase.functions.invoke('update-user', {
            body: payload
        })

        if (error) throw error

        $q.notify({ type: 'positive', message: 'User updated successfully' })
        editDialog.value = false
        fetchUsers() // Refresh list
    } catch (error) {
        $q.notify({ type: 'negative', message: error.message || 'Failed to update user' })
    } finally {
        updating.value = false
    }
}

const confirmDelete = (user) => {
    if (!user) return
    $q.dialog({
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete user ${user.email} (ID: ${user.id})? This cannot be undone.`,
        persistent: true,
        ok: { label: 'Delete', color: 'negative', flat: true },
        cancel: { label: 'Cancel', color: 'grey', flat: true }
    }).onOk(() => {
        if (user.id) deleteUser(user.id)
    })
}

const deleteUser = async (userId) => {
    loading.value = true
    try {
        const { error } = await supabase.functions.invoke('delete-user', {
            body: { user_id: userId }
        })

        if (error) {
             const msg = error.message || error.toString()
             throw new Error(msg)
        }

        $q.notify({ type: 'positive', message: 'User deleted successfully' })
        fetchUsers()
    } catch (error) {
        console.error('Delete error:', error)
         $q.dialog({
            title: 'Error Deleting User',
            message: `Failed to delete user. Error: ${error.message}`,
            persistent: true,
            ok: { label: 'OK', color: 'negative' }
        })
    } finally {
        loading.value = false
    }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
.hover-red:hover {
    color: #e53935 !important;
    background: #ffebee;
}
</style>
