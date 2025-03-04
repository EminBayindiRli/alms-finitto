<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Rating from 'primevue/rating';
import ProgressBar from 'primevue/progressbar';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import { Chart } from 'primevue/chart';

const toast = useToast();

// Eğitim kategorileri
const categories = ref([
    { name: 'Teknik', code: 'technical' },
    { name: 'Yönetimsel', code: 'managerial' },
    { name: 'İletişim', code: 'communication' },
    { name: 'Müşteri İlişkileri', code: 'customer_relations' },
    { name: 'Proje Yönetimi', code: 'project_management' },
    { name: 'Yazılım', code: 'software' }
]);

// Eğitim seviyesi
const levels = ref([
    { name: 'Başlangıç', code: 'beginner' },
    { name: 'Orta', code: 'intermediate' },
    { name: 'İleri', code: 'advanced' },
    { name: 'Uzman', code: 'expert' }
]);

// Mock eğitim verileri
const trainings = ref([
    {
        id: 1,
        name: 'Yazılım Mimarisi Temelleri',
        category: 'Teknik',
        level: 'Orta',
        instructor: 'Prof. Dr. Ahmet Demir',
        enrolledCount: 28,
        completionRate: 75,
        duration: '10 saat',
        startDate: '2025-01-15',
        endDate: '2025-02-15',
        rating: 4.5,
        description: 'Bu kurs, yazılım mimarisinin temel ilkelerini ve modern yaklaşımları öğretmektedir.'
    },
    {
        id: 2,
        name: 'Etkili İletişim Becerileri',
        category: 'İletişim',
        level: 'Başlangıç',
        instructor: 'Dr. Ayşe Yılmaz',
        enrolledCount: 45,
        completionRate: 90,
        duration: '8 saat',
        startDate: '2025-01-20',
        endDate: '2025-02-20',
        rating: 4.8,
        description: 'İş ortamında etkili iletişim kurma, sunum yapma ve çatışma yönetimi konularını kapsar.'
    },
    {
        id: 3,
        name: 'Agile Proje Yönetimi',
        category: 'Proje Yönetimi',
        level: 'İleri',
        instructor: 'Mehmet Kaya',
        enrolledCount: 32,
        completionRate: 68,
        duration: '15 saat',
        startDate: '2025-01-10',
        endDate: '2025-03-10',
        rating: 4.2,
        description: 'Scrum, Kanban ve diğer çevik metodolojileri kullanarak proje yönetimi teknikleri.'
    },
    {
        id: 4,
        name: 'Modern JavaScript',
        category: 'Yazılım',
        level: 'Orta',
        instructor: 'Ali Öztürk',
        enrolledCount: 38,
        completionRate: 82,
        duration: '12 saat',
        startDate: '2025-02-01',
        endDate: '2025-03-01',
        rating: 4.7,
        description: 'ES6 ve sonrası JavaScript özellikleri, async/await, modüller ve modern framework kullanımı.'
    },
    {
        id: 5,
        name: 'Müşteri Deneyimi Tasarımı',
        category: 'Müşteri İlişkileri',
        level: 'İleri',
        instructor: 'Zeynep Şahin',
        enrolledCount: 25,
        completionRate: 95,
        duration: '8 saat',
        startDate: '2025-02-10',
        endDate: '2025-03-10',
        rating: 4.9,
        description: 'Müşteri yolculuğu haritalama, kullanıcı deneyimi tasarımı ve müşteri memnuniyeti stratejileri.'
    },
    {
        id: 6,
        name: 'Liderlik ve Takım Yönetimi',
        category: 'Yönetimsel',
        level: 'Uzman',
        instructor: 'Prof. Dr. Murat Aydın',
        enrolledCount: 20,
        completionRate: 60,
        duration: '20 saat',
        startDate: '2025-01-05',
        endDate: '2025-03-05',
        rating: 4.6,
        description: 'Etkili liderlik, delegasyon, motivasyon teknikleri ve takım performansını artırma stratejileri.'
    }
]);

// Kategori dağılımı grafiği
const categoryChartData = ref({
    labels: categories.value.map(c => c.name),
    datasets: [
        {
            data: [2, 1, 1, 1, 1, 0],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'],
            hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#4DD0E1', '#9575CD', '#F06292']
        }
    ]
});

// Tamamlanma oranları grafiği
const completionChartData = ref({
    labels: trainings.value.map(t => t.name),
    datasets: [
        {
            label: 'Tamamlama Oranı (%)',
            backgroundColor: '#42A5F5',
            data: trainings.value.map(t => t.completionRate)
        }
    ]
});

// Rating dağılımı grafiği
const ratingChartData = ref({
    labels: trainings.value.map(t => t.name),
    datasets: [
        {
            label: 'Ortalama Puanlama',
            backgroundColor: '#FFA726',
            data: trainings.value.map(t => t.rating)
        }
    ]
});

// Chart Options
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

const pieOptions = ref({
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    }
});

// Dialog ve CRUD işlemleri
const trainingDialog = ref(false);
const deleteTrainingDialog = ref(false);
const training = ref({});
const selectedTrainings = ref(null);
const submitted = ref(false);
const loading = ref(false);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    category: { value: null, matchMode: 'equals' }
});

const globalFilterValue = ref('');
const selectedCategory = ref(null);

// Kategori filtreleme
const onCategoryChange = () => {
    let _filters = { ...filters.value };
    
    if (selectedCategory.value) {
        _filters['category'].value = selectedCategory.value.name;
    } else {
        _filters['category'].value = null;
    }
    
    filters.value = _filters;
};

// Global filtreleme
const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters.value };
    
    _filters['global'].value = value;
    filters.value = _filters;
    globalFilterValue.value = value;
};

// Eğitim işlemleri
const openNew = () => {
    training.value = {
        id: null,
        name: '',
        category: null,
        level: null,
        instructor: '',
        enrolledCount: 0,
        completionRate: 0,
        duration: '',
        startDate: '',
        endDate: '',
        rating: 0,
        description: ''
    };
    submitted.value = false;
    trainingDialog.value = true;
};

const hideDialog = () => {
    trainingDialog.value = false;
    submitted.value = false;
};

const saveTraining = () => {
    submitted.value = true;

    if (training.value.name.trim()) {
        loading.value = true;
        
        setTimeout(() => {
            if (training.value.id) {
                // Eğitimi güncelle
                const index = findIndexById(training.value.id);
                trainings.value[index] = training.value;
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Eğitim güncellendi', life: 3000 });
            } else {
                // Yeni eğitim ekle
                training.value.id = createId();
                trainings.value.push(training.value);
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Eğitim oluşturuldu', life: 3000 });
            }

            // Grafikleri güncelle
            updateCharts();
            
            trainingDialog.value = false;
            training.value = {};
            loading.value = false;
        }, 500);
    }
};

const editTraining = (editTraining) => {
    training.value = { ...editTraining };
    trainingDialog.value = true;
};

const confirmDeleteTraining = (editTraining) => {
    training.value = editTraining;
    deleteTrainingDialog.value = true;
};

const deleteTraining = () => {
    loading.value = true;
    
    setTimeout(() => {
        trainings.value = trainings.value.filter(val => val.id !== training.value.id);
        deleteTrainingDialog.value = false;
        training.value = {};
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Eğitim silindi', life: 3000 });
        
        // Grafikleri güncelle
        updateCharts();
        
        loading.value = false;
    }, 500);
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < trainings.value.length; i++) {
        if (trainings.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    return trainings.value.length ? Math.max(...trainings.value.map(el => el.id)) + 1 : 1;
};

// Duruma göre renk belirleme
const getCompletionSeverity = (value) => {
    if (value < 50) return 'danger';
    if (value < 75) return 'warning';
    return 'success';
};

// Grafikleri güncelleme
const updateCharts = () => {
    // Kategori sayımı
    const categoryCounts = {};
    categories.value.forEach(c => {
        categoryCounts[c.name] = 0;
    });
    
    trainings.value.forEach(t => {
        if (categoryCounts[t.category] !== undefined) {
            categoryCounts[t.category]++;
        }
    });
    
    categoryChartData.value = {
        labels: categories.value.map(c => c.name),
        datasets: [
            {
                data: categories.value.map(c => categoryCounts[c.name]),
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'],
                hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#4DD0E1', '#9575CD', '#F06292']
            }
        ]
    };
    
    // Tamamlanma oranları 
    completionChartData.value = {
        labels: trainings.value.map(t => t.name),
        datasets: [
            {
                label: 'Tamamlama Oranı (%)',
                backgroundColor: '#42A5F5',
                data: trainings.value.map(t => t.completionRate)
            }
        ]
    };
    
    // Rating grafiği
    ratingChartData.value = {
        labels: trainings.value.map(t => t.name),
        datasets: [
            {
                label: 'Ortalama Puanlama',
                backgroundColor: '#FFA726',
                data: trainings.value.map(t => t.rating)
            }
        ]
    };
};

onMounted(() => {
    // Burada API'den veri çekilebilir
    console.log('Trainings component mounted');
});
</script>

<template>
    <div class="grid">
        <Toast />
        
        <!-- Eğitim Grafikleri -->
        <div class="col-12">
            <div class="card">
                <h5>Eğitim İstatistikleri</h5>
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <Card title="Kategori Dağılımı" class="h-full">
                            <Chart type="pie" :data="categoryChartData" :options="pieOptions" class="h-20rem" />
                        </Card>
                    </div>
                    <div class="col-12 lg:col-4">
                        <Card title="Tamamlanma Oranları" class="h-full">
                            <Chart type="bar" :data="completionChartData" :options="chartOptions" class="h-20rem" />
                        </Card>
                    </div>
                    <div class="col-12 lg:col-4">
                        <Card title="Eğitim Puanlamaları" class="h-full">
                            <Chart type="bar" :data="ratingChartData" :options="chartOptions" class="h-20rem" />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Eğitim Tablosu -->
        <div class="col-12">
            <div class="card">
                <!-- Header Section -->
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Eğitimler</h5>
                    <div class="mt-3 md:mt-0">
                        <Button icon="pi pi-plus" label="Yeni Eğitim" class="p-button-success" @click="openNew" />
                    </div>
                </div>
                
                <!-- Filter Section -->
                <div class="flex flex-column md:flex-row justify-content-between mt-3">
                    <div class="mb-3 md:mb-0">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="globalFilterValue" placeholder="Ara..." @input="onGlobalFilterChange" />
                        </span>
                    </div>
                    <div class="flex align-items-center">
                        <span class="mr-2">Kategori:</span>
                        <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name" placeholder="Kategori Seç" class="w-full md:w-14rem" @change="onCategoryChange" />
                    </div>
                </div>
                
                <!-- Trainings DataTable -->
                <DataTable :value="trainings" v-model:selection="selectedTrainings" :paginator="true" :rows="10"
                    dataKey="id" :rowHover="true" :filters="filters" :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]" 
                    currentPageReportTemplate="Toplam {totalRecords} eğitim içinden {first} - {last} arası gösteriliyor"
                    responsiveLayout="scroll" class="mt-3">
                    
                    <Column field="name" header="Eğitim Adı" sortable style="min-width: 16rem">
                        <template #body="slotProps">
                            <div>
                                <span class="font-bold">{{ slotProps.data.name }}</span>
                                <div class="text-xs mt-1">{{ slotProps.data.description }}</div>
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="category" header="Kategori" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.category" severity="info" />
                        </template>
                    </Column>
                    
                    <Column field="level" header="Seviye" sortable style="min-width: 8rem"></Column>
                    
                    <Column field="instructor" header="Eğitmen" sortable style="min-width: 12rem"></Column>
                    
                    <Column field="enrolledCount" header="Kayıtlı Kişi" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.enrolledCount" severity="primary" />
                        </template>
                    </Column>
                    
                    <Column field="completionRate" header="Tamamlanma Oranı" sortable style="min-width: 12rem">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <span class="mr-1">{{ slotProps.data.completionRate }}%</span>
                                <ProgressBar :value="slotProps.data.completionRate" :class="getCompletionSeverity(slotProps.data.completionRate)" style="height: 0.5rem; width: 10rem" />
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="rating" header="Puan" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <Rating :modelValue="slotProps.data.rating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>
                    
                    <Column style="min-width: 8rem">
                        <template #body="slotProps">
                            <div class="flex">
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editTraining(slotProps.data)" />
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteTraining(slotProps.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                
                <!-- Training Dialog -->
                <Dialog v-model:visible="trainingDialog" :style="{width: '500px'}" header="Eğitim Detayları" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="name">Eğitim Adı</label>
                        <InputText id="name" v-model="training.name" required autofocus :class="{'p-invalid': submitted && !training.name}" />
                        <small class="p-error" v-if="submitted && !training.name">Eğitim adı gerekli.</small>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="category">Kategori</label>
                            <Dropdown id="category" v-model="training.category" :options="categories.map(c => c.name)" placeholder="Kategori Seç" />
                        </div>
                        <div class="field col">
                            <label for="level">Seviye</label>
                            <Dropdown id="level" v-model="training.level" :options="levels.map(l => l.name)" placeholder="Seviye Seç" />
                        </div>
                    </div>
                    
                    <div class="field">
                        <label for="instructor">Eğitmen</label>
                        <InputText id="instructor" v-model="training.instructor" />
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="startDate">Başlangıç Tarihi</label>
                            <InputText id="startDate" v-model="training.startDate" type="date" />
                        </div>
                        <div class="field col">
                            <label for="endDate">Bitiş Tarihi</label>
                            <InputText id="endDate" v-model="training.endDate" type="date" />
                        </div>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="duration">Süre</label>
                            <InputText id="duration" v-model="training.duration" />
                        </div>
                        <div class="field col">
                            <label for="rating">Puan</label>
                            <Rating id="rating" v-model="training.rating" :cancel="false" />
                        </div>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col">
                            <label for="enrolledCount">Kayıtlı Kişi</label>
                            <InputText id="enrolledCount" v-model="training.enrolledCount" type="number" />
                        </div>
                        <div class="field col">
                            <label for="completionRate">Tamamlanma Oranı (%)</label>
                            <InputText id="completionRate" v-model="training.completionRate" type="number" />
                        </div>
                    </div>
                    
                    <div class="field">
                        <label for="description">Açıklama</label>
                        <Textarea id="description" v-model="training.description" rows="3" />
                    </div>
                    
                    <template #footer>
                        <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Kaydet" icon="pi pi-check" class="p-button-success" @click="saveTraining" />
                    </template>
                </Dialog>

                <!-- Delete Training Confirmation -->
                <Dialog v-model:visible="deleteTrainingDialog" :style="{width: '450px'}" header="Onay" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="training">Bu eğitimi silmek istediğinize emin misiniz? <b>{{ training.name }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Hayır" icon="pi pi-times" class="p-button-text" @click="deleteTrainingDialog = false" />
                        <Button label="Evet" icon="pi pi-check" class="p-button-danger" @click="deleteTraining" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped>
.success .p-progressbar-value {
    background: #22c55e;
}
.warning .p-progressbar-value {
    background: #f59e0b;
}
.danger .p-progressbar-value {
    background: #ef4444;
}
</style>