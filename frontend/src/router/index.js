import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/employees',
                    name: 'employees',
                    component: () => import('@/views/Employees.vue'),
                    meta: { requiresAuth: true, requiresAdmin: true }
                },
                {
                    path: '/departments',
                    name: 'departments',
                    component: () => import('@/views/Departments.vue'),
                    meta: { requiresAuth: true, requiresAdmin: true }
                },
                {
                    path: '/trainings',
                    name: 'trainings',
                    component: () => import('@/views/Trainings.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/performance',
                    name: 'performance',
                    component: () => import('@/views/Performance.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/Profile.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/reports',
                    name: 'reports',
                    component: () => import('@/views/Reports.vue'),
                    meta: { requiresAuth: true, requiresAdmin: true }
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('@/views/Settings.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/Login.vue')
        },
        {
            path: '/error',
            name: 'error',
            component: () => import('@/views/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/NotFound.vue')
        }
    ]
});

export default router;
