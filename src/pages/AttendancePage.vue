<template>
  <q-page class="q-pa-lg bg-grey-1">
    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">Attendance</div>
        <div class="text-grey-7">Mark and view daily attendance.</div>
      </div>
    </div>

    <!-- FILTERS -->
    <q-card flat bordered class="rounded-borders bg-white q-mb-md">
      <q-card-section class="row q-col-gutter-md items-end">
        <div class="col-12 col-md-4">
           <q-select
            v-model="filters.class"
            :options="classOptions"
            :option-label="opt => `${opt.subjects?.name} - ${opt.grades?.name} (${opt.day_of_week})`"
            label="Select Class"
            outlined
            dense
            @update:model-value="fetchAttendanceData"
           />
        </div>
        <div class="col-12 col-md-3">
            <q-input v-model="filters.date" label="Date" type="date" outlined dense @update:model-value="fetchAttendanceData" />
        </div>
        <div class="col-12 col-md-5 text-right">
             <div v-if="loading" class="text-grey">Loading...</div>
             <div v-else-if="students.length > 0" class="text-subtitle1">
                 Total Students: <span class="text-weight-bold">{{ students.length }}</span> |
                 Present: <span class="text-weight-bold text-green">{{ presentCount }}</span>
             </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- ATTENDANCE LIST -->
    <q-card v-if="filters.class" flat bordered class="rounded-borders bg-white">
      <q-table
        :rows="students"
        :columns="columns"
        row-key="id"
        flat
        :loading="loading"
        :pagination="{ rowsPerPage: 0 }"
        hide-bottom
      >
        <template v-slot:body-cell-status="props">
            <q-td :props="props">
                <q-btn-group unelevated>
                    <q-btn
                        :color="props.row.status === 'Present' ? 'green' : 'grey-3'"
                        :text-color="props.row.status === 'Present' ? 'white' : 'black'"
                        label="Present"
                        size="sm"
                        @click="markStatus(props.row, 'Present')"
                    />
                     <q-btn
                        :color="props.row.status === 'Absent' ? 'red' : 'grey-3'"
                        :text-color="props.row.status === 'Absent' ? 'white' : 'black'"
                        label="Absent"
                        size="sm"
                        @click="markStatus(props.row, 'Absent')"
                    />
                     <q-btn
                        :color="props.row.status === 'Late' ? 'orange' : 'grey-3'"
                        :text-color="props.row.status === 'Late' ? 'white' : 'black'"
                        label="Late"
                        size="sm"
                        @click="markStatus(props.row, 'Late')"
                    />
                </q-btn-group>
            </q-td>
        </template>

        <template v-slot:body-cell-name="props">
             <q-td :props="props">
                 <div class="text-weight-bold">{{ props.row.full_name }}</div>
                 <div class="text-caption text-grey">{{ props.row.email }}</div>
             </q-td>
        </template>
      </q-table>

       <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <q-btn label="Save Attendance" color="primary" unelevated size="lg" @click="saveAttendance" :loading="saving" />
      </q-card-actions>
    </q-card>

    <div v-else class="text-center text-grey q-mt-xl">
        <q-icon name="arrow_upward" size="lg" />
        <div class="text-h6 q-mt-sm">Please select a class to mark attendance</div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { supabase } from 'boot/supabase'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const loading = ref(false)
const saving = ref(false)
const students = ref([]) // List of { id, full_name, ..., status }
const classOptions = ref([])

const filters = reactive({
    class: null,
    date: new Date().toISOString().split('T')[0]
})

const columns = [
  { name: 'name', label: 'Student Name', align: 'left', field: 'full_name', sortable: true },
  { name: 'status', label: 'Attendance Status', align: 'center' }
]

const presentCount = computed(() => students.value.filter(s => s.status === 'Present').length)

const fetchClasses = async () => {
    const { data } = await supabase.from('classes').select('id, day_of_week, start_time, subjects(name), grades(name)')
    if (data) classOptions.value = data
}

const fetchAttendanceData = async () => {
    if (!filters.class || !filters.date) return
    loading.value = true

    try {
        // 1. Fetch Student IDs Enrolled in the Class
        const { data: enrollmentData, error: eError } = await supabase
            .from('enrollments')
            .select('student_id')
            .eq('class_id', filters.class.id)

        if (eError) throw eError

        if (!enrollmentData || enrollmentData.length === 0) {
            students.value = []
            loading.value = false
            return
        }

        const studentIds = enrollmentData.map(e => e.student_id)

        // 2. Fetch Profile Details
        const { data: profilesData, error: pError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', studentIds)
            .order('full_name')

        if (pError) throw pError

        // 3. Fetch Existing Attendance for this Class + Date
        const { data: attendanceData, error: aError } = await supabase
            .from('attendance')
            .select('student_id, status')
            .eq('class_id', filters.class.id)
            .eq('date', filters.date)

        if (aError) throw aError

        // 4. Merge Data
        const existingMap = new Map()
        attendanceData?.forEach(row => existingMap.set(row.student_id, row.status))

        students.value = profilesData.map(profile => ({
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            status: existingMap.get(profile.id) || 'Absent' // Default to Absent
        }))

    } catch (err) {
        console.error(err)
        $q.notify({ type: 'negative', message: 'Failed to load data' })
    } finally {
        loading.value = false
    }
}

const markStatus = (row, status) => {
    row.status = status
}

const saveAttendance = async () => {
    if (!filters.class || !filters.date) return
    saving.value = true
    try {
        const payload = students.value.map(s => ({
            class_id: filters.class.id,
            student_id: s.id,
            date: filters.date,
            status: s.status,
            marked_at: new Date()
        }))

        // Upsert all
        const { error } = await supabase.from('attendance').upsert(payload, { onConflict: 'class_id, student_id, date' })

        if (error) throw error

        $q.notify({ type: 'positive', message: 'Attendance saved successfully' })
    } catch (err) {
        $q.notify({ type: 'negative', message: err.message || 'Failed to save' })
    } finally {
        saving.value = false
    }
}

onMounted(() => {
    fetchClasses()
})
</script>

<style scoped>
.rounded-borders {
  border-radius: 12px;
}
</style>
