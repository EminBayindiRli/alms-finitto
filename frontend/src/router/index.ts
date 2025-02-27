import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'
import LoginView from '@/views/LoginView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import DashboardView from '@/views/DashboardView.vue'
import DepartmentsView from '@/views/DepartmentsView.vue'
import TeamsView from '@/views/TeamsView.vue'
import EmployeesView from '@/views/EmployeesView.vue'
import ManagementView from '@/views/ManagementView.vue'

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
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Auth guard
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  if (requiresAuth && !session) {
    next('/login')
  } else if (to.path === '/login' && session) {
    next('/')
  } else if (requiresAdmin) {
    // Admin kontrolü
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id)
      .single()
    
    if (data?.role !== 'admin') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
