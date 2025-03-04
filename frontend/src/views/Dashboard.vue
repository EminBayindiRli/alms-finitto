<script setup>
import { ref, onMounted } from 'vue';
import Chart from 'primevue/chart';
import { FilterService } from 'primevue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ProgressBar from 'primevue/progressbar';
import Card from 'primevue/card';
import { useToast } from 'primevue/usetoast';
import api from '../services/api';
import { user } from '../services/auth';

const toast = useToast();
const loading = ref(true);
const employeeData = ref(null);
const allEmployeesData = ref(null);

// Charts data
const performanceData = ref({
    labels: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'],
    datasets: [
        {
            label: 'Çalışan Performansı',
            data: [0, 0, 0, 0, 0, 0],
            fill: false,
            borderColor: '#42A5F5',
            tension: .4
        },
        {
            label: 'Departman Ortalaması',
            data: [0, 0, 0, 0, 0, 0],
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
            data: [0, 0, 0, 0, 0, 0]
        }
    ]
});

// Eğitim kategorilerine göre dağılım
const trainingCategoryData = ref({
    labels: ['Teknik', 'Yönetimsel', 'İletişim', 'Müşteri İlişkileri', 'Proje Yönetimi', 'Yazılım'],
    datasets: [
        {
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#26C6DA', '#7E57C2', '#EC407A'],
            hoverBackgroundColor: ['#64B5F6', '#81C784', '#FFB74D', '#4DD0E1', '#9575CD', '#F06292']
        }
    ]
});

// Skorlar
const scoreData = ref([]);

// API'den veri çekme fonksiyonu
async function fetchData() {
    loading.value = true;
    
    try {
        // Kullanıcı rolüne göre farklı API çağrıları
        const userRole = user.value?.user_metadata?.role || 'employee';
        const employeeId = user.value?.user_metadata?.employee_id || '1'; // Default employee ID
        
        if (userRole === 'admin') {
            // Yönetici ise tüm çalışanların verilerini çek
            const data = await api.getAllEmployeeAnalysis();
            if (data) {
                allEmployeesData.value = data;
                updateChartsWithAllData(data);
            }
        } else {
            // Çalışan ise sadece kendi verilerini çek
            const data = await api.getEmployeeAnalysis(employeeId);
            if (data) {
                employeeData.value = data;
                updateChartsWithEmployeeData(data);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.add({ severity: 'error', summary: 'Veri Yükleme Hatası', detail: 'Veriler yüklenirken bir hata oluştu.', life: 3000 });
        // Hata durumunda dummy veri göster
        useDummyData();
    } finally {
        loading.value = false;
    }
}

// Tüm çalışan verilerine göre grafikleri güncelle
function updateChartsWithAllData(data) {
    if (!data || !data.department_statistics) {
        useDummyData();
        return;
    }
    
    // Performans grafiği için veri
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
    const deptPerf = Object.values(data.department_statistics).map(dept => dept.average_performance || 0);
    
    performanceData.value = {
        labels: months,
        datasets: [
            {
                label: 'Ortalama Departman Performansı',
                data: deptPerf.length ? Array(months.length).fill(deptPerf.reduce((a, b) => a + b, 0) / deptPerf.length) : [65, 70, 75, 77, 80, 82],
                fill: false,
                borderColor: '#42A5F5',
                tension: .4
            }
        ]
    };
    
    // Skor verilerini güncelle
    if (data.total_employees) {
        scoreData.value = [
            { name: 'Toplam Çalışan', value: data.total_employees, icon: 'pi pi-users' },
            { name: 'Tamamlanan Eğitimler', value: calculateTotalCompletedTrainings(data), icon: 'pi pi-check-circle' },
            { name: 'Ortalama Performans', value: calculateAveragePerformance(data), icon: 'pi pi-chart-line' },
            { name: 'Aktif Eğitimler', value: calculateActiveTrainings(data), icon: 'pi pi-book' }
        ];
    } else {
        useDummyData();
    }
}

// Çalışan verileriyle grafikleri güncelle
function updateChartsWithEmployeeData(data) {
    if (!data || !data.current_metrics) {
        useDummyData();
        return;
    }
    
    // Performans grafiği için veri
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran'];
    let perfData = [];
    
    if (data.historical_trends && data.historical_trends.performance) {
        perfData = Object.values(data.historical_trends.performance).slice(-6);
        while (perfData.length < 6) perfData.unshift(0);
    } else {
        perfData = [65, 70, 75, 77, 80, 82]; // Fallback data
    }
    
    performanceData.value = {
        labels: months,
        datasets: [
            {
                label: 'Kişisel Performans',
                data: perfData,
                fill: false,
                borderColor: '#42A5F5',
                tension: .4
            }
        ]
    };
    
    // Eğitim tamamlama oranları için veri
    const trainingCategories = ['Teknik', 'Yönetimsel', 'İletişim', 'Müşteri İlişkileri', 'Proje Yönetimi', 'Yazılım'];
    let completionRates = [];
    
    if (data.performance_summary && data.performance_summary.training_completion_by_category) {
        completionRates = trainingCategories.map(cat => {
            return data.performance_summary.training_completion_by_category[cat.toLowerCase()] || Math.floor(Math.random() * 40) + 60;
        });
    } else {
        completionRates = [85, 75, 90, 65, 80, 70]; // Fallback data
    }
    
    trainingCompletionData.value = {
        labels: trainingCategories,
        datasets: [
            {
                label: 'Tamamlama Oranı',
                backgroundColor: '#42A5F5',
                data: completionRates
            }
        ]
    };
    
    // Skor kartları için veri
    scoreData.value = [
        { 
            name: 'Performans Puanı', 
            value: data.current_metrics.overall_performance ? Math.round(data.current_metrics.overall_performance) : 78, 
            icon: 'pi pi-chart-line' 
        },
        { 
            name: 'Tamamlanan Eğitimler', 
            value: data.performance_summary?.completed_trainings || 12, 
            icon: 'pi pi-check-circle' 
        },
        { 
            name: 'Devam Eden Eğitimler', 
            value: data.performance_summary?.active_trainings || 3, 
            icon: 'pi pi-spin pi-spinner' 
        },
        { 
            name: 'İşbirliği Puanı', 
            value: data.current_metrics.collaboration_score ? Math.round(data.current_metrics.collaboration_score) : 85, 
            icon: 'pi pi-users' 
        }
    ];
}

// Helper fonksiyonlar
function calculateTotalCompletedTrainings(data) {
    if (!data.department_statistics) return 450;
    let total = 0;
    Object.values(data.department_statistics).forEach(dept => {
        total += dept.completed_trainings || 0;
    });
    return total || 450;
}

function calculateAveragePerformance(data) {
    if (!data.department_statistics) return 82;
    const performances = Object.values(data.department_statistics).map(dept => dept.average_performance || 0);
    return performances.length ? Math.round(performances.reduce((a, b) => a + b, 0) / performances.length) : 82;
}

function calculateActiveTrainings(data) {
    if (!data.department_statistics) return 24;
    let total = 0;
    Object.values(data.department_statistics).forEach(dept => {
        total += dept.active_trainings || 0;
    });
    return total || 24;
}

// Fallback dummy veri
function useDummyData() {
    // Mevcut veri varsa değiştirme
    if (scoreData.value.length) return;
    
    performanceData.value = {
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
    };
    
    scoreData.value = [
        { name: 'Performans Puanı', value: 88, icon: 'pi pi-chart-line' },
        { name: 'Tamamlanan Eğitimler', value: 12, icon: 'pi pi-check-circle' },
        { name: 'Devam Eden Eğitimler', value: 3, icon: 'pi pi-spin pi-spinner' },
        { name: 'İşbirliği Puanı', value: 85, icon: 'pi pi-users' }
    ];
}

// Component yüklendiğinde verileri çek
onMounted(() => {
    fetchData();
});

// Kullanıcı rolüne göre başlık
const dashboardTitle = ref('');
onMounted(() => {
    const userRole = user.value?.user_metadata?.role || 'employee';
    dashboardTitle.value = userRole === 'admin' 
        ? 'Şirket Geneli Eğitim ve Performans Verileri' 
        : 'Kişisel eğitim ve performans verileriniz';
});
</script>

<template>
    <div class="grid w-full">
        <!-- Dashboard Header -->
        <div class="col-12">
            <div class="card mb-0">
                <div class="flex flex-column xl:flex-row xl:justify-content-between">
                    <div class="flex flex-column sm:flex-row align-items-center">
                        <div>
                            <span class="block text-900 font-bold text-3xl mb-1">{{ dashboardTitle }}</span>
                            <span class="text-500 font-medium text-xl">Son güncelleme: {{ new Date().toLocaleDateString() }}</span>
                        </div>
                    </div>
                    <div class="flex flex-column sm:flex-row sm:justify-content-end gap-2 mt-3 xl:mt-0">
                        <Button label="Rapor İndir" icon="pi pi-download" severity="success" />
                        <Button label="Yenile" icon="pi pi-refresh" :loading="loading" @click="fetchData" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Skor Kartları -->
        <div v-for="(card, i) in scoreData" :key="i" class="col-12 sm:col-6 xl:col-3">
            <div class="card mb-0 h-full">
                <div class="flex justify-content-between">
                    <div>
                        <span class="block text-500 font-medium mb-2">{{ card.name }}</span>
                        <div class="text-900 font-medium text-2xl">{{ card.value }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-primary border-round" style="width: 2.5rem; height: 2.5rem">
                        <i :class="card.icon" class="text-white text-xl"></i>
                    </div>
                </div>
            </div>
        </div>

        <!-- Grafikler -->
        <div class="col-12 xl:col-8">
            <div class="card h-full">
                <h5>Performans Değişimi</h5>
                <Chart type="line" :data="performanceData" />
            </div>
        </div>

        <div class="col-12 xl:col-4">
            <div class="card h-full">
                <h5>Eğitim Tamamlama Oranları</h5>
                <Chart type="bar" :data="trainingCompletionData" />
            </div>
        </div>

        <!-- Önerilen Eğitimler -->
        <div class="col-12">
            <div class="card">
                <h5>Size Özel Eğitim Önerileri</h5>
                <DataTable :value="[
                        { title: 'Microsoft Azure Temelleri', category: 'Teknik', priority: 'Yüksek', completion: 0 },
                        { title: 'Etkili İletişim', category: 'İletişim', priority: 'Orta', completion: 25 },
                        { title: 'Veri Bilimi ve Analitik', category: 'Yazılım', priority: 'Yüksek', completion: 10 },
                        { title: 'Proje Yönetimi', category: 'Yönetimsel', priority: 'Orta', completion: 0 }
                    ]" :rows="4" :paginator="false" responsiveLayout="scroll">
                    <Column field="title" header="Eğitim Adı"></Column>
                    <Column field="category" header="Kategori"></Column>
                    <Column field="priority" header="Öncelik"></Column>
                    <Column header="Tamamlanma">
                        <template #body="slotProps">
                            <div class="flex align-items-center gap-2">
                                <ProgressBar :value="slotProps.data.completion" style="height: 0.5rem; width: 10rem"></ProgressBar>
                                <span>{{ slotProps.data.completion }}%</span>
                            </div>
                        </template>
                    </Column>
                    <Column>
                        <template #body>
                            <Button icon="pi pi-play" label="Başla" text />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
