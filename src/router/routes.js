const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') },
    ],
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
       { path: '', component: () => import('pages/DashboardPage.vue') },
       { path: 'profile', component: () => import('pages/ProfilePage.vue') },
       { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'classes', component: () => import('pages/ClassesPage.vue') },
      { path: 'subjects', component: () => import('pages/SubjectsPage.vue') },
      { path: 'exams', component: () => import('pages/ExamsPage.vue') },
      { path: 'students', component: () => import('pages/StudentsPage.vue') },
      { path: 'attendance', component: () => import('pages/AttendancePage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
