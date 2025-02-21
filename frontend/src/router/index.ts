import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')
  },
  {
    path: '/employees',
    name: 'Employees',
    component: () => import('../views/Employees.vue')
  },
  {
    path: '/employee/:id',
    name: 'EmployeeDetail',
    component: () => import('../views/EmployeeDetail.vue')
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('../views/Reports.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
