<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">Exam Schedule</div>
        <div class="text-grey-7">Manage and schedule exams for tuition classes.</div>
      </div>
      <q-btn color="primary" icon="event" label="Schedule Exam" no-caps unelevated rounded @click="openExamDialog()" />
    </div>

    <!-- EXAMS TABLE -->
    <q-card flat bordered class="rounded-borders bg-white">
      <q-table
        :rows="exams"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-exam="props">
          <q-td :props="props">
             <div class="text-weight-bold">{{ props.row.name }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-class="props">
          <q-td :props="props">
            <div v-if="props.row.classes">
                <div class="text-weight-bold">{{ props.row.classes.subjects?.name }}</div>
                <div class="text-caption text-grey">{{ props.row.classes.grades?.name }}</div>
            </div>
            <div v-else class="text-grey">Class Removed</div>
          </q-td>
        </template>

        <template v-slot:body-cell-datetime="props">
          <q-td :props="props">
             <div class="row items-center">
                 <q-icon name="today" size="xs" color="grey-6" class="q-mr-xs" />
                 <span>{{ formatDate(props.row.date) }}</span>
             </div>
              <div class="row items-center q-mt-xs">
                 <q-icon name="access_time" size="xs" color="grey-6" class="q-mr-xs" />
                 <span class="text-caption">{{ formatTime(props.row.start_time) }} ({{ props.row.duration_minutes }} mins)</span>
             </div>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round color="primary" icon="edit" size="sm" @click="openExamDialog(props.row)" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDelete(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- EXAM DIALOG -->
    <q-dialog v-model="dialog.show">
      <q-card style="min-width: 500px" class="rounded-borders">
        <q-card-section>
          <div class="text-h6">{{ dialog.isEdit ? 'Edit' : 'Schedule' }} Exam</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md">
           <!-- Class Selection -->
           <q-select
            v-model="dialog.form.class"
            :options="classOptions"
            :option-label="opt => `${opt.subjects?.name} - ${opt.grades?.name} (${opt.day_of_week})`"
            label="Select Class"
            outlined
            dense
            :rules="[val => !!val || 'Required']"
           />

           <q-input v-model="dialog.form.name" label="Exam Name (e.g. Unit Test 1)" outlined dense :rules="[val => !!val || 'Required']" />

           <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-input v-model="dialog.form.date" label="Date" outlined dense type="date" :rules="[val => !!val || 'Required']" />
                </div>
                <div class="col-6">
                    <q-input v-model="dialog.form.start_time" label="Start Time" outlined dense type="time" :rules="[val => !!val || 'Required']" />
                </div>
                <div class="col-12">
                     <q-input v-model="dialog.form.duration_minutes" label="Duration (Minutes)" outlined dense type="number" :rules="[val => !!val || 'Required']" />
                </div>
           </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Exam" color="primary" @click="saveExam" :loading="dialog.saving" />
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
const exams = ref([])
const classOptions = ref([])

const columns = [
  { name: 'exam', label: 'Exam Name', align: 'left' },
  { name: 'class', label: 'Class', align: 'left' },
  { name: 'datetime', label: 'Date & Time', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const dialog = reactive({
  show: false,
  isEdit: false,
  saving: false,
  id: null,
  form: {
    class: null,
    name: '',
    date: '',
    start_time: '',
    duration_minutes: 60
  }
})

const fetchClasses = async () => {
    // Fetch classes for dropdown
    const { data, error } = await supabase
        .from('classes')
        .select(`
            id, day_of_week, start_time,
            subjects (id, name),
            grades (id, name)
        `)
    if (!error) classOptions.value = data
}

const fetchExams = async () => {
    loading.value = true
    const { data, error } = await supabase
        .from('exams')
        .select(`
            id, name, date, start_time, duration_minutes,
            classes (
                id,
                subjects (name),
                grades (name)
            )
        `)
        .order('date', { ascending: true })

    if (error) {
        console.error(error)
        $q.notify({ type: 'negative', message: 'Failed to load exams' })
    } else {
        exams.value = data
    }
    loading.value = false
}

const openExamDialog = (row = null) => {
    dialog.isEdit = !!row
    dialog.id = row ? row.id : null

    if (row) {
        // Retrieve class object
        const cls = classOptions.value.find(c => c.id === row.classes?.id)

        dialog.form = {
            class: cls || null,
            name: row.name,
            date: row.date,
            start_time: row.start_time,
            duration_minutes: row.duration_minutes
        }
    } else {
        dialog.form = {
            class: null,
            name: '',
            date: new Date().toISOString().split('T')[0],
            start_time: '08:00',
            duration_minutes: 60
        }
    }
    dialog.show = true
}

const saveExam = async () => {
    if (!dialog.form.class || !dialog.form.name || !dialog.form.date) {
         $q.notify({ type: 'warning', message: 'Full details required' })
         return
    }

    dialog.saving = true
    try {
        const payload = {
             class_id: dialog.form.class.id,
             name: dialog.form.name,
             date: dialog.form.date,
             start_time: dialog.form.start_time,
             duration_minutes: dialog.form.duration_minutes
        }

        let error
        if (dialog.isEdit) {
             ({ error } = await supabase.from('exams').update(payload).eq('id', dialog.id))
        } else {
             ({ error } = await supabase.from('exams').insert(payload))
        }

        if (error) throw error

        $q.notify({ type: 'positive', message: 'Exam scheduled successfully' })
        dialog.show = false
        fetchExams()
    } catch (error) {
        $q.notify({ type: 'negative', message: error.message })
    } finally {
        dialog.saving = false
    }
}

const confirmDelete = (row) => {
    $q.dialog({
        title: 'Confirm',
        message: 'Delete this exam?',
        cancel: true,
        persistent: true
    }).onOk(async () => {
        const { error } = await supabase.from('exams').delete().eq('id', row.id)
        if (error) $q.notify({ type: 'negative', message: error.message })
        else {
             $q.notify({ type: 'positive', message: 'Exam deleted' })
             fetchExams()
        }
    })
}

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString()
}

const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    const date = new Date()
    date.setHours(h, m)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
    await fetchClasses()
    await fetchExams()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
