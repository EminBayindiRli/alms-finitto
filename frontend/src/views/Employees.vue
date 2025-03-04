<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Avatar from 'primevue/avatar';
import Dropdown from 'primevue/dropdown';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

// Mock çalışanlar verisi
const employees = ref([
    { 
        id: 1, 
        name: 'Ahmet Yılmaz', 
        position: 'Yazılım Geliştirici', 
        department: 'Bilgi Teknolojileri', 
        completedTrainings: 12,
        performanceScore: 85,
        status: 'active',
        email: 'ahmet.yilmaz@sirket.com',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    { 
        id: 2, 
        name: 'Zeynep Kaya', 
        position: 'İnsan Kaynakları Uzmanı', 
        department: 'İnsan Kaynakları', 
        completedTrainings: 8,
        performanceScore: 92,
        status: 'active',
        email: 'zeynep.kaya@sirket.com',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    { 
        id: 3, 
        name: 'Mehmet Demir', 
        position: 'Veri Analisti', 
        department: 'Bilgi Teknolojileri', 
        completedTrainings: 15,
        performanceScore: 78,
        status: 'active',
        email: 'mehmet.demir@sirket.com',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    { 
        id: 4, 
        name: 'Ayşe Şahin', 
        position: 'Müşteri İlişkileri Yöneticisi', 
        department: 'Müşteri İlişkileri', 
        completedTrainings: 10,
        performanceScore: 88,
        status: 'active',
        email: 'ayse.sahin@sirket.com',
        avatar: 'https://randomuser.me/api/portraits/women/58.jpg'
    },
    { 
        id: 5, 
        name: 'Ali Öztürk', 
        position: 'Proje Müdürü', 
        department: 'Proje Yönetimi', 
        completedTrainings: 20,
        performanceScore: 95,
        status: 'active',
        email: 'ali.ozturk@sirket.com',
        avatar: 'https://randomuser.me/api/portraits/men/11.jpg'
    }
]);

// Departman listesi
const departments = ref([
    { name: 'Bilgi Teknolojileri', code: 'IT' },
    { name: 'İnsan Kaynakları', code: 'HR' },
    { name: 'Müşteri İlişkileri', code: 'CR' },
    { name: 'Proje Yönetimi', code: 'PM' },
    { name: 'Pazarlama', code: 'MK' },
    { name: 'Finans', code: 'FN' }
]);

// Çalışan düzenleme diyaloğu
const employeeDialog = ref(false);
const editingEmployee = ref({});
const isNewEmployee = ref(false);

// Filtreleme
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    department: { value: null, matchMode: 'equals' }
});

const globalFilterValue = ref('');
const selectedDepartment = ref(null);

// Çalışan statüsü için tag renkleri
const getStatusSeverity = (status) => {
    switch (status) {
        case 'active':
            return 'success';
        case 'inactive':
            return 'warning';
        case 'onleave':
            return 'info';
        default:
            return null;
    }
};

// Tablo seçimleri
const selectedEmployees = ref([]);
const loading = ref(false);

// Çalışan işlemleri
const editEmployee = (employee) => {
    editingEmployee.value = { ...employee };
    isNewEmployee.value = false;
    employeeDialog.value = true;
};

const createNewEmployee = () => {
    editingEmployee.value = {
        id: null,
        name: '',
        position: '',
        department: '',
        completedTrainings: 0,
        performanceScore: 0,
        status: 'active',
        email: '',
        avatar: 'https://randomuser.me/api/portraits/lego/1.jpg'
    };
    isNewEmployee.value = true;
    employeeDialog.value = true;
};

const saveEmployee = () => {
    loading.value = true;
    setTimeout(() => {
        if (isNewEmployee.value) {
            // Yeni çalışan için ID oluştur
            editingEmployee.value.id = employees.value.length + 1;
            employees.value.push(editingEmployee.value);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Çalışan eklendi', life: 3000 });
        } else {
            // Mevcut çalışanı güncelle
            const index = employees.value.findIndex(e => e.id === editingEmployee.value.id);
            employees.value[index] = editingEmployee.value;
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Çalışan güncellendi', life: 3000 });
        }
        employeeDialog.value = false;
        loading.value = false;
    }, 500);
};

const confirmDeleteEmployees = () => {
    if (selectedEmployees.value.length > 0) {
        // Gerçek uygulamada onay diyaloğu gösterilmeli
        deleteSelectedEmployees();
    }
};

const deleteSelectedEmployees = () => {
    loading.value = true;
    setTimeout(() => {
        employees.value = employees.value.filter(e => !selectedEmployees.value.includes(e));
        selectedEmployees.value = [];
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Seçili çalışanlar silindi', life: 3000 });
        loading.value = false;
    }, 500);
};

// Filtre işlemleri
const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters.value };
    
    _filters['global'].value = value;
    filters.value = _filters;
    globalFilterValue.value = value;
};

const onDepartmentFilterChange = () => {
    let _filters = { ...filters.value };
    
    if (selectedDepartment.value) {
        _filters['department'].value = selectedDepartment.value.name;
    } else {
        _filters['department'].value = null;
    }
    
    filters.value = _filters;
};

onMounted(() => {
    // Burada API'den veri çekilebilir
    console.log('Employees component mounted');
});
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toast />
                <!-- Header Section -->
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Çalışanlar</h5>
                    <div class="mt-3 md:mt-0">
                        <Button icon="pi pi-plus" label="Yeni Çalışan" class="mr-2 p-button-success" @click="createNewEmployee" />
                        <Button icon="pi pi-trash" label="Sil" class="p-button-danger" @click="confirmDeleteEmployees" :disabled="!selectedEmployees.length" />
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="flex flex-column md:flex-row justify-content-between">
                    <div class="mb-3 md:mb-0 mt-3">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="globalFilterValue" placeholder="Ara..." @input="onGlobalFilterChange" />
                        </span>
                    </div>
                    <div class="mt-3 flex align-items-center">
                        <span class="mr-2">Departman:</span>
                        <Dropdown v-model="selectedDepartment" :options="departments" optionLabel="name" placeholder="Departman Seç" class="w-full md:w-14rem" @change="onDepartmentFilterChange" />
                    </div>
                </div>

                <!-- Employee DataTable -->
                <DataTable :value="employees" v-model:selection="selectedEmployees" :paginator="true" :rows="10"
                    dataKey="id" :rowHover="true" :filters="filters" :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]" 
                    currentPageReportTemplate="Toplam {totalRecords} çalışan içinden {first} - {last} arası gösteriliyor"
                    responsiveLayout="scroll" class="mt-3">
                    
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    
                    <Column field="name" header="Çalışan" sortable style="min-width: 14rem">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <Avatar :image="slotProps.data.avatar" class="mr-2" shape="circle" />
                                <div>
                                    <span class="font-bold">{{ slotProps.data.name }}</span>
                                    <div class="text-sm text-500">{{ slotProps.data.email }}</div>
                                </div>
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="position" header="Pozisyon" sortable style="min-width: 10rem"></Column>
                    
                    <Column field="department" header="Departman" sortable style="min-width: 10rem"></Column>
                    
                    <Column field="completedTrainings" header="Tamamlanan Eğitimler" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.completedTrainings" severity="info" />
                        </template>
                    </Column>
                    
                    <Column field="performanceScore" header="Performans" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <span class="mr-1">{{ slotProps.data.performanceScore }}%</span>
                                <div class="w-8rem overflow-hidden border-1 border-round border-300" style="height: 0.5rem">
                                    <div :style="{ width: slotProps.data.performanceScore + '%', height: '100%', backgroundColor: slotProps.data.performanceScore > 85 ? '#22C55E' : slotProps.data.performanceScore > 70 ? '#F59E0B' : '#EF4444' }"></div>
                                </div>
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="status" header="Durum" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status === 'active' ? 'Aktif' : slotProps.data.status === 'inactive' ? 'Pasif' : 'İzinde'" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    
                    <Column style="min-width: 8rem">
                        <template #body="slotProps">
                            <div class="flex justify-content-center">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editEmployee(slotProps.data)" />
                                <Button icon="pi pi-list" class="p-button-rounded p-button-info" :to="'/employee/' + slotProps.data.id" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                
                <!-- Employee Dialog -->
                <Dialog v-model:visible="employeeDialog" :style="{width: '450px'}" header="Çalışan Bilgileri" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Ad Soyad</label>
                        <InputText id="name" v-model="editingEmployee.name" required autofocus :class="{'p-invalid': !editingEmployee.name}" />
                        <small class="p-error" v-if="!editingEmployee.name">Ad Soyad gerekli.</small>
                    </div>
                    <div class="field">
                        <label for="email">E-posta</label>
                        <InputText id="email" v-model="editingEmployee.email" required :class="{'p-invalid': !editingEmployee.email}" />
                        <small class="p-error" v-if="!editingEmployee.email">E-posta gerekli.</small>
                    </div>
                    <div class="field">
                        <label for="position">Pozisyon</label>
                        <InputText id="position" v-model="editingEmployee.position" required :class="{'p-invalid': !editingEmployee.position}" />
                    </div>
                    <div class="field">
                        <label for="department">Departman</label>
                        <Dropdown id="department" v-model="editingEmployee.department" :options="departments.map(d => d.name)" required />
                    </div>
                    <div class="field">
                        <label for="status">Durum</label>
                        <Dropdown id="status" v-model="editingEmployee.status" :options="['active', 'inactive', 'onleave']" 
                            optionLabel="" optionValue="" />
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="completedTrainings">Eğitimler</label>
                            <InputText id="completedTrainings" v-model="editingEmployee.completedTrainings" type="number" />
                        </div>
                        <div class="field col">
                            <label for="performanceScore">Performans</label>
                            <InputText id="performanceScore" v-model="editingEmployee.performanceScore" type="number" />
                        </div>
                    </div>
                    <template #footer>
                        <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="employeeDialog = false" />
                        <Button label="Kaydet" icon="pi pi-check" class="p-button-success" @click="saveEmployee" :disabled="!editingEmployee.name || !editingEmployee.email" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped>
::v-deep(.p-paginator) {
    .p-paginator-current {
        margin-left: auto;
    }
}
</style>
