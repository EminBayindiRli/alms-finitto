<script setup>
import { ref, onMounted, computed } from 'vue';
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
import RadioButton from 'primevue/radiobutton';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import { TriStateCheckbox } from 'primevue';
import MultiSelect from 'primevue/multiselect';

const toast = useToast();

// Performans değerlendirme dönemleri
const evaluationPeriods = ref([
    { name: '2025 Q1', code: '2025-q1' },
    { name: '2024 Q4', code: '2024-q4' },
    { name: '2024 Q3', code: '2024-q3' },
    { name: '2024 Q2', code: '2024-q2' },
    { name: '2024 Q1', code: '2024-q1' }
]);

// Aktif değerlendirme dönemi
const selectedPeriod = ref(evaluationPeriods.value[0]);

// Performans statüsü
const performanceStatuses = ref([
    { name: 'Değerlendirme Bekliyor', code: 'pending', color: 'warning' },
    { name: 'Değerlendiriliyor', code: 'in_progress', color: 'info' },
    { name: 'Tamamlandı', code: 'completed', color: 'success' },
    { name: 'İptal Edildi', code: 'cancelled', color: 'danger' }
]);

// Performans yetkinlikleri
const competencies = ref([
    { name: 'Teknik Beceriler', code: 'technical' },
    { name: 'Problem Çözme', code: 'problem_solving' },
    { name: 'İletişim', code: 'communication' },
    { name: 'Takım Çalışması', code: 'teamwork' },
    { name: 'Liderlik', code: 'leadership' },
    { name: 'İnovasyon', code: 'innovation' },
    { name: 'İş Etiği', code: 'ethics' },
    { name: 'Adaptasyon', code: 'adaptability' }
]);

// Mock çalışan performans verileri
const performanceData = ref([
    {
        id: 1,
        employeeId: 101,
        employeeName: 'Ahmet Yılmaz',
        department: 'Yazılım Geliştirme',
        position: 'Senior Yazılım Mühendisi',
        period: '2025 Q1',
        status: 'Tamamlandı',
        overallScore: 4.3,
        managerId: 201,
        managerName: 'Mehmet Şahin',
        submissionDate: '2025-03-01',
        completionDate: '2025-03-15',
        competencyScores: {
            technical: 4.7,
            problem_solving: 4.5,
            communication: 4.0,
            teamwork: 4.2,
            leadership: 3.8,
            innovation: 4.4,
            ethics: 4.8,
            adaptability: 4.0
        },
        strengths: 'Teknik konularda uzman, problem çözme becerileri yüksek, iş etiği konusunda örnek.',
        improvements: 'Liderlik ve iletişim becerilerini geliştirmesi gerekiyor.',
        goals: [
            { id: 1, description: 'Yeni teknolojileri öğrenmek', status: 'in_progress', dueDate: '2025-06-30' },
            { id: 2, description: 'Liderlik eğitimini tamamlamak', status: 'not_started', dueDate: '2025-09-30' },
            { id: 3, description: 'Kod kalitesi ölçümlerini iyileştirmek', status: 'completed', dueDate: '2025-03-15' }
        ]
    },
    {
        id: 2,
        employeeId: 102,
        employeeName: 'Ayşe Demir',
        department: 'Pazarlama',
        position: 'Pazarlama Uzmanı',
        period: '2025 Q1',
        status: 'Değerlendiriliyor',
        overallScore: 3.8,
        managerId: 202,
        managerName: 'Zeynep Kaya',
        submissionDate: '2025-03-05',
        completionDate: null,
        competencyScores: {
            technical: 3.5,
            problem_solving: 3.8,
            communication: 4.5,
            teamwork: 4.3,
            leadership: 3.5,
            innovation: 4.0,
            ethics: 4.7,
            adaptability: 3.7
        },
        strengths: 'Müşteri iletişimi çok kuvvetli, ekip çalışmasında başarılı.',
        improvements: 'Teknik bilgi ve problem çözme becerilerini geliştirmesi gerekiyor.',
        goals: [
            { id: 4, description: 'Dijital pazarlama sertifikası almak', status: 'in_progress', dueDate: '2025-07-15' },
            { id: 5, description: 'Sosyal medya stratejisi oluşturmak', status: 'completed', dueDate: '2025-02-28' }
        ]
    },
    {
        id: 3,
        employeeId: 103,
        employeeName: 'Ali Öztürk',
        department: 'İnsan Kaynakları',
        position: 'İK Uzmanı',
        period: '2025 Q1',
        status: 'Değerlendirme Bekliyor',
        overallScore: null,
        managerId: 202,
        managerName: 'Zeynep Kaya',
        submissionDate: null,
        completionDate: null,
        competencyScores: {
            technical: 0,
            problem_solving: 0,
            communication: 0,
            teamwork: 0,
            leadership: 0,
            innovation: 0,
            ethics: 0,
            adaptability: 0
        },
        strengths: '',
        improvements: '',
        goals: [
            { id: 6, description: 'Çalışan memnuniyeti anketi hazırlamak', status: 'in_progress', dueDate: '2025-04-15' },
            { id: 7, description: 'İK süreçlerini optimize etmek', status: 'not_started', dueDate: '2025-06-30' }
        ]
    },
    {
        id: 4,
        employeeId: 104,
        employeeName: 'Mustafa Aydın',
        department: 'Yazılım Geliştirme',
        position: 'Yazılım Mühendisi',
        period: '2025 Q1',
        status: 'Tamamlandı',
        overallScore: 4.0,
        managerId: 201,
        managerName: 'Mehmet Şahin',
        submissionDate: '2025-02-28',
        completionDate: '2025-03-10',
        competencyScores: {
            technical: 4.5,
            problem_solving: 4.3,
            communication: 3.5,
            teamwork: 4.0,
            leadership: 3.2,
            innovation: 4.2,
            ethics: 4.6,
            adaptability: 3.8
        },
        strengths: 'Teknik bilgisi üst düzeyde, inovatif çözümler üretebiliyor.',
        improvements: 'İletişim ve liderlik becerilerini geliştirmesi gerekiyor.',
        goals: [
            { id: 8, description: 'Yeni programlama dilini öğrenmek', status: 'in_progress', dueDate: '2025-08-30' },
            { id: 9, description: 'Projenin test otomasyonunu tamamlamak', status: 'completed', dueDate: '2025-03-01' }
        ]
    },
    {
        id: 5,
        employeeId: 105,
        employeeName: 'Zehra Yıldız',
        department: 'Finans',
        position: 'Finans Uzmanı',
        period: '2025 Q1',
        status: 'Tamamlandı',
        overallScore: 4.5,
        managerId: 203,
        managerName: 'Ahmet Çelik',
        submissionDate: '2025-02-20',
        completionDate: '2025-03-05',
        competencyScores: {
            technical: 4.6,
            problem_solving: 4.7,
            communication: 4.3,
            teamwork: 4.2,
            leadership: 4.1,
            innovation: 4.0,
            ethics: 4.9,
            adaptability: 4.4
        },
        strengths: 'Analitik düşünme becerileri mükemmel, iş etiğinde örnek, problem çözme yeteneği çok yüksek.',
        improvements: 'İnovasyon ve yaratıcılık konularında gelişebilir.',
        goals: [
            { id: 10, description: 'Finans sertifikası almak', status: 'completed', dueDate: '2025-01-30' },
            { id: 11, description: 'Bütçe optimizasyon projesi', status: 'in_progress', dueDate: '2025-05-15' }
        ]
    }
]);

// Hedef Statüsü
const goalStatuses = ref([
    { name: 'Başlamadı', code: 'not_started', icon: 'pi pi-clock', color: 'secondary' },
    { name: 'Devam Ediyor', code: 'in_progress', icon: 'pi pi-spin pi-spinner', color: 'info' },
    { name: 'Tamamlandı', code: 'completed', icon: 'pi pi-check-circle', color: 'success' },
    { name: 'İptal Edildi', code: 'cancelled', icon: 'pi pi-times-circle', color: 'danger' }
]);

// Departman bazlı performans ortalamaları
const departmentScores = ref([
    { department: 'Yazılım Geliştirme', score: 4.15 },
    { department: 'Pazarlama', score: 3.8 },
    { department: 'İnsan Kaynakları', score: 3.7 },
    { department: 'Finans', score: 4.5 },
    { department: 'Satış', score: 4.0 },
    { department: 'Operasyon', score: 3.9 }
]);

// Yetkinlik bazlı genel ortalamalar
const competencyAverages = ref({
    technical: 4.3,
    problem_solving: 4.3,
    communication: 4.1,
    teamwork: 4.2,
    leadership: 3.7,
    innovation: 4.2,
    ethics: 4.8,
    adaptability: 4.0
});

// Departman performans grafiği
const departmentChartData = ref({
    labels: departmentScores.value.map(d => d.department),
    datasets: [
        {
            label: 'Departman Performans Ortalaması',
            backgroundColor: '#42A5F5',
            data: departmentScores.value.map(d => d.score)
        }
    ]
});

// Yetkinlik grafiği
const competencyChartData = ref({
    labels: competencies.value.map(c => c.name),
    datasets: [
        {
            label: 'Yetkinlik Ortalamaları',
            backgroundColor: '#FFA726',
            borderColor: '#FFA726',
            pointBackgroundColor: '#FFA726',
            pointBorderColor: '#FFA726',
            data: competencies.value.map(c => competencyAverages.value[c.code])
        }
    ]
});

// Tamamlanma durumu grafiği
const statusDistributionData = ref({
    labels: performanceStatuses.value.map(s => s.name),
    datasets: [
        {
            data: [1, 1, 3, 0],
            backgroundColor: ['#FFB74D', '#64B5F6', '#81C784', '#e57373'],
            hoverBackgroundColor: ['#FFB74D', '#64B5F6', '#81C784', '#e57373']
        }
    ]
});

// Chart Options
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
            },
            beginAtZero: true,
            max: 5
        }
    }
});

const radarOptions = ref({
    plugins: {
        legend: {
            labels: {
                color: '#495057'
            }
        }
    },
    scales: {
        r: {
            pointLabels: {
                color: '#495057'
            },
            grid: {
                color: '#ebedef'
            },
            angleLines: {
                color: '#ebedef'
            },
            suggestedMin: 0,
            suggestedMax: 5
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
const performanceDialog = ref(false);
const employeePerformanceDialog = ref(false);
const deletePerformanceDialog = ref(false);
const performance = ref({});
const employeePerformance = ref({});
const selectedPerformances = ref(null);
const submitted = ref(false);
const loading = ref(false);

const filters = ref({
    global: { value: null, matchMode: 'contains' },
    status: { value: null, matchMode: 'equals' },
    department: { value: null, matchMode: 'equals' }
});

const globalFilterValue = ref('');
const selectedStatus = ref(null);
const selectedDepartment = ref(null);
const selectedCompetency = ref(null);

// Filtre değişiklikleri
const onStatusChange = () => {
    let _filters = { ...filters.value };
    
    if (selectedStatus.value) {
        _filters['status'].value = selectedStatus.value.name;
    } else {
        _filters['status'].value = null;
    }
    
    filters.value = _filters;
};

const onDepartmentChange = () => {
    let _filters = { ...filters.value };
    
    if (selectedDepartment.value) {
        _filters['department'].value = selectedDepartment.value;
    } else {
        _filters['department'].value = null;
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

// Performans işlemleri
const openNew = () => {
    performance.value = {
        id: null,
        employeeId: null,
        employeeName: '',
        department: '',
        position: '',
        period: selectedPeriod.value.name,
        status: performanceStatuses.value[0].name,
        overallScore: null,
        managerId: null,
        managerName: '',
        submissionDate: null,
        completionDate: null,
        competencyScores: {},
        strengths: '',
        improvements: '',
        goals: []
    };
    
    // Yetkinlik skorlarını başlangıçta 0 olarak ayarla
    competencies.value.forEach(c => {
        performance.value.competencyScores[c.code] = 0;
    });
    
    submitted.value = false;
    performanceDialog.value = true;
};

const hideDialog = () => {
    performanceDialog.value = false;
    submitted.value = false;
};

const hideEmployeeDialog = () => {
    employeePerformanceDialog.value = false;
};

const savePerformance = () => {
    submitted.value = true;

    if (performance.value.employeeName.trim()) {
        loading.value = true;
        
        setTimeout(() => {
            if (performance.value.id) {
                // Performansı güncelle
                const index = findIndexById(performance.value.id);
                performanceData.value[index] = performance.value;
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Performans kaydı güncellendi', life: 3000 });
            } else {
                // Yeni performans kaydı ekle
                performance.value.id = createId();
                performanceData.value.push(performance.value);
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Performans kaydı oluşturuldu', life: 3000 });
            }

            // Grafikleri güncelle
            updateCharts();
            
            performanceDialog.value = false;
            performance.value = {};
            loading.value = false;
        }, 500);
    }
};

const viewEmployeePerformance = (perf) => {
    employeePerformance.value = { ...perf };
    employeePerformanceDialog.value = true;
};

const editPerformance = (perf) => {
    performance.value = { ...perf };
    performanceDialog.value = true;
};

const confirmDeletePerformance = (perf) => {
    performance.value = perf;
    deletePerformanceDialog.value = true;
};

const deletePerformance = () => {
    loading.value = true;
    
    setTimeout(() => {
        performanceData.value = performanceData.value.filter(val => val.id !== performance.value.id);
        deletePerformanceDialog.value = false;
        performance.value = {};
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Performans kaydı silindi', life: 3000 });
        
        // Grafikleri güncelle
        updateCharts();
        
        loading.value = false;
    }, 500);
};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < performanceData.value.length; i++) {
        if (performanceData.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    return performanceData.value.length ? Math.max(...performanceData.value.map(el => el.id)) + 1 : 1;
};

// Görüntüleme yardımcıları
const getStatusSeverity = (status) => {
    switch (status) {
        case 'Tamamlandı': return 'success';
        case 'Değerlendiriliyor': return 'info';
        case 'Değerlendirme Bekliyor': return 'warning';
        case 'İptal Edildi': return 'danger';
        default: return null;
    }
};

const getGoalStatusSeverity = (status) => {
    const goalStatus = goalStatuses.value.find(gs => gs.code === status);
    return goalStatus ? goalStatus.color : 'secondary';
};

const getGoalStatusIcon = (status) => {
    const goalStatus = goalStatuses.value.find(gs => gs.code === status);
    return goalStatus ? goalStatus.icon : 'pi pi-question';
};

// Çalışan performans radarı
const employeeRadarData = computed(() => {
    if (!employeePerformance.value.id) return null;
    
    return {
        labels: competencies.value.map(c => c.name),
        datasets: [
            {
                label: employeePerformance.value.employeeName,
                backgroundColor: 'rgba(66, 165, 245, 0.2)',
                borderColor: '#42A5F5',
                pointBackgroundColor: '#42A5F5',
                pointBorderColor: '#42A5F5',
                pointHoverBackgroundColor: '#FFF',
                pointHoverBorderColor: 'rgba(66, 165, 245, 1)',
                data: competencies.value.map(c => employeePerformance.value.competencyScores[c.code])
            }
        ]
    };
});

// Grafikleri güncelleme
const updateCharts = () => {
    // Departman ortalamaları hesaplama
    const departmentTotals = {};
    const departmentCounts = {};
    
    performanceData.value.forEach(p => {
        if (p.status === 'Tamamlandı' && p.overallScore) {
            if (!departmentTotals[p.department]) {
                departmentTotals[p.department] = 0;
                departmentCounts[p.department] = 0;
            }
            
            departmentTotals[p.department] += p.overallScore;
            departmentCounts[p.department]++;
        }
    });
    
    const updatedDepartmentScores = [];
    for (const dept in departmentTotals) {
        if (departmentCounts[dept] > 0) {
            updatedDepartmentScores.push({
                department: dept,
                score: departmentTotals[dept] / departmentCounts[dept]
            });
        }
    }
    
    departmentScores.value = updatedDepartmentScores;
    
    // Departman grafiği güncelleme
    departmentChartData.value = {
        labels: departmentScores.value.map(d => d.department),
        datasets: [
            {
                label: 'Departman Performans Ortalaması',
                backgroundColor: '#42A5F5',
                data: departmentScores.value.map(d => d.score)
            }
        ]
    };
    
    // Yetkinlik ortalamaları hesaplama
    const competencyTotals = {};
    const competencyCounts = {};
    
    competencies.value.forEach(c => {
        competencyTotals[c.code] = 0;
        competencyCounts[c.code] = 0;
    });
    
    performanceData.value.forEach(p => {
        if (p.status === 'Tamamlandı') {
            for (const comp in p.competencyScores) {
                if (competencyTotals[comp] !== undefined && p.competencyScores[comp] > 0) {
                    competencyTotals[comp] += p.competencyScores[comp];
                    competencyCounts[comp]++;
                }
            }
        }
    });
    
    const updatedCompetencyAverages = {};
    for (const comp in competencyTotals) {
        updatedCompetencyAverages[comp] = competencyCounts[comp] > 0 ? 
            competencyTotals[comp] / competencyCounts[comp] : 0;
    }
    
    competencyAverages.value = updatedCompetencyAverages;
    
    // Yetkinlik grafiği güncelleme
    competencyChartData.value = {
        labels: competencies.value.map(c => c.name),
        datasets: [
            {
                label: 'Yetkinlik Ortalamaları',
                backgroundColor: 'rgba(255, 167, 38, 0.2)',
                borderColor: '#FFA726',
                pointBackgroundColor: '#FFA726',
                pointBorderColor: '#FFA726',
                data: competencies.value.map(c => competencyAverages.value[c.code])
            }
        ]
    };
    
    // Durum dağılımı hesaplama
    const statusCounts = {};
    performanceStatuses.value.forEach(s => {
        statusCounts[s.name] = 0;
    });
    
    performanceData.value.forEach(p => {
        if (statusCounts[p.status] !== undefined) {
            statusCounts[p.status]++;
        }
    });
    
    // Durum dağılımı grafiği güncelleme
    statusDistributionData.value = {
        labels: performanceStatuses.value.map(s => s.name),
        datasets: [
            {
                data: performanceStatuses.value.map(s => statusCounts[s.name]),
                backgroundColor: ['#FFB74D', '#64B5F6', '#81C784', '#e57373'],
                hoverBackgroundColor: ['#FFB74D', '#64B5F6', '#81C784', '#e57373']
            }
        ]
    };
};

// Dönem değişikliği
const onPeriodChange = () => {
    console.log(`Dönem değişti: ${selectedPeriod.value.name}`);
    // Burada seçilen döneme göre verileri filtreleyebilir veya API'den yeni veriler çekebilirsiniz
};

// Yetkinlik skoru formatı
const formatScore = (score) => {
    return score && score > 0 ? score.toFixed(1) : '-';
};

const departments = computed(() => {
    const depts = new Set();
    performanceData.value.forEach(p => depts.add(p.department));
    return Array.from(depts);
});

onMounted(() => {
    // Burada API'den veri çekilebilir
    console.log('Performance component mounted');
    updateCharts();
});
</script>

<template>
    <div class="grid">
        <Toast />
        
        <!-- Performans Dönemi Seçimi -->
        <div class="col-12">
            <div class="card">
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5>Performans Yönetimi</h5>
                    <div class="mt-3 md:mt-0 flex align-items-center">
                        <span class="font-bold mr-2">Değerlendirme Dönemi:</span>
                        <Dropdown v-model="selectedPeriod" :options="evaluationPeriods" optionLabel="name" 
                            class="w-full md:w-14rem" @change="onPeriodChange" />
                        <Button icon="pi pi-plus" label="Yeni Değerlendirme" class="p-button-success ml-3" @click="openNew" />
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Performans Grafikleri -->
        <div class="col-12">
            <div class="card">
                <h5>Performans İstatistikleri</h5>
                <div class="grid">
                    <div class="col-12 lg:col-4">
                        <Card title="Departman Performansları" class="h-full">
                            <Chart type="bar" :data="departmentChartData" :options="barOptions" class="h-20rem" />
                        </Card>
                    </div>
                    <div class="col-12 lg:col-4">
                        <Card title="Yetkinlik Dağılımı" class="h-full">
                            <Chart type="radar" :data="competencyChartData" :options="radarOptions" class="h-20rem" />
                        </Card>
                    </div>
                    <div class="col-12 lg:col-4">
                        <Card title="Değerlendirme Durumları" class="h-full">
                            <Chart type="pie" :data="statusDistributionData" :options="pieOptions" class="h-20rem" />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Performans Tablosu -->
        <div class="col-12">
            <div class="card">
                <!-- Header Section -->
                <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                    <h5 class="m-0">Değerlendirmeler</h5>
                </div>
                
                <!-- Filter Section -->
                <div class="flex flex-column md:flex-row justify-content-between mt-3">
                    <div class="mb-3 md:mb-0">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="globalFilterValue" placeholder="Ara..." @input="onGlobalFilterChange" />
                        </span>
                    </div>
                    <div class="flex align-items-center flex-column sm:flex-row">
                        <div class="field mr-3 mb-2 sm:mb-0">
                            <span class="mr-2">Durum:</span>
                            <Dropdown v-model="selectedStatus" :options="performanceStatuses" optionLabel="name" 
                                placeholder="Durum Seç" class="w-full md:w-10rem" @change="onStatusChange" />
                        </div>
                        <div class="field">
                            <span class="mr-2">Departman:</span>
                            <Dropdown v-model="selectedDepartment" :options="departments" 
                                placeholder="Departman Seç" class="w-full md:w-14rem" @change="onDepartmentChange" />
                        </div>
                    </div>
                </div>
                
                <!-- Performance DataTable -->
                <DataTable :value="performanceData" v-model:selection="selectedPerformances" :paginator="true" :rows="10"
                    dataKey="id" :rowHover="true" :filters="filters" :loading="loading"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]" 
                    currentPageReportTemplate="Toplam {totalRecords} değerlendirme içinden {first} - {last} arası gösteriliyor"
                    responsiveLayout="scroll" class="mt-3">
                    
                    <Column field="employeeName" header="Çalışan" sortable style="min-width: 12rem">
                        <template #body="slotProps">
                            <div>
                                <span class="font-bold">{{ slotProps.data.employeeName }}</span>
                                <div class="text-xs mt-1">{{ slotProps.data.position }}</div>
                            </div>
                        </template>
                    </Column>
                    
                    <Column field="department" header="Departman" sortable style="min-width: 10rem"></Column>
                    
                    <Column field="period" header="Dönem" sortable style="min-width: 8rem"></Column>
                    
                    <Column field="status" header="Durum" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getStatusSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    
                    <Column field="overallScore" header="Genel Puan" sortable style="min-width: 8rem">
                        <template #body="slotProps">
                            <Rating v-if="slotProps.data.overallScore" :modelValue="slotProps.data.overallScore" 
                                :readonly="true" :cancel="false" :stars="5" />
                            <Tag v-else value="Değerlendirilmedi" severity="secondary" />
                        </template>
                    </Column>
                    
                    <Column field="managerName" header="Yönetici" sortable style="min-width: 10rem"></Column>
                    
                    <Column field="completionDate" header="Tamamlanma Tarihi" sortable style="min-width: 10rem">
                        <template #body="slotProps">
                            <span v-if="slotProps.data.completionDate">{{ slotProps.data.completionDate }}</span>
                            <Tag v-else value="Tamamlanmadı" severity="secondary" />
                        </template>
                    </Column>
                    
                    <Column style="min-width: 10rem">
                        <template #body="slotProps">
                            <div class="flex">
                                <Button icon="pi pi-eye" class="p-button-rounded p-button-info mr-2" 
                                    @click="viewEmployeePerformance(slotProps.data)" />
                                <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" 
                                    @click="editPerformance(slotProps.data)" />
                                <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" 
                                    @click="confirmDeletePerformance(slotProps.data)" />
                            </div>
                        </template>
                    </Column>
                </DataTable>
                
                <!-- Employee Performance Detail Dialog -->
                <Dialog v-model:visible="employeePerformanceDialog" :style="{width: '80%'}" header="Çalışan Performans Detayı" 
                    :modal="true" class="p-fluid" :maximizable="true">
                    <div v-if="employeePerformance.id">
                        <TabView>
                            <!-- Genel Bakış -->
                            <TabPanel header="Genel Bilgiler">
                                <div class="grid">
                                    <div class="col-12 md:col-6">
                                        <div class="card">
                                            <h6>Çalışan Bilgileri</h6>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Çalışan:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.employeeName }}</div>
                                            </div>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Pozisyon:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.position }}</div>
                                            </div>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Departman:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.department }}</div>
                                            </div>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Yönetici:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.managerName }}</div>
                                            </div>
                                        </div>
                                        
                                        <div class="card mt-3">
                                            <h6>Değerlendirme Bilgileri</h6>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Dönem:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.period }}</div>
                                            </div>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Durum:</label>
                                                <div class="col-12 md:col-8">
                                                    <Tag :value="employeePerformance.status" 
                                                        :severity="getStatusSeverity(employeePerformance.status)" />
                                                </div>
                                            </div>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Başlangıç Tarihi:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.submissionDate || '-' }}</div>
                                            </div>
                                            <div class="field grid">
                                                <label class="col-12 md:col-4 font-bold">Tamamlanma Tarihi:</label>
                                                <div class="col-12 md:col-8">{{ employeePerformance.completionDate || '-' }}</div>
                                            </div>
                                            <div class="field grid" v-if="employeePerformance.overallScore">
                                                <label class="col-12 md:col-4 font-bold">Genel Puan:</label>
                                                <div class="col-12 md:col-8 flex align-items-center">
                                                    <Rating :modelValue="employeePerformance.overallScore" 
                                                        :readonly="true" :cancel="false" />
                                                    <span class="ml-2">({{ employeePerformance.overallScore }})</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-12 md:col-6">
                                        <div class="card h-full flex flex-column">
                                            <h6>Yetkinlik Değerlendirmesi</h6>
                                            <div class="flex-grow-1 flex align-items-center justify-content-center">
                                                <Chart v-if="employeeRadarData" type="radar" :data="employeeRadarData" 
                                                    :options="radarOptions" class="h-20rem w-full" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="col-12">
                                        <div class="card">
                                            <h6>Değerlendirme Notları</h6>
                                            <div class="grid">
                                                <div class="col-12 md:col-6">
                                                    <div class="field">
                                                        <label class="font-bold mb-2">Güçlü Yönler</label>
                                                        <div class="p-3 surface-100 border-round">
                                                            {{ employeePerformance.strengths || 'Henüz değerlendirilmedi' }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12 md:col-6">
                                                    <div class="field">
                                                        <label class="font-bold mb-2">Gelişim Alanları</label>
                                                        <div class="p-3 surface-100 border-round">
                                                            {{ employeePerformance.improvements || 'Henüz değerlendirilmedi' }}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                            
                            <!-- Yetkinlik Detayları -->
                            <TabPanel header="Yetkinlik Detayları">
                                <div class="card">
                                    <DataTable :value="competencies" responsiveLayout="scroll">
                                        <Column field="name" header="Yetkinlik" style="min-width: 12rem"></Column>
                                        <Column header="Puan" style="min-width: 10rem">
                                            <template #body="slotProps">
                                                <div class="flex align-items-center">
                                                    <Rating :modelValue="employeePerformance.competencyScores[slotProps.data.code]" 
                                                        :readonly="true" :cancel="false" />
                                                    <span class="ml-2">
                                                        ({{ formatScore(employeePerformance.competencyScores[slotProps.data.code]) }})
                                                    </span>
                                                </div>
                                            </template>
                                        </Column>
                                    </DataTable>
                                </div>
                            </TabPanel>
                            
                            <!-- Hedefler -->
                            <TabPanel header="Hedefler & Gelişim Planı">
                                <div class="card">
                                    <h6>Performans Hedefleri</h6>
                                    <DataTable :value="employeePerformance.goals" responsiveLayout="scroll" class="mt-3">
                                        <Column field="description" header="Hedef Tanımı" style="min-width: 20rem"></Column>
                                        <Column field="status" header="Durum" style="min-width: 10rem">
                                            <template #body="slotProps">
                                                <Tag :icon="getGoalStatusIcon(slotProps.data.status)"
                                                    :value="goalStatuses.find(g => g.code === slotProps.data.status)?.name"
                                                    :severity="getGoalStatusSeverity(slotProps.data.status)" />
                                            </template>
                                        </Column>
                                        <Column field="dueDate" header="Bitiş Tarihi" style="min-width: 10rem"></Column>
                                    </DataTable>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                    <template #footer>
                        <Button label="Kapat" icon="pi pi-times" class="p-button-text" @click="hideEmployeeDialog" />
                    </template>
                </Dialog>
                
                <!-- Performance Dialog for Edit/Create -->
                <Dialog v-model:visible="performanceDialog" :style="{width: '600px'}" header="Performans Değerlendirmesi" 
                    :modal="true" class="p-fluid">
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="employeeName">Çalışan Adı</label>
                            <InputText id="employeeName" v-model="performance.employeeName" required autofocus 
                                :class="{'p-invalid': submitted && !performance.employeeName}" />
                            <small class="p-error" v-if="submitted && !performance.employeeName">Çalışan adı gerekli.</small>
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="department">Departman</label>
                            <InputText id="department" v-model="performance.department" />
                        </div>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="position">Pozisyon</label>
                            <InputText id="position" v-model="performance.position" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="managerName">Yönetici</label>
                            <InputText id="managerName" v-model="performance.managerName" />
                        </div>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="period">Dönem</label>
                            <Dropdown id="period" v-model="performance.period" :options="evaluationPeriods.map(e => e.name)" 
                                placeholder="Dönem Seç" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="status">Durum</label>
                            <Dropdown id="status" v-model="performance.status" :options="performanceStatuses.map(s => s.name)" 
                                placeholder="Durum Seç" />
                        </div>
                    </div>
                    
                    <div class="formgrid grid">
                        <div class="field col-12 md:col-6">
                            <label for="submissionDate">Başlangıç Tarihi</label>
                            <InputText id="submissionDate" v-model="performance.submissionDate" type="date" />
                        </div>
                        <div class="field col-12 md:col-6">
                            <label for="completionDate">Tamamlanma Tarihi</label>
                            <InputText id="completionDate" v-model="performance.completionDate" type="date" />
                        </div>
                    </div>
                    
                    <div class="field">
                        <label for="overallScore">Genel Puan</label>
                        <Rating id="overallScore" v-model="performance.overallScore" :cancel="false" />
                    </div>
                    
                    <h6>Yetkinlik Değerlendirmesi</h6>
                    <div class="formgrid grid">
                        <div v-for="comp in competencies" :key="comp.code" class="field col-12 md:col-6">
                            <label :for="comp.code">{{ comp.name }}</label>
                            <Rating :id="comp.code" v-model="performance.competencyScores[comp.code]" :cancel="false" />
                        </div>
                    </div>
                    
                    <div class="field">
                        <label for="strengths">Güçlü Yönler</label>
                        <Textarea id="strengths" v-model="performance.strengths" rows="3" />
                    </div>
                    
                    <div class="field">
                        <label for="improvements">Gelişim Alanları</label>
                        <Textarea id="improvements" v-model="performance.improvements" rows="3" />
                    </div>
                    
                    <template #footer>
                        <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Kaydet" icon="pi pi-check" class="p-button-success" @click="savePerformance" />
                    </template>
                </Dialog>

                <!-- Delete Performance Confirmation -->
                <Dialog v-model:visible="deletePerformanceDialog" :style="{width: '450px'}" header="Onay" :modal="true">
                    <div class="confirmation-content">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="performance">Bu performans kaydını silmek istediğinize emin misiniz? <b>{{ performance.employeeName }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="Hayır" icon="pi pi-times" class="p-button-text" @click="deletePerformanceDialog = false" />
                        <Button label="Evet" icon="pi pi-check" class="p-button-danger" @click="deletePerformance" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped>
.p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
    color: #FFA726;
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