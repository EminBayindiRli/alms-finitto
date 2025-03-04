import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/employees',
                    name: 'employees',
                    component: () => import('@/views/Employees.vue')
                },
                {
                    path: '/departments',
                    name: 'departments',
                    component: () => import('@/views/Departments.vue')
                },
                {
                    path: '/trainings',
                    name: 'trainings',
                    component: () => import('@/views/Trainings.vue')
                },
                {
                    path: '/performance',
                    name: 'performance',
                    component: () => import('@/views/Performance.vue')
                },
                {
                    path: '/profile',
                    name: 'profile',
                    component: () => import('@/views/Profile.vue')
                },
                {
                    path: '/reports',
                    name: 'reports',
                    component: () => import('@/views/Reports.vue')
                },
                {
                    path: '/settings',
                    name: 'settings',
                    component: () => import('@/views/Settings.vue')
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
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        }
    ]
});

export default router;
