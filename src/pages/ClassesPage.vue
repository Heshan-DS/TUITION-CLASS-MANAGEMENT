<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">Class Management</div>
        <div class="text-grey-7">Schedule and manage tuition classes.</div>
      </div>
      <q-btn color="primary" icon="add" label="Create Class" no-caps unelevated rounded @click="openClassDialog()" />
    </div>

    <q-card flat bordered class="rounded-borders bg-white">
      <q-table
        :rows="classes"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-subject="props">
          <q-td :props="props">
            <div class="text-weight-bold">{{ props.row.subjects?.name }}</div>
            <div class="text-caption text-grey">{{ props.row.subjects?.code }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-grade="props">
          <q-td :props="props">
            <q-chip size="sm" color="blue-1" text-color="primary">{{ props.row.grades?.name }}</q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-teacher="props">
          <q-td :props="props">
             <div v-if="props.row.profiles">
                <q-avatar size="xs" color="purple-1" text-color="purple" icon="person" class="q-mr-xs" />
                {{ props.row.profiles.full_name }}
             </div>
             <div v-else class="text-grey-5 italic">Unassigned</div>
          </q-td>
        </template>

        <template v-slot:body-cell-schedule="props">
            <q-td :props="props">
                <div class="row items-center">
                    <q-icon name="event" size="xs" color="grey-6" class="q-mr-xs" />
                    <span class="text-weight-medium">{{ props.row.day_of_week }}</span>
                </div>
                <div class="row items-center q-mt-xs">
                     <q-icon name="schedule" size="xs" color="grey-6" class="q-mr-xs" />
                     <span class="text-caption">{{ formatTime(props.row.start_time) }} - {{ formatTime(props.row.end_time) }}</span>
                </div>
            </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round color="primary" icon="edit" size="sm" @click="openClassDialog(props.row)" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- CLASS DIALOG -->
    <q-dialog v-model="dialog.show">
      <q-card style="min-width: 500px" class="rounded-borders">
        <q-card-section>
          <div class="text-h6">{{ dialog.isEdit ? 'Edit' : 'Create' }} Class</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md">
           <!-- Subject Select -->
           <q-select
            v-model="dialog.form.subject"
            :options="subjectOptions"
            option-label="name"
            label="Subject"
            outlined
            dense
            :rules="[val => !!val || 'Required']"
           />

           <!-- Grade Select -->
           <q-select
            v-model="dialog.form.grade"
            :options="gradeOptions"
            option-label="name"
            label="Grade/Batch"
            outlined
            dense
            :rules="[val => !!val || 'Required']"
           />

           <!-- Teacher Select -->
           <q-select
            v-model="dialog.form.teacher"
            :options="teacherOptions"
            option-label="full_name"
            label="Teacher"
            outlined
            dense
            hint="Select a staff member"
           />

           <div class="row q-col-gutter-sm">
                <div class="col-12">
                     <q-select
                        v-model="dialog.form.day_of_week"
                        :options="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                        label="Day of Week"
                        outlined
                        dense
                        :rules="[val => !!val || 'Required']"
                    />
                </div>
                <div class="col-6">
                    <q-input v-model="dialog.form.start_time" label="Start Time" outlined dense type="time" :rules="[val => !!val || 'Required']" />
                </div>
                <div class="col-6">
                     <q-input v-model="dialog.form.end_time" label="End Time" outlined dense type="time" :rules="[val => !!val || 'Required']" />
                </div>
           </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Class" color="primary" @click="saveClass" :loading="dialog.saving" />
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
const classes = ref([])

// Dropdown Options
const subjectOptions = ref([])
const gradeOptions = ref([])
const teacherOptions = ref([])

const columns = [
  { name: 'subject', label: 'Subject', align: 'left' },
  { name: 'grade', label: 'Grade', align: 'left' },
  { name: 'teacher', label: 'Teacher', align: 'left' },
  { name: 'schedule', label: 'Schedule', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const dialog = reactive({
  show: false,
  isEdit: false,
  saving: false,
  id: null,
  form: {
    subject: null,
    grade: null,
    teacher: null,
    day_of_week: 'Monday',
    start_time: '',
    end_time: ''
  }
})

const fetchHelpers = async () => {
    // Fetch Subjects
    const { data: sData } = await supabase.from('subjects').select('id, name, code')
    if (sData) subjectOptions.value = sData

    // Fetch Grades
    const { data: gData } = await supabase.from('grades').select('id, name')
    if (gData) gradeOptions.value = gData

    // Fetch Teachers (Users with role != student, ideal: role=staff or admin)
    // Note: In real app, filter by role. Here fetching all showing profiles for simplicity or filtered.
    const { data: tData } = await supabase.from('profiles').select('id, full_name, email').neq('role', 'student')
    if (tData) teacherOptions.value = tData
}

const fetchClasses = async () => {
  loading.value = true
  // Verify relation names using Supabase introspection if needed, usually it matches table name
  const { data, error } = await supabase
    .from('classes')
    .select(`
      id, day_of_week, start_time, end_time,
      subjects (id, name, code),
      grades (id, name),
      profiles (id, full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
     $q.notify({ type: 'negative', message: 'Failed to load classes' })
  } else {
    classes.value = data
  }
  loading.value = false
}

const openClassDialog = (row = null) => {
  dialog.isEdit = !!row
  dialog.id = row ? row.id : null

  if (row) {
      // Find objects in options to bind correctly
      const sub = subjectOptions.value.find(s => s.id === row.subjects?.id)
      const gra = gradeOptions.value.find(g => g.id === row.grades?.id)
      const tea = teacherOptions.value.find(t => t.id === row.profiles?.id)

      dialog.form = {
          subject: sub || null,
          grade: gra || null,
          teacher: tea || null,
          day_of_week: row.day_of_week,
          start_time: row.start_time,
          end_time: row.end_time
      }
  } else {
      dialog.form = {
          subject: null,
          grade: null,
          teacher: null,
          day_of_week: 'Monday',
          start_time: '',
          end_time: ''
      }
  }
  dialog.show = true
}

const saveClass = async () => {
    if (!dialog.form.subject || !dialog.form.grade || !dialog.form.day_of_week || !dialog.form.start_time || !dialog.form.end_time) {
        $q.notify({ type: 'warning', message: 'Please fill all required fields' })
        return
    }

    dialog.saving = true
    try {
        const payload = {
            subject_id: dialog.form.subject.id,
            grade_id: dialog.form.grade.id,
            teacher_id: dialog.form.teacher?.id || null,
            day_of_week: dialog.form.day_of_week,
            start_time: dialog.form.start_time,
            end_time: dialog.form.end_time
        }

        let error
        if (dialog.isEdit) {
            ({ error } = await supabase.from('classes').update(payload).eq('id', dialog.id))
        } else {
            ({ error } = await supabase.from('classes').insert(payload))
        }

        if (error) throw error

        $q.notify({ type: 'positive', message: 'Class saved successfully' })
        dialog.show = false
        fetchClasses()
    } catch (error) {
         console.error(error)
         $q.notify({ type: 'negative', message: error.message || 'Failed to save class' })
    } finally {
        dialog.saving = false
    }
}

const confirmDelete = (row) => {
    $q.dialog({
        title: 'Confirm',
        message: 'Delete this class schedule?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const { error } = await supabase.from('classes').delete().eq('id', row.id)
        if (error) $q.notify({ type: 'negative', message: error.message })
        else {
             $q.notify({ type: 'positive', message: 'Class deleted' })
             fetchClasses()
        }
    })
}

const formatTime = (timeStr) => {
    if (!timeStr) return ''
    // timeStr is HH:mm:ss
    const [h, m] = timeStr.split(':')
    const date = new Date()
    date.setHours(h, m)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
    await fetchHelpers()
    await fetchClasses()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
.italic { font-style: italic; }
</style>
