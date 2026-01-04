<template>
  <q-page class="q-pa-lg">
    <div class="row q-mb-lg items-center justify-between">
      <div>
        <div class="text-h4 text-weight-bold text-grey-9">Overview</div>
        <div class="text-grey-7">Welcome back, here's what's happening today.</div>
      </div>
      <q-btn color="primary" icon="add" label="New Student" no-caps unelevated rounded />
    </div>

    <!-- Stats Grid -->
    <div class="row q-col-gutter-qd-md q-col-gutter-lg q-mb-xl">
      <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.title">
        <q-card flat bordered class="rounded-borders full-height transition-hover">
          <q-card-section class="row items-center justify-between q-pa-md">
            <div>
              <div class="text-grey-7 text-caption text-weight-medium text-uppercase">{{ stat.title }}</div>
              <div class="text-h4 text-weight-bold text-grey-9 q-mt-xs">{{ stat.value }}</div>
            </div>
            <div :class="`bg-${stat.color}-1 text-${stat.color} q-pa-sm rounded-borders`">
              <q-icon :name="stat.icon" size="24px" />
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none q-pb-md">
             <div class="text-caption">
                <span class="text-positive text-weight-bold"><q-icon name="trending_up" /> 12%</span>
                <span class="text-grey-6"> vs last month</span>
             </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="row q-col-gutter-lg">
      <!-- Quick Actions -->
       <div class="col-12 col-md-8">
          <q-card flat bordered class="rounded-borders full-height">
             <q-card-section class="row items-center justify-between q-pb-none">
                <div class="text-h6 text-weight-bold text-grey-9">Quick Actions</div>
             </q-card-section>
             <q-card-section class="q-pa-lg">
                <div class="row q-col-gutter-md">
                   <div class="col-6 col-sm-4" v-for="action in quickActions" :key="action.label">
                      <q-btn
                        class="full-width q-py-lg bg-grey-1 text-grey-9"
                        flat
                        stack
                        no-caps
                        style="border-radius: 16px;"
                      >
                         <q-icon :name="action.icon" size="32px" :color="action.color" class="q-mb-sm" />
                         <div class="text-weight-bold">{{ action.label }}</div>
                      </q-btn>
                   </div>
                </div>
             </q-card-section>
          </q-card>
       </div>

       <!-- Recent Activity / Notifications -->
       <div class="col-12 col-md-4">
          <q-card flat bordered class="rounded-borders full-height">
             <q-card-section>
                <div class="text-h6 text-weight-bold text-grey-9">Recent Activity</div>
             </q-card-section>
             <q-list separator>
                <div class="text-center text-grey-5 q-py-lg">
                  <q-icon name="history" size="48px" class="q-mb-sm" />
                  <div>No recent activity</div>
                </div>
             </q-list>
          </q-card>
       </div>
    </div>
  </q-page>
</template>

<script setup>
const stats = [
  { title: 'Total Students', value: '0', icon: 'people', color: 'blue' },
  { title: 'Active Classes', value: '0', icon: 'class', color: 'purple' },
  { title: 'Today\'s Attendance', value: '0%', icon: 'fact_check', color: 'green' },
  { title: 'Monthly Revenue', value: '$0', icon: 'payments', color: 'orange' },
]

const quickActions = [
   { label: 'Add Student', icon: 'person_add', color: 'blue' },
   { label: 'Mark Attendance', icon: 'qr_code_scanner', color: 'green' },
   { label: 'Create Invoice', icon: 'receipt_long', color: 'orange' },
   { label: 'Schedule Exam', icon: 'quiz', color: 'purple' },
   { label: 'Send SMS', icon: 'sms', color: 'pink' },
   { label: 'View Reports', icon: 'bar_chart', color: 'cyan' },
]
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
.transition-hover {
  transition: all 0.3s ease;
}
.transition-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
}
</style>
