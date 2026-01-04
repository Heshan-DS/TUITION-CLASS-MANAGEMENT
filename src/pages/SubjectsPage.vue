<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">Academic Setup</div>
        <div class="text-grey-7">Manage subjects and grades structure.</div>
      </div>
    </div>

    <q-card flat bordered class="rounded-borders bg-white">
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="subjects" label="Subjects" icon="menu_book" />
        <q-tab name="grades" label="Grades / Batches" icon="school" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <!-- SUBJECTS PANEL -->
        <q-tab-panel name="subjects" class="q-pa-md">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-grey-8">All Subjects</div>
            <q-btn color="primary" icon="add" label="Add Subject" no-caps unelevated rounded @click="openSubjectDialog()" />
          </div>

          <q-table
            :rows="subjects"
            :columns="subjectColumns"
            row-key="id"
            flat
            :loading="loadingSubjects"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" auto-width>
                <q-btn flat round color="primary" icon="edit" size="sm" @click="openSubjectDialog(props.row)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDeleteSubject(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>

        <!-- GRADES PANEL -->
        <q-tab-panel name="grades" class="q-pa-md">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h6 text-grey-8">All Grades</div>
            <q-btn color="primary" icon="add" label="Add Grade" no-caps unelevated rounded @click="openGradeDialog()" />
          </div>

          <q-table
            :rows="grades"
            :columns="gradeColumns"
            row-key="id"
            flat
            :loading="loadingGrades"
            :pagination="{ rowsPerPage: 10 }"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" auto-width>
                <q-btn flat round color="primary" icon="edit" size="sm" @click="openGradeDialog(props.row)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="confirmDeleteGrade(props.row)" />
              </q-td>
            </template>
          </q-table>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

    <!-- SUBJECT DIALOG -->
    <q-dialog v-model="subjectDialog.show">
      <q-card style="min-width: 400px" class="rounded-borders">
        <q-card-section>
          <div class="text-h6">{{ subjectDialog.isEdit ? 'Edit' : 'Add' }} Subject</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-gutter-md">
          <q-input v-model="subjectDialog.form.name" label="Subject Name" outlined dense :rules="[val => !!val || 'Required']" />
          <q-input v-model="subjectDialog.form.code" label="Subject Code (e.g. MAT01)" outlined dense :rules="[val => !!val || 'Required']" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveSubject" :loading="subjectDialog.saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- GRADE DIALOG -->
    <q-dialog v-model="gradeDialog.show">
      <q-card style="min-width: 400px" class="rounded-borders">
        <q-card-section>
          <div class="text-h6">{{ gradeDialog.isEdit ? 'Edit' : 'Add' }} Grade</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-gutter-md">
          <q-input v-model="gradeDialog.form.name" label="Grade Name (e.g. Grade 10)" outlined dense :rules="[val => !!val || 'Required']" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveGrade" :loading="gradeDialog.saving" />
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
const tab = ref('subjects')

// --- SUBJECTS ---
const subjects = ref([])
const loadingSubjects = ref(false)
const subjectColumns = [
  { name: 'name', label: 'Subject Name', field: 'name', align: 'left', sortable: true },
  { name: 'code', label: 'Code', field: 'code', align: 'left', sortable: true },
  { name: 'created_at', label: 'Created', field: row => new Date(row.created_at).toLocaleDateString(), align: 'left' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const subjectDialog = reactive({
  show: false,
  isEdit: false,
  saving: false,
  id: null,
  form: { name: '', code: '' }
})

const fetchSubjects = async () => {
  loadingSubjects.value = true
  const { data, error } = await supabase.from('subjects').select('*').order('created_at', { ascending: false })
  if (!error) subjects.value = data
  loadingSubjects.value = false
}

const openSubjectDialog = (row = null) => {
  subjectDialog.isEdit = !!row
  subjectDialog.id = row ? row.id : null
  subjectDialog.form = row ? { name: row.name, code: row.code } : { name: '', code: '' }
  subjectDialog.show = true
}

const saveSubject = async () => {
  if (!subjectDialog.form.name || !subjectDialog.form.code) return
  subjectDialog.saving = true
  try {
    const payload = { ...subjectDialog.form }
    let error
    if (subjectDialog.isEdit) {
      ({ error } = await supabase.from('subjects').update(payload).eq('id', subjectDialog.id))
    } else {
      ({ error } = await supabase.from('subjects').insert(payload))
    }
    if (error) throw error
    $q.notify({ type: 'positive', message: `Subject ${subjectDialog.isEdit ? 'updated' : 'added'} successfully` })
    subjectDialog.show = false
    fetchSubjects()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    subjectDialog.saving = false
  }
}

const confirmDeleteSubject = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: `Delete subject "${row.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const { error } = await supabase.from('subjects').delete().eq('id', row.id)
    if (error) $q.notify({ type: 'negative', message: error.message })
    else {
      $q.notify({ type: 'positive', message: 'Subject deleted' })
      fetchSubjects()
    }
  })
}

// --- GRADES ---
const grades = ref([])
const loadingGrades = ref(false)
const gradeColumns = [
  { name: 'name', label: 'Grade Name', field: 'name', align: 'left', sortable: true },
  { name: 'created_at', label: 'Created', field: row => new Date(row.created_at).toLocaleDateString(), align: 'left' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const gradeDialog = reactive({
  show: false,
  isEdit: false,
  saving: false,
  id: null,
  form: { name: '' }
})

const fetchGrades = async () => {
  loadingGrades.value = true
  const { data, error } = await supabase.from('grades').select('*').order('created_at', { ascending: false })
  if (!error) grades.value = data
  loadingGrades.value = false
}

const openGradeDialog = (row = null) => {
  gradeDialog.isEdit = !!row
  gradeDialog.id = row ? row.id : null
  gradeDialog.form = row ? { name: row.name } : { name: '' }
  gradeDialog.show = true
}

const saveGrade = async () => {
  if (!gradeDialog.form.name) return
  gradeDialog.saving = true
  try {
    const payload = { ...gradeDialog.form }
    let error
    if (gradeDialog.isEdit) {
      ({ error } = await supabase.from('grades').update(payload).eq('id', gradeDialog.id))
    } else {
      ({ error } = await supabase.from('grades').insert(payload))
    }
    if (error) throw error
    $q.notify({ type: 'positive', message: `Grade ${gradeDialog.isEdit ? 'updated' : 'added'} successfully` })
    gradeDialog.show = false
    fetchGrades()
  } catch (err) {
    $q.notify({ type: 'negative', message: err.message })
  } finally {
    gradeDialog.saving = false
  }
}

const confirmDeleteGrade = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: `Delete grade "${row.name}"?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    const { error } = await supabase.from('grades').delete().eq('id', row.id)
    if (error) $q.notify({ type: 'negative', message: error.message })
    else {
      $q.notify({ type: 'positive', message: 'Grade deleted' })
      fetchGrades()
    }
  })
}

onMounted(() => {
  fetchSubjects()
  fetchGrades()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
