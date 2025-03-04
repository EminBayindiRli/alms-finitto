import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import { useAuthStore } from '@/stores/auth'

// Görünümler
import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import AdminDashboardView from '@/views/AdminDashboardView.vue'
import DepartmentsView from '@/views/DepartmentsView.vue'
import TeamsView from '@/views/TeamsView.vue'
import EmployeesView from '@/views/EmployeesView.vue'
import ManagementView from '@/views/ManagementView.vue'

// Hata Sayfaları
import NotFoundView from '@/views/errors/NotFoundView.vue'
import AccessDeniedView from '@/views/errors/AccessDeniedView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: DashboardView
      },
      {
        path: 'departments',
        name: 'departments',
        component: DepartmentsView
      },
      {
        path: 'teams',
        name: 'teams',
        component: TeamsView
      },
      {
        path: 'employees',
        name: 'employees',
        component: EmployeesView
      },
      {
        path: 'management',
        name: 'management',
        component: ManagementView,
        meta: { requiresAdmin: true }
      },
      // Admin Panel Routes
      {
        path: 'admin/dashboard',
        name: 'adminDashboard',
        component: AdminDashboardView,
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/employees',
        name: 'adminEmployees',
        component: () => import('@/views/admin/EmployeesAdminView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/departments',
        name: 'adminDepartments',
        component: () => import('@/views/admin/DepartmentsAdminView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/teams',
        name: 'adminTeams',
        component: () => import('@/views/admin/TeamsAdminView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/performance',
        name: 'adminPerformance',
        component: () => import('@/views/admin/PerformanceAdminView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/trainings',
        name: 'adminTrainings',
        component: () => import('@/views/admin/TrainingsAdminView.vue'),
        meta: { requiresAdmin: true }
      },
      {
        path: 'admin/settings',
        name: 'adminSettings',
        component: () => import('@/views/admin/SettingsAdminView.vue'),
        meta: { requiresAdmin: true }
      }
    ]
  },
  // Hata Sayfaları
  {
    path: '/access-denied',
    name: 'accessDenied',
    component: AccessDeniedView
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: NotFoundView
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  // RequiresAuth kontrolü
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  // Yetkilendirme işlemleri için auth store'u kullan
  const authStore = useAuthStore()
  
  // Oturum bilgisini al veya yükle (mock veya gerçek)
  const user = authStore.user || await authStore.loadUser()
  
  // Admin yetkisi gerektiren rotaları kontrol et
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  // Oturum ve yetki kontrolü
  if (requiresAuth && !user) {
    // Oturum gerektiren sayfa ama kullanıcı girişi yok
    next({ name: 'login' })
  } else if (requiresAdmin && !authStore.isAdmin()) {
    // Admin yetkisi gerektiren sayfa ama kullanıcı admin değil
    next({ name: 'accessDenied' })
  } else if (to.path === '/login' && user) {
    // Kullanıcı zaten giriş yapmış ama login sayfasına gitmek istiyor
    next({ name: 'dashboard' })
  } else {
    // Diğer tüm durumlarda normal yönlendirme
    next()
  }
})

export default router
