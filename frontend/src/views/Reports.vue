<script setup>
import { ref, onMounted, computed } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import { Chart } from 'primevue/chart';
import ProgressBar from 'primevue/progressbar';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ToggleButton from 'primevue/togglebutton';
import SelectButton from 'primevue/selectbutton';
import Tag from 'primevue/tag';

const toast = useToast();

// Dönem seçenekleri
const periods = ref([
    { name: 'Son 30 Gün', code: 'last30' },
    { name: 'Son 3 Ay', code: 'last90' },
    { name: 'Son 6 Ay', code: 'last180' },
    { name: 'Son 1 Yıl', code: 'last365' },
    { name: 'Tüm Zamanlar', code: 'allTime' }
]);

// Seçili dönem
const selectedPeriod = ref(periods.value[2]);

// Departmanlar
const departments = ref([
    { name: 'Yazılım Geliştirme', code: 'software' },
    { name: 'Pazarlama', code: 'marketing' },
    { name: 'İnsan Kaynakları', code: 'hr' },
    { name: 'Finans', code: 'finance' },
    { name: 'Satış', code: 'sales' },
    { name: 'Operasyon', code: 'operations' }
]);

// Seçili departmanlar (filtre için)
const selectedDepartments = ref([]);

// Eğitim tamamlama seviyesi 
const completionLevels = ref([
    { name: 'Tamamlandı', code: 'completed' },
    { name: 'Devam Ediyor', code: 'in_progress' },
    { name: 'Başlanmadı', code: 'not_started' }
]);

// Eğitim kategorileri
const categories = ref([
    { name: 'Teknik', code: 'technical' },
    { name: 'Yönetimsel', code: 'managerial' },
    { name: 'İletişim', code: 'communication' },
    { name: 'Müşteri İlişkileri', code: 'customer_relations' },
    { name: 'Proje Yönetimi', code: 'project_management' },
    { name: 'Yazılım', code: 'software' }
]);

// Seçili kategoriler
const selectedCategories = ref([]);

// Eğitim tamamlama raporu verileri
const trainingCompletionData = ref([
    {
        employeeId: 101,
        name: 'Ahmet Yılmaz',
        department: 'Yazılım Geliştirme',
        totalAssigned: 15,
        completed: 12,
        inProgress: 2,
        notStarted: 1,
        completionRate: 80,
        averageScore: 82,
        lastCompletionDate: '2025-02-15'
    },
    {
        employeeId: 102,
        name: 'Ayşe Demir',
        department: 'Pazarlama',
        totalAssigned: 12,
        completed: 11,
        inProgress: 1,
        notStarted: 0,
        completionRate: 92,
        averageScore: 88,
        lastCompletionDate: '2025-03-01'
    },
    {
        employeeId: 103,
        name: 'Ali Öztürk',
        department: 'İnsan Kaynakları',
        totalAssigned: 10,
        completed: 7,
        inProgress: 2,
        notStarted: 1,
        completionRate: 70,
        averageScore: 75,
        lastCompletionDate: '2025-01-20'
    },
    {
        employeeId: 104,
        name: 'Fatma Yıldız',
        department: 'Finans',
        totalAssigned: 8,
        completed: 8,
        inProgress: 0,
        notStarted: 0,
        completionRate: 100,
        averageScore: 95,
        lastCompletionDate: '2025-02-22'
    },
    {
        employeeId: 105,
        name: 'Mehmet Kaya',
        department: 'Yazılım Geliştirme',
        totalAssigned: 15,
        completed: 10,
        inProgress: 3,
        notStarted: 2,
        completionRate: 67,
        averageScore: 78,
        lastCompletionDate: '2025-01-30'
    },
    {
        employeeId: 106,
        name: 'Zeynep Şahin',
        department: 'Pazarlama',
        totalAssigned: 12,
        completed: 9,
        inProgress: 2,
        notStarted: 1,
        completionRate: 75,
        averageScore: 80,
        lastCompletionDate: '2025-02-10'
    }
]);

// Departman performans raporu verileri
const departmentPerformanceData = ref([
    {
        department: 'Yazılım Geliştirme',
        employeeCount: 15,
        averagePerformance: 4.1,
        completionRate: 73.5,
        topPerformer: 'Ahmet Yılmaz',
        improvementAreas: ['İletişim', 'Liderlik'],
        strengths: ['Teknik Beceriler', 'Problem Çözme'],
        trainingBudgetUsed: 85
    },
    {
        department: 'Pazarlama',
        employeeCount: 10,
        averagePerformance: 4.3,
        completionRate: 83.5,
        topPerformer: 'Ayşe Demir',
        improvementAreas: ['Teknik Beceriler'],
        strengths: ['İletişim', 'Müşteri İlişkileri'],
        trainingBudgetUsed: 72
    },
    {
        department: 'İnsan Kaynakları',
        employeeCount: 8,
        averagePerformance: 3.9,
        completionRate: 70.0,
        topPerformer: 'Ali Öztürk',
        improvementAreas: ['Teknik Beceriler', 'Problem Çözme'],
        strengths: ['İletişim', 'Takım Çalışması'],
        trainingBudgetUsed: 65
    },
    {
        department: 'Finans',
        employeeCount: 12,
        averagePerformance: 4.5,
        completionRate: 90.0,
        topPerformer: 'Fatma Yıldız',
        improvementAreas: ['İnovasyon'],
        strengths: ['Analitik Düşünme', 'Takım Çalışması', 'İş Etiği'],
        trainingBudgetUsed: 78
    },
    {
        department: 'Satış',
        employeeCount: 18,
        averagePerformance: 4.2,
        completionRate: 76.5,
        topPerformer: 'Mehmet Kaya',
        improvementAreas: ['Teknik Beceriler', 'Proje Yönetimi'],
        strengths: ['İletişim', 'Müşteri İlişkileri'],
        trainingBudgetUsed: 92
    },
    {
        department: 'Operasyon',
        employeeCount: 20,
        averagePerformance: 3.8,
        completionRate: 68.0,
        topPerformer: 'Zeynep Şahin',
        improvementAreas: ['İnovasyon', 'Adaptasyon'],
        strengths: ['Proje Yönetimi', 'Takım Çalışması'],
        trainingBudgetUsed: 60
    }
]);

// Eğitim kategorisi tamamlama oranları
const categoryCompletionData = ref([
    { category: 'Teknik', completionRate: 78 },
    { category: 'Yönetimsel', completionRate: 65 },
    { category: 'İletişim', completionRate: 90 },
    { category: 'Müşteri İlişkileri', completionRate: 82 },
    { category: 'Proje Yönetimi', completionRate: 72 },
    { category: 'Yazılım', completionRate: 76 }
]);

// Zaman içindeki departman performans verileri (son 6 ay)
const timeSeriesData = ref({
    labels: ['Ekim 2024', 'Kasım 2024', 'Aralık 2024', 'Ocak 2025', 'Şubat 2025', 'Mart 2025'],
    departments: [
        { name: 'Yazılım Geliştirme', data: [3.9, 4.0, 4.0, 4.1, 4.1, 4.2] },
        { name: 'Pazarlama', data: [4.0, 4.1, 4.1, 4.2, 4.3, 4.3] },
        { name: 'İnsan Kaynakları', data: [3.7, 3.8, 3.8, 3.8, 3.9, 3.9] },
        { name: 'Finans', data: [4.3, 4.3, 4.4, 4.4, 4.5, 4.5] },
        { name: 'Satış', data: [4.0, 4.0, 4.1, 4.1, 4.2, 4.2] },
        { name: 'Operasyon', data: [3.6, 3.7, 3.7, 3.7, 3.8, 3.8] }
    ],
    completion: [
        { name: 'Yazılım Geliştirme', data: [65, 68, 70, 72, 73, 74] },
        { name: 'Pazarlama', data: [75, 78, 80, 81, 82, 84] },
        { name: 'İnsan Kaynakları', data: [62, 65, 67, 68, 69, 70] },
        { name: 'Finans', data: [83, 85, 86, 88, 89, 90] },
        { name: 'Satış', data: [70, 72, 73, 74, 75, 77] },
        { name: 'Operasyon', data: [60, 62, 64, 65, 67, 68] }
    ]
});

// Grafikler için veri hazırlama
const departmentCompletionBarData = computed(() => {
    return {
        labels: departmentPerformanceData.value.map(d => d.department),
        datasets: [
            {
                label: 'Eğitim Tamamlama Oranı (%)',
                backgroundColor: '#42A5F5',
                data: departmentPerformanceData.value.map(d => d.completionRate)
            }
        ]
    };
});

const departmentPerformanceBarData = computed(() => {
    return {
        labels: departmentPerformanceData.value.map(d => d.department),
        datasets: [
            {
                label: 'Ortalama Performans Puanı (5 üzerinden)',
                backgroundColor: '#66BB6A',
                data: departmentPerformanceData.value.map(d => d.averagePerformance)
            }
        ]
    };
});

const categoryCompletionBarData = computed(() => {
    return {
        labels: categoryCompletionData.value.map(c => c.category),
        datasets: [
            {
                label: 'Kategori Tamamlama Oranı (%)',
                backgroundColor: '#7E57C2',
                data: categoryCompletionData.value.map(c => c.completionRate)
            }
        ]
    };
});

const trainingBudgetDoughnutData = computed(() => {
    return {
        labels: departmentPerformanceData.value.map(d => d.department),
        datasets: [
            {
                data: departmentPerformanceData.value.map(d => d.trainingBudgetUsed),
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'],
                hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#4DD0E1', '#9575CD', '#F06292']
            }
        ]
    };
});

const timeSeriesPerformanceData = computed(() => {
    const datasets = timeSeriesData.value.departments.map((dept, index) => {
        // Renkler için
        const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'];
        return {
            label: dept.name,
            data: dept.data,
            borderColor: colors[index % colors.length],
            fill: false,
            tension: 0.4
        };
    });

    return {
        labels: timeSeriesData.value.labels,
        datasets: datasets
    };
});

const timeSeriesCompletionData = computed(() => {
    const datasets = timeSeriesData.value.completion.map((dept, index) => {
        const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'];
        return {
            label: dept.name,
            data: dept.data,
            borderColor: colors[index % colors.length],
            fill: false,
            tension: 0.4
        };
    });

    return {
        labels: timeSeriesData.value.labels,
        datasets: datasets
    };
});

// Grafik ayarları
const barOptions = ref({
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

const lineOptions = ref({
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
            },
            suggestedMin: 0,
            suggestedMax: 5
        }
    }
});

const completionLineOptions = ref({
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
            },
            suggestedMin: 0,
            suggestedMax: 100
        }
    }
});

const doughnutOptions = ref({
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        },
        title: {
            display: true,
            text: 'Eğitim Bütçesi Kullanımı (%)',
            color: '#495057'
        }
    }
});

// Filtreleme ve tablo için gerekli değişkenler
const selectedDateRange = ref([]);
const filters = ref({
    global: { value: null, matchMode: 'contains' },
    department: { value: null, matchMode: 'in' }
});
const globalFilterValue = ref('');

// Global filtreleme
const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters.value };
    
    _filters['global'].value = value;
    filters.value = _filters;
    globalFilterValue.value = value;
};

// Departman filtresi
const onDepartmentFilterChange = () => {
    let _filters = { ...filters.value };
    
    if (selectedDepartments.value.length) {
        _filters['department'].value = selectedDepartments.value.map(d => d.name);
    } else {
        _filters['department'].value = null;
    }
    
    filters.value = _filters;
};

// Dönem değişikliği
const onPeriodChange = () => {
    toast.add({ severity: 'info', summary: 'Dönem Değişti', detail: `${selectedPeriod.value.name} dönemine ait veriler yüklendi`, life: 3000 });
    // Burada API'dan yeni veriler çekilebilir
};

// Getirilen raporları dışa aktarma
const exportCSV = (fileName) => {
    toast.add({ severity: 'success', summary: 'Dışa Aktarma', detail: `${fileName} başarıyla dışa aktarıldı.`, life: 3000 });
};

// Duruma göre renk belirleme
const getCompletionSeverity = (value) => {
    if (value < 50) return 'danger';
    if (value < 75) return 'warning';
    return 'success';
};

// Sayfa yüklendiğinde
onMounted(() => {
    // Burada API'den veri çekilebilir
    console.log('Reports component mounted');
});
</script>

<template>
    <div class="grid">
        <Toast />
        
        <!-- Rapor Filtreleri -->
        <div class="col-12">
            <div class="card">
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5>Raporlar</h5>
                    <div class="mt-3 md:mt-0 flex flex-column md:flex-row align-items-center">
                        <div class="field mr-3 mb-2 md:mb-0">
                            <span class="font-bold mr-2">Dönem:</span>
                            <Dropdown v-model="selectedPeriod" :options="periods" optionLabel="name" 
                                class="w-full md:w-14rem" @change="onPeriodChange" />
                        </div>
                        <div class="field">
                            <span class="font-bold mr-2">Özel Tarih Aralığı:</span>
                            <Calendar v-model="selectedDateRange" selection="range" dateFormat="dd/mm/yy" 
                                placeholder="Tarih Aralığı Seçin" class="w-full md:w-14rem" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Rapor Sekmeleri -->
        <div class="col-12">
            <TabView>
                <!-- Eğitim Tamamlama Raporları -->
                <TabPanel header="Eğitim Tamamlama">
                    <div class="grid">
                        <!-- Departman Bazlı Eğitim Tamamlama Grafiği -->
                        <div class="col-12 lg:col-6">
                            <Card title="Departman Bazlı Eğitim Tamamlama" class="h-full">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Departman_Egitim_Tamamlama.csv')" />
                                </div>
                                <Chart type="bar" :data="departmentCompletionBarData" :options="barOptions" class="h-20rem" />
                            </Card>
                        </div>
                        
                        <!-- Kategori Bazlı Eğitim Tamamlama Grafiği -->
                        <div class="col-12 lg:col-6">
                            <Card title="Kategori Bazlı Eğitim Tamamlama" class="h-full">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Kategori_Egitim_Tamamlama.csv')" />
                                </div>
                                <Chart type="bar" :data="categoryCompletionBarData" :options="barOptions" class="h-20rem" />
                            </Card>
                        </div>
                        
                        <!-- Zaman İçinde Eğitim Tamamlama Oranları -->
                        <div class="col-12">
                            <Card title="Zaman İçinde Eğitim Tamamlama Oranları" class="h-full">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Zaman_Icinde_Egitim_Tamamlama.csv')" />
                                </div>
                                <Chart type="line" :data="timeSeriesCompletionData" :options="completionLineOptions" class="h-20rem" />
                            </Card>
                        </div>
                        
                        <!-- Çalışan Eğitim Tamamlama Detayları -->
                        <div class="col-12">
                            <Card title="Çalışan Eğitim Tamamlama Detayları">
                                <div class="flex flex-column md:flex-row justify-content-between mb-3">
                                    <div class="mb-3 md:mb-0">
                                        <span class="p-input-icon-left">
                                            <i class="pi pi-search" />
                                            <InputText v-model="globalFilterValue" placeholder="Ara..." @input="onGlobalFilterChange" />
                                        </span>
                                    </div>
                                    <div class="flex align-items-center">
                                        <span class="mr-2">Departman:</span>
                                        <MultiSelect v-model="selectedDepartments" :options="departments" optionLabel="name" 
                                            placeholder="Departman Seçin" class="w-full md:w-20rem" @change="onDepartmentFilterChange" />
                                        <Button icon="pi pi-download" class="p-button-text ml-2" @click="exportCSV('Calisan_Egitim_Tamamlama.csv')" />
                                    </div>
                                </div>
                                
                                <DataTable :value="trainingCompletionData" :paginator="true" :rows="10" 
                                    dataKey="employeeId" :rowHover="true" :filters="filters" 
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    :rowsPerPageOptions="[5, 10, 25]" 
                                    currentPageReportTemplate="Toplam {totalRecords} çalışan içinden {first} - {last} arası gösteriliyor"
                                    responsiveLayout="scroll">
                                    
                                    <Column field="name" header="Çalışan" sortable></Column>
                                    <Column field="department" header="Departman" sortable></Column>
                                    <Column field="totalAssigned" header="Atanan Eğitim" sortable></Column>
                                    <Column field="completed" header="Tamamlanan" sortable></Column>
                                    <Column field="inProgress" header="Devam Eden" sortable></Column>
                                    <Column field="notStarted" header="Başlanmayan" sortable></Column>
                                    
                                    <Column field="completionRate" header="Tamamlama Oranı" sortable>
                                        <template #body="slotProps">
                                            <div class="flex align-items-center">
                                                <span class="mr-1">%{{ slotProps.data.completionRate }}</span>
                                                <ProgressBar :value="slotProps.data.completionRate" 
                                                    :class="getCompletionSeverity(slotProps.data.completionRate)" 
                                                    style="height: 0.5rem; width: 10rem" />
                                            </div>
                                        </template>
                                    </Column>
                                    
                                    <Column field="averageScore" header="Ortalama Puan" sortable>
                                        <template #body="slotProps">
                                            <span>{{ slotProps.data.averageScore }}/100</span>
                                        </template>
                                    </Column>
                                    
                                    <Column field="lastCompletionDate" header="Son Tamamlama" sortable></Column>
                                </DataTable>
                            </Card>
                        </div>
                    </div>
                </TabPanel>
                
                <!-- Performans Değerlendirme Raporları -->
                <TabPanel header="Performans Değerlendirme">
                    <div class="grid">
                        <!-- Departman Bazlı Performans Grafiği -->
                        <div class="col-12 lg:col-6">
                            <Card title="Departman Bazlı Performans Ortalaması" class="h-full">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Departman_Performans_Ortalamasi.csv')" />
                                </div>
                                <Chart type="bar" :data="departmentPerformanceBarData" :options="barOptions" class="h-20rem" />
                            </Card>
                        </div>
                        
                        <!-- Eğitim Bütçesi Kullanımı -->
                        <div class="col-12 lg:col-6">
                            <Card title="Departman Eğitim Bütçesi Kullanımı" class="h-full">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Egitim_Butcesi_Kullanimi.csv')" />
                                </div>
                                <Chart type="doughnut" :data="trainingBudgetDoughnutData" :options="doughnutOptions" class="h-20rem" />
                            </Card>
                        </div>
                        
                        <!-- Zaman İçinde Performans Değişimi -->
                        <div class="col-12">
                            <Card title="Zaman İçinde Performans Değişimi" class="h-full">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Zaman_Icinde_Performans.csv')" />
                                </div>
                                <Chart type="line" :data="timeSeriesPerformanceData" :options="lineOptions" class="h-20rem" />
                            </Card>
                        </div>
                        
                        <!-- Departman Performans Detayları -->
                        <div class="col-12">
                            <Card title="Departman Performans Detayları">
                                <div class="flex justify-content-end mb-3">
                                    <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Departman_Performans_Detaylari.csv')" />
                                </div>
                                
                                <DataTable :value="departmentPerformanceData" :paginator="true" :rows="10" 
                                    dataKey="department" :rowHover="true" 
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    :rowsPerPageOptions="[5, 10, 25]" 
                                    currentPageReportTemplate="Toplam {totalRecords} departman içinden {first} - {last} arası gösteriliyor"
                                    responsiveLayout="scroll">
                                    
                                    <Column field="department" header="Departman" sortable></Column>
                                    <Column field="employeeCount" header="Çalışan Sayısı" sortable></Column>
                                    <Column field="averagePerformance" header="Ortalama Performans" sortable>
                                        <template #body="slotProps">
                                            <span>{{ slotProps.data.averagePerformance }}/5</span>
                                        </template>
                                    </Column>
                                    <Column field="completionRate" header="Eğitim Tamamlama" sortable>
                                        <template #body="slotProps">
                                            <div class="flex align-items-center">
                                                <span class="mr-1">%{{ slotProps.data.completionRate }}</span>
                                                <ProgressBar :value="slotProps.data.completionRate" 
                                                    :class="getCompletionSeverity(slotProps.data.completionRate)" 
                                                    style="height: 0.5rem; width: 10rem" />
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="topPerformer" header="En Yüksek Performans" sortable></Column>
                                    <Column field="strengths" header="Güçlü Yönler">
                                        <template #body="slotProps">
                                            <div>
                                                <Tag v-for="strength in slotProps.data.strengths" 
                                                    :key="strength" 
                                                    :value="strength" 
                                                    severity="success" 
                                                    class="mr-1 mb-1" />
                                            </div>
                                        </template>
                                    </Column>
                                    <Column field="improvementAreas" header="Gelişim Alanları">
                                        <template #body="slotProps">
                                            <div>
                                                <Tag v-for="area in slotProps.data.improvementAreas" 
                                                    :key="area" 
                                                    :value="area" 
                                                    severity="warning" 
                                                    class="mr-1 mb-1" />
                                            </div>
                                        </template>
                                    </Column>
                                </DataTable>
                            </Card>
                        </div>
                    </div>
                </TabPanel>
                
                <!-- Karşılaştırmalı Raporlar -->
                <TabPanel header="Karşılaştırmalı Analizler">
                    <div class="card">
                        <div class="grid">
                            <div class="col-12 lg:col-6">
                                <Card title="Eğitim vs Performans Korelasyonu">
                                    <div class="flex justify-content-between align-items-center mb-3">
                                        <div class="text-sm text-gray-600">
                                            Eğitim tamamlama oranları ile performans puanları arasındaki ilişki
                                        </div>
                                        <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Egitim_Performans_Korelasyonu.csv')" />
                                    </div>
                                    <div class="grid">
                                        <div class="col-12">
                                            <DataTable :value="departmentPerformanceData" class="mb-4">
                                                <Column field="department" header="Departman"></Column>
                                                <Column field="completionRate" header="Eğitim Tamamlama (%)"></Column>
                                                <Column field="averagePerformance" header="Ortalama Performans"></Column>
                                            </DataTable>
                                        </div>
                                        <div class="col-12">
                                            <p class="text-center font-bold">
                                                Pearson Korelasyon Katsayısı: <span class="text-blue-500">0.78</span>
                                                <Tag value="Güçlü Pozitif Korelasyon" severity="info" class="ml-2" />
                                            </p>
                                            <p class="text-sm text-center text-gray-700 mt-2">
                                                Bu sonuç, eğitim tamamlama oranları ile performans puanları arasında güçlü bir pozitif ilişki olduğunu göstermektedir.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            
                            <div class="col-12 lg:col-6">
                                <Card title="Eğitim Bütçesi Getiri Analizi">
                                    <div class="flex justify-content-between align-items-center mb-3">
                                        <div class="text-sm text-gray-600">
                                            Eğitim bütçesi kullanımı ile performans artışı arasındaki ilişki
                                        </div>
                                        <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Egitim_Butcesi_Getiri_Analizi.csv')" />
                                    </div>
                                    <div class="grid">
                                        <div class="col-12">
                                            <DataTable :value="departmentPerformanceData" class="mb-4">
                                                <Column field="department" header="Departman"></Column>
                                                <Column field="trainingBudgetUsed" header="Bütçe Kullanımı (%)"></Column>
                                                <Column field="averagePerformance" header="Ortalama Performans"></Column>
                                            </DataTable>
                                        </div>
                                        <div class="col-12">
                                            <p class="text-center font-bold">
                                                ROI (Yatırım Getirisi): <span class="text-green-500">%34</span>
                                                <Tag value="Yüksek Verimlilik" severity="success" class="ml-2" />
                                            </p>
                                            <p class="text-sm text-center text-gray-700 mt-2">
                                                Bu sonuç, eğitim bütçesinin etkin kullanımının performans artışında önemli bir faktör olduğunu göstermektedir.
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                            
                            <div class="col-12">
                                <Card title="Departmanlar Arası Karşılaştırmalı Analiz">
                                    <div class="flex justify-content-between align-items-center mb-3">
                                        <div>
                                            <SelectButton v-model="selectedCategories" :options="categories" optionLabel="name" multiple />
                                        </div>
                                        <Button icon="pi pi-download" class="p-button-text" @click="exportCSV('Departmanlar_Arasi_Karsilastirma.csv')" />
                                    </div>
                                    <div class="overflow-x-auto">
                                        <DataTable :value="departmentPerformanceData" class="mb-4">
                                            <Column field="department" header="Departman" frozen></Column>
                                            <Column field="employeeCount" header="Çalışan Sayısı"></Column>
                                            <Column field="averagePerformance" header="Performans Puanı"></Column>
                                            <Column field="completionRate" header="Eğitim Tamamlama (%)"></Column>
                                            <Column field="trainingBudgetUsed" header="Bütçe Kullanımı (%)"></Column>
                                            <Column header="Yıllık Değişim">
                                                <template #body>
                                                    <Tag value="+12%" severity="success" />
                                                </template>
                                            </Column>
                                            <Column header="Hedef Gerçekleşme">
                                                <template #body>
                                                    <Tag value="%90" severity="info" />
                                                </template>
                                            </Column>
                                        </DataTable>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabPanel>
                
                <!-- Özel Raporlar -->
                <TabPanel header="Özel Raporlar">
                    <div class="card">
                        <h6>Özel Rapor Oluşturma</h6>
                        <p class="mb-4">İhtiyaçlarınıza göre özelleştirilmiş raporlar oluşturabilirsiniz.</p>
                        
                        <div class="grid">
                            <div class="col-12 md:col-6">
                                <Card title="Rapor Parametreleri">
                                    <div class="field">
                                        <label for="reportTitle">Rapor Adı</label>
                                        <InputText id="reportTitle" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="dateRange">Tarih Aralığı</label>
                                        <Calendar id="dateRange" class="w-full" selection="range" dateFormat="dd/mm/yy" placeholder="Tarih Aralığı Seçin" />
                                    </div>
                                    
                                    <div class="field">
                                        <label>Departmanlar</label>
                                        <div class="flex flex-wrap gap-2">
                                            <div v-for="dept in departments" :key="dept.code" class="flex align-items-center">
                                                <ToggleButton :onLabel="dept.name" :offLabel="dept.name" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="field">
                                        <label>İçerik</label>
                                        <div class="flex flex-column">
                                            <div class="field-checkbox mb-2">
                                                <input type="checkbox" id="training" checked>
                                                <label for="training">Eğitim Tamamlama</label>
                                            </div>
                                            <div class="field-checkbox mb-2">
                                                <input type="checkbox" id="performance" checked>
                                                <label for="performance">Performans Değerlendirme</label>
                                            </div>
                                            <div class="field-checkbox mb-2">
                                                <input type="checkbox" id="budget" checked>
                                                <label for="budget">Bütçe Kullanımı</label>
                                            </div>
                                            <div class="field-checkbox mb-2">
                                                <input type="checkbox" id="trends" checked>
                                                <label for="trends">Zaman İçindeki Trendler</label>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-content-end">
                                        <Button label="Rapor Oluştur" icon="pi pi-chart-line" class="p-button-success" />
                                    </div>
                                </Card>
                            </div>
                            
                            <div class="col-12 md:col-6">
                                <Card title="Kayıtlı Raporlar">
                                    <div class="flex justify-content-end mb-3">
                                        <Button icon="pi pi-download" class="p-button-text" />
                                    </div>
                                    
                                    <DataTable :value="[
                                        { name: 'Q1 2025 Performans Özeti', date: '15.02.2025', owner: 'Mehmet Şahin' },
                                        { name: 'Yazılım Dept. Eğitim Analizi', date: '05.03.2025', owner: 'Ayşe Demir' },
                                        { name: 'Yıllık Karşılaştırmalı Analiz', date: '01.03.2025', owner: 'Ahmet Yılmaz' },
                                        { name: 'Bütçe Kullanım Raporu', date: '25.02.2025', owner: 'Zeynep Kaya' }
                                    ]">
                                        <Column field="name" header="Rapor Adı"></Column>
                                        <Column field="date" header="Oluşturma Tarihi"></Column>
                                        <Column field="owner" header="Oluşturan"></Column>
                                        <Column header="İşlemler">
                                            <template #body>
                                                <div class="flex">
                                                    <Button icon="pi pi-eye" class="p-button-rounded p-button-text p-button-sm" />
                                                    <Button icon="pi pi-download" class="p-button-rounded p-button-text p-button-sm" />
                                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-sm p-button-danger" />
                                                </div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                    
                                    <div class="mt-4">
                                        <h6>Rapor Planlaması</h6>
                                        <div class="grid">
                                            <div class="col-12 field">
                                                <label>Rapor Tipi</label>
                                                <Dropdown class="w-full" 
                                                    placeholder="Rapor Tipi Seçin" 
                                                    :options="['Haftalık Özet', 'Aylık Departman Analizi', 'Çeyreklik Karşılaştırma', 'Yıllık Değerlendirme']" />
                                            </div>
                                            <div class="col-12 field">
                                                <label>Gönderim Sıklığı</label>
                                                <Dropdown class="w-full" 
                                                    placeholder="Sıklık Seçin" 
                                                    :options="['Günlük', 'Haftalık', 'Aylık', 'Çeyreklik']" />
                                            </div>
                                            <div class="col-12 field">
                                                <label>E-posta Adresleri</label>
                                                <InputText class="w-full" placeholder="örn: isim@sirket.com, isim2@sirket.com" />
                                            </div>
                                            <div class="col-12 flex justify-content-end">
                                                <Button label="Planla" icon="pi pi-calendar" class="p-button-info" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
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

.p-datatable-responsive .p-datatable-tbody > tr > td .p-column-title {
    display: none;
}

@media screen and (max-width: 40em) {
    .p-datatable-responsive .p-datatable-thead > tr > th,
    .p-datatable-responsive .p-datatable-tfoot > tr > td {
        display: none !important;
    }

    .p-datatable-responsive .p-datatable-tbody > tr > td {
        text-align: left;
        display: block;
        width: 100%;
        float: left;
        clear: left;
        border: 0 none;
    }

    .p-datatable-responsive .p-datatable-tbody > tr > td .p-column-title {
        padding: 0.4rem;
        min-width: 30%;
        display: inline-block;
        margin: -0.4rem 1rem -0.4rem -0.4rem;
        font-weight: bold;
    }
}
</style>