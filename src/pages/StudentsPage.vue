<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">Student Management</div>
        <div class="text-grey-7">Manage student details and class enrollments.</div>
      </div>
       <!-- Note: Registration happens via Users Page generally, but we can add a quick link or specific flow here if needed.
            For now, we list existing students and "edit" them to add student-specific details. -->
    </div>

    <!-- STUDENTS TABLE -->
    <q-card flat bordered class="rounded-borders bg-white">
      <q-table
        :rows="students"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :filter="search"
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="search" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
             <div class="text-weight-bold">{{ props.row.full_name }}</div>
             <div class="text-caption text-grey">{{ props.row.email }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-details="props">
           <q-td :props="props">
               <div v-if="props.row.student_details?.student_reg_no">
                   <q-badge color="blue" class="q-mr-xs">{{ props.row.student_details.student_reg_no }}</q-badge>
                   <span class="text-caption">{{ props.row.student_details.school }}</span>
               </div>
               <div v-else class="text-grey-5 italic">No Details Added</div>
           </q-td>
        </template>

        <template v-slot:body-cell-guardian="props">
            <q-td :props="props">
                <div v-if="props.row.student_details?.guardian_name">
                    <div>{{ props.row.student_details.guardian_name }}</div>
                    <div class="text-caption text-primary cursor-pointer">{{ props.row.student_details.guardian_phone }}</div>
                </div>
                <div v-else class="text-grey-5">-</div>
            </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" auto-width>
            <q-btn flat round color="primary" icon="edit_note" size="sm" @click="openStudentDialog(props.row)">
                <q-tooltip>Edit Details</q-tooltip>
            </q-btn>
            <q-btn flat round color="green" icon="class" size="sm" @click="openEnrollmentDialog(props.row)">
                <q-tooltip>Manage Enrollments</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- STUDENT DETAILS DIALOG -->
    <q-dialog v-model="studentDialog.show">
      <q-card style="min-width: 600px" class="rounded-borders">
        <q-card-section>
          <div class="text-h6">Student Details: {{ studentDialog.userName }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none q-gutter-md">
            <div class="row q-col-gutter-sm">
                <div class="col-6">
                    <q-input v-model="studentDialog.form.student_reg_no" label="Reg No / Index" outlined dense />
                </div>
                 <div class="col-6">
                    <q-input v-model="studentDialog.form.school" label="School" outlined dense />
                </div>
                 <div class="col-6">
                    <q-input v-model="studentDialog.form.date_of_birth" label="Date of Birth" type="date" outlined dense stack-label />
                </div>
            </div>

            <q-separator />
            <div class="text-subtitle2 text-grey-8">Guardian Information</div>
            <div class="row q-col-gutter-sm">
                 <div class="col-6">
                    <q-input v-model="studentDialog.form.guardian_name" label="Guardian Name" outlined dense />
                </div>
                 <div class="col-6">
                    <q-input v-model="studentDialog.form.guardian_phone" label="Guardian Phone" outlined dense />
                </div>
                 <div class="col-12">
                    <q-input v-model="studentDialog.form.address" label="Address" outlined dense type="textarea" rows="2" />
                </div>
            </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Details" color="primary" @click="saveStudentDetails" :loading="studentDialog.saving" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- ENROLLMENT DIALOG -->
    <q-dialog v-model="enrollDialog.show">
        <q-card style="min-width: 500px" class="rounded-borders">
            <q-card-section>
                <div class="text-h6">Class Enrollments</div>
                <div class="text-caption text-grey">{{ enrollDialog.userName }}</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
                 <div class="row q-mb-md">
                     <q-select
                        v-model="enrollDialog.selectedClass"
                        :options="classOptions"
                        :option-label="opt => `${opt.subjects?.name} - ${opt.grades?.name} (${opt.day_of_week})`"
                        label="Select Class to Enroll"
                        outlined
                        dense
                        class="col-grow q-mr-sm"
                     />
                     <q-btn label="Enroll" color="primary" unelevated @click="enrollStudent" :loading="enrollDialog.processing" :disable="!enrollDialog.selectedClass" />
                 </div>

                 <q-list bordered separator class="rounded-borders">
                     <q-item-label header class="bg-grey-2">Current Classes</q-item-label>
                     <q-item v-for="enr in enrollDialog.currentEnrollments" :key="enr.id">
                         <q-item-section>
                             <q-item-label class="text-weight-bold">{{ enr.classes?.subjects?.name }}</q-item-label>
                             <q-item-label caption>{{ enr.classes?.grades?.name }} | {{ enr.classes?.day_of_week }} {{ enr.classes?.start_time }}</q-item-label>
                         </q-item-section>
                         <q-item-section side>
                             <q-btn flat round color="negative" icon="remove_circle_outline" size="sm" @click="unenrollStudent(enr.id)" />
                         </q-item-section>
                     </q-item>
                     <div v-if="enrollDialog.currentEnrollments.length === 0" class="q-pa-md text-center text-grey">
                         No active enrollments
                     </div>
                 </q-list>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Close" v-close-popup />
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
const students = ref([])
const search = ref('')
const classOptions = ref([])

const columns = [
  { name: 'name', label: 'Student Name', align: 'left', field: 'full_name', sortable: true },
  { name: 'details', label: 'School / Reg No', align: 'left' },
  { name: 'guardian', label: 'Guardian Info', align: 'left' },
  { name: 'actions', label: 'Actions', align: 'right' }
]

const studentDialog = reactive({
    show: false,
    saving: false,
    id: null, // Profile ID
    userName: '',
    form: {
        student_reg_no: '',
        school: '',
        guardian_name: '',
        guardian_phone: '',
        address: '',
        date_of_birth: ''
    }
})

const enrollDialog = reactive({
    show: false,
    processing: false,
    studentId: null,
    userName: '',
    currentEnrollments: [],
    selectedClass: null
})

const fetchStudents = async () => {
    loading.value = true
    // Fetch profiles where role is student, AND left join student_details
    // Note: Supabase JS doesn't support complex left joins easily on 'profiles' if 'students' is separate without defined view or relation setup carefully.
    // However, if we defined FK on students.id -> profiles.id, we can select from students joined profiles? No, profiles is master.
    // Let's select from profiles and also fetch students table.
    // Better strategy: Select profiles, and select students data.

    const { data: profiles, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })

    if (pError) {
        console.error(pError)
        return
    }

    // Fetch details
    const { data: details, error: dError } = await supabase.from('students').select('*')

    if (dError) console.error('Error fetching student details:', dError)

    // Merge
    students.value = profiles.map(p => {
        const det = details?.find(d => d.id === p.id) || {}
        return { ...p, student_details: det }
    })

    loading.value = false
}

const fetchClasses = async () => {
    // For enrollment dropdown
    const { data } = await supabase.from('classes').select('id, day_of_week, start_time, subjects(name), grades(name)')
    if (data) classOptions.value = data
}

// --- DETAILS ---
const openStudentDialog = (row) => {
    studentDialog.id = row.id
    studentDialog.userName = row.full_name
    const d = row.student_details || {}
    studentDialog.form = {
        student_reg_no: d.student_reg_no || '',
        school: d.school || '',
        guardian_name: d.guardian_name || '',
        guardian_phone: d.guardian_phone || '',
        address: d.address || '',
        date_of_birth: d.date_of_birth || ''
    }
    studentDialog.show = true
}

const saveStudentDetails = async () => {
    studentDialog.saving = true
    try {
        const payload = { ...studentDialog.form, id: studentDialog.id }

        // Upsert into students table
        const { error } = await supabase.from('students').upsert(payload, { onConflict: 'id' })

        if (error) throw error

        $q.notify({ type: 'positive', message: 'Details saved' })
        studentDialog.show = false
        fetchStudents()
    } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Failed to save details' })
    } finally {
        studentDialog.saving = false
    }
}

// --- ENROLLMENTS ---
const openEnrollmentDialog = async (row) => {
    enrollDialog.studentId = row.id
    enrollDialog.userName = row.full_name
    enrollDialog.selectedClass = null
    enrollDialog.show = true
    await fetchEnrollments(row.id)
}

const fetchEnrollments = async (studentId) => {
    const { data } = await supabase.from('enrollments')
        .select('id, classes(id, day_of_week, start_time, subjects(name), grades(name))')
        .eq('student_id', studentId)
    enrollDialog.currentEnrollments = data || []
}

const enrollStudent = async () => {
    if (!enrollDialog.selectedClass) return
    enrollDialog.processing = true
    try {
        const { error } = await supabase.from('enrollments').insert({
            student_id: enrollDialog.studentId,
            class_id: enrollDialog.selectedClass.id
        })
        if (error) {
            if (error.code === '23505') throw new Error('Student already enrolled in this class')
            throw error
        }
        $q.notify({ type: 'positive', message: 'Enrolled successfully' })
        enrollDialog.selectedClass = null
        await fetchEnrollments(enrollDialog.studentId)
    } catch (err) {
        $q.notify({ type: 'negative', message: err.message || 'Enrollment failed' })
    } finally {
        enrollDialog.processing = false
    }
}

const unenrollStudent = async (enrollmentId) => {
    const { error } = await supabase.from('enrollments').delete().eq('id', enrollmentId)
    if (error) $q.notify({ type: 'negative', message: 'Failed to unenroll' })
    else {
        $q.notify({ type: 'positive', message: 'Unenrolled' })
        await fetchEnrollments(enrollDialog.studentId)
    }
}


onMounted(() => {
    fetchStudents()
    fetchClasses()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
.italic { font-style: italic; }
</style>
