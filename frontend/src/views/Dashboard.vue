<script setup>
import { ref, onMounted } from 'vue';
import { Chart } from 'primevue/chart';
import { FilterService } from 'primevue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressBar from 'primevue/progressbar';
import Card from 'primevue/card';

// Mock data - Performans skorları
const performanceData = ref({
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
        {
            label: 'Çalışan Performansı',
            data: [65, 72, 78, 75, 82, 88],
            fill: false,
            borderColor: '#42A5F5',
            tension: .4
        },
        {
            label: 'Departman Ortalaması',
            data: [63, 67, 70, 72, 75, 78],
            fill: false,
            borderColor: '#FFA726',
            tension: .4
        }
    ]
});

// Eğitim tamamlama oranları
const trainingCompletionData = ref({
    labels: ['Teknik', 'Yönetimsel', 'İletişim', 'Müşteri İlişkileri', 'Proje Yönetimi', 'Yazılım'],
    datasets: [
        {
            label: 'Tamamlama Oranı',
            backgroundColor: '#42A5F5',
            data: [85, 60, 90, 75, 65, 80]
        }
    ]
});

// Eğitim kategorilerine göre dağılım
const trainingCategoryData = ref({
    labels: ['Teknik', 'Yönetimsel', 'İletişim', 'Müşteri İlişkileri', 'Proje Yönetimi', 'Yazılım'],
    datasets: [
        {
            data: [30, 15, 20, 10, 15, 10],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'],
            hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#4DD0E1', '#9575CD', '#F06292']
        }
    ]
});

// Son 5 eğitim
const recentTrainings = ref([
    { id: 1, name: 'Yazılım Mimarisi Temelleri', category: 'Teknik', completed: '2025-02-25', score: 92 },
    { id: 2, name: 'Etkili İletişim Becerileri', category: 'İletişim', completed: '2025-02-20', score: 85 },
    { id: 3, name: 'Agile Proje Yönetimi', category: 'Proje Yönetimi', completed: '2025-02-15', score: 78 },
    { id: 4, name: 'Modern JavaScript', category: 'Yazılım', completed: '2025-02-10', score: 95 },
    { id: 5, name: 'Müşteri Deneyimi', category: 'Müşteri İlişkileri', completed: '2025-02-05', score: 88 }
]);

// Genel performans metrikleri
const metrics = ref([
    { name: 'Genel Performans', value: 85, target: 80, status: 'success' },
    { name: 'Eğitim Tamamlama', value: 75, target: 90, status: 'warning' },
    { name: 'Beceri Puanı', value: 82, target: 75, status: 'success' },
    { name: 'Takım Çalışması', value: 90, target: 85, status: 'success' }
]);

// Chart options
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
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

const barOptions = ref({
    indexAxis: 'y',
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

// Kullanıcı rolüne göre title değişimi (eski sayfada zaten vardı)
const isEmployee = ref(true); // Bu değer API'den gelen kullanıcı rolüne göre değişecek

onMounted(() => {
    // Burada API'den veri çekilebilir
    console.log('Dashboard bileşeni yüklendi');
});
</script>

<template>
    <div class="grid">
        <!-- Dashboard Header -->
        <div class="col-12">
            <div class="card mb-0">
                <div class="flex justify-content-between align-items-center mb-5">
                    <div>
                        <h5 class="m-0">{{ isEmployee ? 'Kişisel Dashboard' : 'Şirket Dashboard' }}</h5>
                        <span class="text-500">{{ isEmployee ? 'Kişisel eğitim ve performans verileriniz' : 'Şirket geneli eğitim ve performans verileri' }}</span>
                    </div>
                    <div class="flex align-items-center">
                        <span class="font-bold mr-2">Son Güncelleme:</span>
                        <span>4 Mart 2025</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Performans Metrikleri -->
        <div class="col-12">
            <div class="card">
                <h5>Performans Metrikleri</h5>
                <div class="grid">
                    <div v-for="metric in metrics" :key="metric.name" class="col-12 md:col-6 lg:col-3">
                        <div class="card mb-0">
                            <div class="flex justify-content-between mb-3">
                                <div>
                                    <span class="block text-500 font-medium mb-3">{{ metric.name }}</span>
                                    <div class="text-900 font-medium text-xl">{{ metric.value }}%</div>
                                </div>
                                <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width:2.5rem;height:2.5rem">
                                    <i class="pi pi-chart-line text-blue-500 text-xl"></i>
                                </div>
                            </div>
                            <span class="text-500">Hedef: {{ metric.target }}%</span>
                            <ProgressBar :value="metric.value" :class="'mt-2 ' + metric.status"></ProgressBar>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Performans Grafiği -->
        <div class="col-12 lg:col-6">
            <div class="card">
                <h5>Performans Gelişimi</h5>
                <Chart type="line" :data="performanceData" :options="chartOptions" class="h-20rem"></Chart>
            </div>
        </div>

        <!-- Eğitim Kategorileri Dağılımı -->
        <div class="col-12 lg:col-6">
            <div class="card">
                <h5>Eğitim Kategorileri Dağılımı</h5>
                <Chart type="pie" :data="trainingCategoryData" :options="pieOptions" class="h-20rem"></Chart>
            </div>
        </div>

        <!-- Eğitim Tamamlama Oranları -->
        <div class="col-12">
            <div class="card">
                <h5>Eğitim Tamamlama Oranları</h5>
                <Chart type="bar" :data="trainingCompletionData" :options="barOptions" class="h-20rem"></Chart>
            </div>
        </div>

        <!-- Son Eğitimler Tablosu -->
        <div class="col-12">
            <div class="card">
                <h5>Son Tamamlanan Eğitimler</h5>
                <DataTable :value="recentTrainings" :paginator="true" :rows="5" responsiveLayout="scroll">
                    <Column field="name" header="Eğitim Adı" sortable></Column>
                    <Column field="category" header="Kategori" sortable></Column>
                    <Column field="completed" header="Tamamlama Tarihi" sortable></Column>
                    <Column field="score" header="Skor">
                        <template #body="slotProps">
                            <div class="flex align-items-center">
                                <span class="mr-2">{{ slotProps.data.score }}%</span>
                                <ProgressBar :value="slotProps.data.score" :class="slotProps.data.score > 80 ? 'success' : 'warning'" style="height: .5rem; width: 10rem"></ProgressBar>
                            </div>
                        </template>
                    </Column>
                </DataTable>
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
</style>
