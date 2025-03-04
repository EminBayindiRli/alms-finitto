<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { Chart } from 'primevue/chart';
import Card from 'primevue/card';

const toast = useToast();

// Mock departman verileri
const departments = ref([
    {
        id: 1,
        name: 'Bilgi Teknolojileri',
        manager: 'Ali Öztürk',
        employeeCount: 35,
        averagePerformance: 82,
        completedTrainingsCount: 258,
        trainingCompletionRate: 78,
        description: 'Şirketin tüm teknolojik altyapı, yazılım, donanım ve bilgi sistemleri operasyonlarını yürütür.'
    },
    {
        id: 2,
        name: 'İnsan Kaynakları',
        manager: 'Zeynep Kaya',
        employeeCount: 12,
        averagePerformance: 88,
        completedTrainingsCount: 120,
        trainingCompletionRate: 92,
        description: 'Personel yönetimi, işe alım, eğitim ve performans değerlendirme süreçlerini yönetir.'
    },
    {
        id: 3,
        name: 'Müşteri İlişkileri',
        manager: 'Ayşe Şahin',
        employeeCount: 25,
        averagePerformance: 85,
        completedTrainingsCount: 192,
        trainingCompletionRate: 85,
        description: 'Müşteri iletişimini yönetir, müşteri memnuniyetini sağlar ve şikayet yönetimi süreçlerini yürütür.'
    },
    {
        id: 4,
        name: 'Proje Yönetimi',
        manager: 'Murat Yıldız',
        employeeCount: 18,
        averagePerformance: 90,
        completedTrainingsCount: 154,
        trainingCompletionRate: 88,
        description: 'Şirketin tüm projelerinin planlanması, kaynakların yönetimi ve proje takibini gerçekleştirir.'
    },
    {
        id: 5,
        name: 'Pazarlama',
        manager: 'Deniz Aydın',
        employeeCount: 15,
        averagePerformance: 86,
        completedTrainingsCount: 130,
        trainingCompletionRate: 82,
        description: 'Şirketin pazarlama stratejilerini belirler, marka yönetimi ve pazar araştırması yapar.'
    }
]);

// Performans Karşılaştırma Grafiği
const performanceChartData = ref({
    labels: departments.value.map(d => d.name),
    datasets: [
        {
            label: 'Ortalama Performans',
            backgroundColor: '#42A5F5',
            data: departments.value.map(d => d.averagePerformance)
        }
    ]
});

// Eğitim Tamamlama Oranları Grafiği
const trainingCompletionChartData = ref({
    labels: departments.value.map(d => d.name),
    datasets: [
        {
            label: 'Eğitim Tamamlama Oranı (%)',
            backgroundColor: '#66BB6A',
            data: departments.value.map(d => d.trainingCompletionRate)
        }
    ]
});

// Çalışan Sayısı Grafiği
const employeeCountChartData = ref({
    labels: departments.value.map(d => d.name),
    datasets: [
        {
            label: 'Çalışan Sayısı',
            backgroundColor: '#FFA726',
            data: departments.value.map(d => d.employeeCount)
        }
    ]
});

// Chart Seçenekleri
const chartOptions = ref({
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        },
        y: {
            ticks: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            }
        }
    }
});

// Departman Düzenleme
const departmentDialog = ref(false);
const editingDepartment = ref({});
const isNewDepartment = ref(false);
const loading = ref(false);
const selectedDepartments = ref([]);

// Filtreleme
const filters = ref({
    global: { value: null, matchMode: 'contains' }
});
const globalFilterValue = ref('');

// Departman Düzenleme İşlemleri
const editDepartment = (department) => {
    editingDepartment.value = { ...department };
    isNewDepartment.value = false;
    departmentDialog.value = true;
};

const createNewDepartment = () => {
    editingDepartment.value = {
        id: null,
        name: '',
        manager: '',
        employeeCount: 0,
        averagePerformance: 0,
        completedTrainingsCount: 0,
        trainingCompletionRate: 0,
        description: ''
    };
    isNewDepartment.value = true;
    departmentDialog.value = true;
};

const saveDepartment = () => {
    loading.value = true;
    setTimeout(() => {
        if (isNewDepartment.value) {
            // Yeni departman için ID oluştur
            editingDepartment.value.id = departments.value.length + 1;
            departments.value.push(editingDepartment.value);
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Departman eklendi', life: 3000 });
            
            // Grafikleri güncelle
            updateCharts();
        } else {
            // Mevcut departmanı güncelle
            const index = departments.value.findIndex(d => d.id === editingDepartment.value.id);
            departments.value[index] = editingDepartment.value;
            toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Departman güncellendi', life: 3000 });
            
            // Grafikleri güncelle
            updateCharts();
        }
        departmentDialog.value = false;
        loading.value = false;
    }, 500);
};

const confirmDeleteDepartments = () => {
    if (selectedDepartments.value.length > 0) {
        // Gerçek uygulamada onay diyaloğu gösterilmeli
        deleteSelectedDepartments();
    }
};

const deleteSelectedDepartments = () => {
    loading.value = true;
    setTimeout(() => {
        departments.value = departments.value.filter(d => !selectedDepartments.value.includes(d));
        selectedDepartments.value = [];
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Seçili departmanlar silindi', life: 3000 });
        
        // Grafikleri güncelle
        updateCharts();
        
        loading.value = false;
    }, 500);
};

// Grafikler için veri güncelleme
const updateCharts = () => {
    performanceChartData.value = {
        labels: departments.value.map(d => d.name),
        datasets: [
            {
                label: 'Ortalama Performans',
                backgroundColor: '#42A5F5',
                data: departments.value.map(d => d.averagePerformance)
            }
        ]
    };
    
    trainingCompletionChartData.value = {
        labels: departments.value.map(d => d.name),
        datasets: [
            {
                label: 'Eğitim Tamamlama Oranı (%)',
                backgroundColor: '#66BB6A',
                data: departments.value.map(d => d.trainingCompletionRate)
            }
        ]
    };
    
    employeeCountChartData.value = {
        labels: departments.value.map(d => d.name),
        datasets: [
            {
                label: 'Çalışan Sayısı',
                backgroundColor: '#FFA726',
                data: departments.value.map(d => d.employeeCount)
            }
        ]
    };
};

// Filtre İşlemleri
const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters.value };
    
    _filters['global'].value = value;
    filters.value = _filters;
    globalFilterValue.value = value;
};

onMounted(() => {
    // Burada API'den veri çekilebilir
    console.log('Departments component mounted');
});
</script>

<template>
    <div class="grid">
        <Toast />
        
        <!-- Departman Grafikleri Bölümü -->
        <div class="col-12">
            <div class="card">
                <h5>Departman Performans Göstergeleri</h5>
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <Card title="Ortalama Performans" class="h-full">
                            <Chart type="bar" :data="performanceChartData" :options="chartOptions" class="h-20rem" />
                        </Card>
                    </div>
                    <div class="col-12 lg:col-4">
                        <Card title="Eğitim Tamamlama Oranları" class="h-full">
                            <Chart type="bar" :data="trainingCompletionChartData" :options="chartOptions" class="h-20rem" />
                        </Card>
                    </div>
                    <div class="col-12 lg:col-4">
                        <Card title="Çalışan Sayıları" class="h-full">
                            <Chart type="bar" :data="employeeCountChartData" :options="chartOptions" class="h-20rem" />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Departman Tablosu Bölümü -->
        <div class="col-12">
            <div class="card">
                <!-- Header Section -->
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Departmanlar</h5>
                    <div class="mt-3 md:mt-0">
                        <Button icon="pi pi-plus" label="Yeni Departman" class="mr-2 p-button-success" @click="createNewDepartment" />
                        <Button icon="pi pi-trash" label="Sil" class="p-button-danger" @click="confirmDeleteDepartments" :disabled="!selectedDepartments.length" />
                    </div>
                </div>

                <!-- Filter Section -->
                <div class="flex justify-content-end">
                    <span class="p-input-icon-left mt-3">
                        <i class="pi pi-search" />
                        <InputText v-model="globalFilterValue" placeholder="Ara..." @input="onGlobalFilterChange" />
                    </span>
                </div>

                <!-- Departments DataTable -->
                <DataTable :value="departments" v-model:selection="selectedDepartments" :paginator="true" :rows="10"
                    dataKey="id" :rowHover="true" :filters="filters" :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]" 
                    currentPageReportTemplate="Toplam {totalRecords} departman içinden {first} - {last} arası gösteriliyor"
                    responsiveLayout="scroll" class="mt-3">
                    
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    
                    <Column field="name" header="Departman Adı" sortable style="min-width: 14rem"></Column>
                    
                    <Column field="manager" header="Yönetici" sortable style="min-width: 12rem"></Column>
                    
                    <Column field="employeeCount" header="Çalışan Sayısı" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.employeeCount" severity="info" />
                        </template>
                    </Column>
                    
                    <Column field="averagePerformance" header="Ortalama Performans" sortable style="min-width: 12rem">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <span class="mr-1">{{ slotProps.data.averagePerformance }}%</span>
                                <div class="w-8rem overflow-hidden border-1 border-round border-300" style="height: 0.5rem">
                                    <div :style="{ width: slotProps.data.averagePerformance + '%', height: '100%', backgroundColor: slotProps.data.averagePerformance > 85 ? '#22C55E' : slotProps.data.averagePerformance > 70 ? '#F59E0B' : '#EF4444' }"></div>
                                </div>
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="trainingCompletionRate" header="Eğitim Tamamlama" sortable style="min-width: 12rem">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <span class="mr-1">{{ slotProps.data.trainingCompletionRate }}%</span>
                                <div class="w-8rem overflow-hidden border-1 border-round border-300" style="height: 0.5rem">
                                    <div :style="{ width: slotProps.data.trainingCompletionRate + '%', height: '100%', backgroundColor: slotProps.data.trainingCompletionRate > 85 ? '#22C55E' : slotProps.data.trainingCompletionRate > 70 ? '#F59E0B' : '#EF4444' }"></div>
                                </div>
                            </div>
                        </template>
                    </Column>
                    
                    <Column style="min-width: 8rem">
                        <template #body="slotProps">
                            <div class="flex justify-content-center">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editDepartment(slotProps.data)" />
                                <Button icon="pi pi-list" class="p-button-rounded p-button-info" :to="'/department/' + slotProps.data.id" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                
                <!-- Department Dialog -->
                <Dialog v-model:visible="departmentDialog" :style="{width: '450px'}" header="Departman Bilgileri" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Departman Adı</label>
                        <InputText id="name" v-model="editingDepartment.name" required autofocus :class="{'p-invalid': !editingDepartment.name}" />
                        <small class="p-error" v-if="!editingDepartment.name">Departman adı gerekli.</small>
                    </div>
                    <div class="field">
                        <label for="manager">Departman Yöneticisi</label>
                        <InputText id="manager" v-model="editingDepartment.manager" required :class="{'p-invalid': !editingDepartment.manager}" />
                        <small class="p-error" v-if="!editingDepartment.manager">Departman yöneticisi gerekli.</small>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="employeeCount">Çalışan Sayısı</label>
                            <InputText id="employeeCount" v-model="editingDepartment.employeeCount" type="number" />
                        </div>
                        <div class="field col">
                            <label for="averagePerformance">Ort. Performans</label>
                            <InputText id="averagePerformance" v-model="editingDepartment.averagePerformance" type="number" />
                        </div>
                    </div>
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="completedTrainingsCount">Tamamlanan Eğitim</label>
                            <InputText id="completedTrainingsCount" v-model="editingDepartment.completedTrainingsCount" type="number" />
                        </div>
                        <div class="field col">
                            <label for="trainingCompletionRate">Eğitim Tamamlama Oranı</label>
                            <InputText id="trainingCompletionRate" v-model="editingDepartment.trainingCompletionRate" type="number" />
                        </div>
                    </div>
                    <div class="field">
                        <label for="description">Açıklama</label>
                        <Textarea id="description" v-model="editingDepartment.description" rows="3" />
                    </div>
                    <template #footer>
                        <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="departmentDialog = false" />
                        <Button label="Kaydet" icon="pi pi-check" class="p-button-success" @click="saveDepartment" :disabled="!editingDepartment.name || !editingDepartment.manager" />
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
