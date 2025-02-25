import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: 'departments',
          name: 'departments',
          component: () => import('@/views/DepartmentsView.vue')
        },
        {
          path: 'teams',
          name: 'teams',
          component: () => import('@/views/TeamsView.vue')
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('@/views/EmployeesView.vue')
        },
        {
          path: 'management',
          name: 'management',
          component: () => import('@/views/ManagementView.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    }
  ]
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user.id)
      .single()

    if (profile?.role !== 'admin') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
