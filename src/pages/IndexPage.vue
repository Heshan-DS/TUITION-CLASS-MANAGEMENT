<template>
  <q-page class="bg-black text-white">
    <!-- Navbar (Fixed & Glassmorphism) -->
    <div class="fixed-top q-px-lg q-py-md flex justify-between items-center bg-black-glass" style="z-index: 1000; max-width: 100vw;">
      <div class="text-h5 text-weight-bold cursor-pointer" @click="$router.push('/')">
        Tution<span class="text-grey-5">Manager</span>
      </div>
      <div>
        <q-btn flat no-caps label="Features" class="text-white text-weight-medium q-mr-sm" />
        <q-btn flat no-caps label="About" class="text-white text-weight-medium q-mr-sm" />

        <template v-if="!authStore.user">
          <q-btn to="/login" outline color="white" text-color="white" label="Login" no-caps class="q-px-md" />
        </template>
        <template v-else>
          <q-btn to="/dashboard" flat color="white" icon="dashboard" label="Dashboard" no-caps class="q-mr-sm" />
          <q-btn @click="handleLogout" outline color="white" text-color="white" label="Logout" no-caps class="q-px-md" />
        </template>
      </div>
    </div>

    <!-- Hero Section -->
    <section class="min-h-screen flex items-center q-px-lg q-py-xl relative-position overflow-hidden" style="min-height: 100vh; padding-top: 140px;">
      <!-- Background Glow Effect -->
      <div class="absolute-top-right bg-primary" style="opacity: 0.15; filter: blur(150px); width: 600px; height: 600px; border-radius: 50%; top: -200px; right: -100px;"></div>

      <div class="row items-center q-col-gutter-xl full-width z-10" style="max-width: 1400px; margin: 0 auto;">
        <div class="col-12 col-md-6 fade-in-left">
          <q-badge color="grey-9" text-color="white" class="q-py-xs q-px-sm q-mb-md">
            <q-icon name="emoji_events" color="amber-4" class="q-mr-xs" /> #1 Tuition Class Management System
          </q-badge>
          <h1 class="text-h2 text-weight-bold q-mb-md lh-tight">
            Elevate Your <br>
            <span class="text-grey-5">Tuition Class</span> <br>
            Experience
          </h1>
          <p class="text-h6 text-grey-5 q-mb-lg" style="line-height: 1.6; max-width: 500px;">
            The all-in-one solution to manage students, exams, fees, and attendance.
            Simple, powerful, and designed for modern education.
          </p>
          <div class="row q-gutter-md">
            <q-btn
              size="lg"
              color="white"
              text-color="black"
              to="/register"
              label="Get Started Now"
              no-caps
              class="q-px-xl text-weight-bold"
            />
            <q-btn
              size="lg"
              outline
              color="grey-5"
              label="View Demo"
              no-caps
              class="q-px-xl"
            />
          </div>

          <div class="q-mt-xl row items-center q-gutter-md text-grey-6">
            <div class="row items-center">
              <q-icon name="check_circle" color="green-13" class="q-mr-sm" /> 100% Free Forever
            </div>
            <div class="row items-center">
              <q-icon name="check_circle" color="green-13" class="q-mr-sm" /> No Credit Card
            </div>
            <div class="row items-center">
              <q-icon name="check_circle" color="green-13" class="q-mr-sm" /> 24/7 Support
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center fade-in-up">
           <div class="relative-position">
              <img
              src="~assets/hero-dashboard-dark.png"
              alt="Dashboard Preview"
              class="hero-image"
            />
           </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="bg-dark-page q-py-xl">
       <div class="q-px-lg" style="max-width: 1200px; margin: 0 auto;">
          <div class="text-center q-mb-xl">
             <div class="text-overline text-grey-5 text-weight-bold">POWERFUL FEATURES</div>
             <h2 class="text-h3 text-weight-bold q-mt-sm text-white">Everything You Need</h2>
          </div>

          <div class="row q-col-gutter-lg">
             <div class="col-12 col-md-4" v-for="feature in features" :key="feature.title">
                <q-card class="bg-black text-white feature-card full-height" flat bordered style="border-color: #333; border-radius: 16px;">
                   <q-card-section class="q-pa-lg">
                      <div class="q-mb-md bg-grey-9 flex flex-center" style="width: 50px; height: 50px; border-radius: 12px;">
                         <q-icon :name="feature.icon" color="white" size="24px" />
                      </div>
                      <div class="text-h6 text-weight-bold q-mb-sm">{{ feature.title }}</div>
                      <div class="text-grey-5">{{ feature.description }}</div>
                   </q-card-section>
                </q-card>
             </div>
          </div>
       </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-black text-white q-py-xl border-t border-b border-grey-9">
       <div class="row q-col-gutter-lg text-center" style="max-width: 1200px; margin: 0 auto;">
          <div class="col-12 col-md-4">
             <div class="text-h2 text-weight-bold text-gradient">500+</div>
             <div class="text-grey-6 q-mt-sm text-subtitle1">Classes Managed</div>
          </div>
          <div class="col-12 col-md-4">
             <div class="text-h2 text-weight-bold text-gradient">10k+</div>
             <div class="text-grey-6 q-mt-sm text-subtitle1">Active Students</div>
          </div>
          <div class="col-12 col-md-4">
             <div class="text-h2 text-weight-bold text-gradient">99%</div>
             <div class="text-grey-6 q-mt-sm text-subtitle1">Satisfaction Rate</div>
          </div>
       </div>
    </section>

    <!-- CTA Section -->
    <section class="q-py-xl q-px-lg text-center bg-dots">
       <div style="max-width: 800px; margin: 0 auto;" class="q-py-xl">
          <h2 class="text-h3 text-weight-bold q-mb-md">Ready to Transform Your Class?</h2>
          <p class="text-h6 text-grey-6 q-mb-xl">Join hundreds of tutors who are saving time and growing their business.</p>
          <q-btn to="/register" color="white" text-color="black" label="Get Started For Free" size="lg" no-caps class="q-px-xl text-weight-bold" rounded />
       </div>
    </section>

    <!-- Footer -->
    <footer class="bg-black border-top border-grey-9 q-py-lg text-grey-6">
       <div class="row justify-between items-center q-px-lg" style="max-width: 1400px; margin: 0 auto;">
          <div class="text-weight-bold text-white">Tution<span class="text-grey-6">Manager</span> &copy; 2024</div>
          <div class="q-gutter-md">
             <a href="#" class="text-grey-5 hover-white no-decoration transition">Privacy</a>
             <a href="#" class="text-grey-5 hover-white no-decoration transition">Terms</a>
             <a href="#" class="text-grey-5 hover-white no-decoration transition">Contact</a>
          </div>
       </div>
    </footer>

  </q-page>
</template>

<script setup>
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}

const features = [
  {
    icon: 'school',
    title: 'Student Management',
    description: 'Effortlessly manage student profiles, attendance, and performance records in one secure place.'
  },
  {
     icon: 'schedule',
     title: 'Smart Scheduling',
     description: 'Organize classes, exams, and extra sessions with an intuitive drag-and-drop calendar.'
  },
  {
     icon: 'payments',
     title: 'Fee Tracking',
     description: 'Keep track of payments, generate invoices, and send automated reminders to parents.'
  },
  {
     icon: 'analytics',
     title: 'Business Analytics',
     description: 'Get detailed insights into your class performance and financial growth.'
  },
  {
     icon: 'quiz',
     title: 'Exam Portal',
     description: 'Conduct exams, manage marks, and generate automated progress reports.'
  },
  {
     icon: 'groups',
     title: 'Staff Management',
     description: 'Manage tutors, administrative staff, and role-based access control effortlessly.'
  }
]
</script>

<style scoped>
/* Utilities */
.bg-black-glass {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.bg-dark-page {
  background-color: #050505;
}

.border-grey-9 {
  border-color: #222;
}

.lh-tight {
  line-height: 1.1;
}

.z-10 {
  z-index: 10;
  position: relative;
}

/* Animations */
.fade-in-up {
  animation: fadeUp 1s ease-out;
}

.fade-in-left {
  animation: fadeLeft 1s ease-out;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Feature Cards */
.feature-card {
  transition: all 0.3s ease;
  background: radial-gradient(circle at top left, #1a1a1a, #000);
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: #666 !important;
  box-shadow: 0 10px 40px rgba(255,255,255,0.05);
}

/* Hero Image */
.hero-image {
  width: 100%;
  border-radius: 24px;
  box-shadow: 0 0 80px rgba(0,120,255,0.1);
  border: 1px solid rgba(255,255,255,0.1);
}

/* Footer Links */
.hover-white:hover {
  color: white !important;
}

.transition {
  transition: color 0.2s;
}

.no-decoration {
  text-decoration: none;
}
</style>
