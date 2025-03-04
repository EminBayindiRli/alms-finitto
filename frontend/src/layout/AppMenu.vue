<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Ana Menü',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Eğitim ve Performans',
        items: [
            { label: 'Çalışanlar', icon: 'pi pi-fw pi-users', to: '/employees' },
            { label: 'Departmanlar', icon: 'pi pi-fw pi-building', to: '/departments' },
            { label: 'Eğitimler', icon: 'pi pi-fw pi-book', to: '/trainings' },
            { label: 'Performans', icon: 'pi pi-fw pi-chart-line', to: '/performance' }
        ]
    },
    {
        label: 'Yönetim',
        items: [
            { label: 'Profil', icon: 'pi pi-fw pi-user', to: '/profile' },
            { label: 'Raporlar', icon: 'pi pi-fw pi-file', to: '/reports' },
            { label: 'Ayarlar', icon: 'pi pi-fw pi-cog', to: '/settings' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
