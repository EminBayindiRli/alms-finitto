<script setup>
import { ref, onMounted, reactive } from 'vue';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import InputSwitch from 'primevue/inputswitch';
import Textarea from 'primevue/textarea';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import FileUpload from 'primevue/fileupload';
import ColorPicker from 'primevue/colorpicker';
import InputNumber from 'primevue/inputnumber';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from 'primevue/useconfirm';
import Divider from 'primevue/divider';
import Tag from 'primevue/tag';

const toast = useToast();
const confirm = useConfirm();

// Kullanıcı Yönetimi
const users = ref([
    { 
        id: 1, 
        name: 'Ahmet Yılmaz', 
        email: 'ahmet.yilmaz@sirket.com', 
        role: 'admin', 
        department: 'Yazılım Geliştirme', 
        status: 'active',
        lastLogin: '2025-03-04 09:15:30',
        createdAt: '2024-05-15'
    },
    { 
        id: 2, 
        name: 'Ayşe Demir', 
        email: 'ayse.demir@sirket.com', 
        role: 'manager', 
        department: 'Pazarlama', 
        status: 'active',
        lastLogin: '2025-03-03 17:22:10',
        createdAt: '2024-06-20'
    },
    { 
        id: 3, 
        name: 'Mehmet Kaya', 
        email: 'mehmet.kaya@sirket.com', 
        role: 'employee', 
        department: 'Finans', 
        status: 'active',
        lastLogin: '2025-03-04 10:05:45',
        createdAt: '2024-08-10'
    },
    { 
        id: 4, 
        name: 'Zeynep Şahin', 
        email: 'zeynep.sahin@sirket.com', 
        role: 'manager', 
        department: 'İnsan Kaynakları', 
        status: 'inactive',
        lastLogin: '2025-02-28 14:30:20',
        createdAt: '2024-07-05'
    },
    { 
        id: 5, 
        name: 'Ali Öztürk', 
        email: 'ali.ozturk@sirket.com', 
        role: 'employee', 
        department: 'Satış', 
        status: 'active',
        lastLogin: '2025-03-02 11:45:15',
        createdAt: '2024-09-18'
    }
]);

// Departmanlar
const departments = ref([
    { 
        id: 1, 
        name: 'Yazılım Geliştirme', 
        manager: 'Ahmet Yılmaz', 
        employeeCount: 15, 
        createdAt: '2024-01-10',
        isActive: true
    },
    { 
        id: 2, 
        name: 'Pazarlama', 
        manager: 'Ayşe Demir', 
        employeeCount: 10, 
        createdAt: '2024-01-15',
        isActive: true
    },
    { 
        id: 3, 
        name: 'Finans', 
        manager: 'Fatma Yıldız', 
        employeeCount: 8, 
        createdAt: '2024-02-05',
        isActive: true
    },
    { 
        id: 4, 
        name: 'İnsan Kaynakları', 
        manager: 'Zeynep Şahin', 
        employeeCount: 6, 
        createdAt: '2024-02-12',
        isActive: true
    },
    { 
        id: 5, 
        name: 'Satış', 
        manager: 'Mustafa Yılmaz', 
        employeeCount: 12, 
        createdAt: '2024-03-01',
        isActive: true
    },
    { 
        id: 6, 
        name: 'Müşteri İlişkileri', 
        manager: 'Elif Kara', 
        employeeCount: 8, 
        createdAt: '2024-04-10',
        isActive: false
    }
]);

// Eğitim Kategorileri
const trainingCategories = ref([
    { 
        id: 1, 
        name: 'Teknik Eğitimler', 
        description: 'Yazılım, donanım, ağ ve diğer teknik konuları içeren eğitimler',
        courseCount: 25,
        isActive: true
    },
    { 
        id: 2, 
        name: 'Yönetimsel Eğitimler', 
        description: 'Liderlik, takım yönetimi, proje yönetimi gibi konuları içeren eğitimler',
        courseCount: 18,
        isActive: true
    },
    { 
        id: 3, 
        name: 'İletişim Becerileri', 
        description: 'Etkili iletişim, sunum becerileri, müzakere teknikleri gibi konuları içeren eğitimler',
        courseCount: 12,
        isActive: true
    },
    { 
        id: 4, 
        name: 'Müşteri İlişkileri', 
        description: 'Müşteri hizmetleri, satış teknikleri, müşteri deneyimi gibi konuları içeren eğitimler',
        courseCount: 14,
        isActive: true
    },
    { 
        id: 5, 
        name: 'Kişisel Gelişim', 
        description: 'Zaman yönetimi, stres yönetimi, kariyer gelişimi gibi konuları içeren eğitimler',
        courseCount: 20,
        isActive: true
    }
]);

// Roller
const roles = ref([
    { name: 'Yönetici', code: 'admin' },
    { name: 'Departman Yöneticisi', code: 'manager' },
    { name: 'Çalışan', code: 'employee' }
]);

// Durum seçenekleri
const statusOptions = ref([
    { name: 'Aktif', code: 'active' },
    { name: 'Devre Dışı', code: 'inactive' }
]);

// Dialog state
const userDialog = ref(false);
const departmentDialog = ref(false);
const categoryDialog = ref(false);
const deleteUserDialog = ref(false);
const deleteDepartmentDialog = ref(false);
const deleteCategoryDialog = ref(false);

// Edit states
const user = ref({
    id: null,
    name: '',
    email: '',
    role: null,
    department: '',
    status: 'active'
});

const department = ref({
    id: null,
    name: '',
    manager: '',
    isActive: true
});

const category = ref({
    id: null,
    name: '',
    description: '',
    isActive: true
});

// Sistem Ayarları
const systemSettings = reactive({
    companyName: 'ALMS Şirketi',
    companyLogo: null,
    systemEmail: 'admin@alms.com',
    defaultLanguage: 'tr',
    primaryColor: '#0078d4',
    secondaryColor: '#005a9e',
    maxUploadSize: 10,
    sessionTimeoutMinutes: 30,
    enableNotifications: true,
    enableEmails: true,
    enableSMS: false,
    enableAuditLogs: true,
    maintenanceMode: false,
    allowRegistration: false,
    allowPasswordReset: true,
    twoFactorAuth: false,
    privacyPolicy: 'Gizlilik politikası metni buraya gelecek...',
    termsOfService: 'Hizmet şartları metni buraya gelecek...'
});

// Diller
const languages = ref([
    { name: 'Türkçe', code: 'tr' },
    { name: 'İngilizce', code: 'en' },
    { name: 'Almanca', code: 'de' },
    { name: 'Fransızca', code: 'fr' },
    { name: 'İspanyolca', code: 'es' }
]);

// Yedekleme Ayarları
const backupSettings = reactive({
    automaticBackups: true,
    backupFrequency: 'daily',
    backupTime: '03:00',
    backupRetentionDays: 30,
    backupLocation: 'cloud',
    cloudProvider: 'aws',
    lastBackupStatus: 'success',
    lastBackupDate: '2025-03-03 03:00:00'
});

// E-posta Ayarları
const emailSettings = reactive({
    smtpServer: 'smtp.sirket.com',
    smtpPort: 587,
    smtpUsername: 'notifications@sirket.com',
    smtpPassword: '********',
    useSSL: true,
    fromEmail: 'alms-noreply@sirket.com',
    fromName: 'ALMS Öğrenme Yönetim Sistemi',
    testEmail: ''
});

// Bildirim Şablonları
const notificationTemplates = ref([
    { 
        id: 1, 
        name: 'Eğitim Atama Bildirimi', 
        subject: 'Yeni Eğitim Ataması',
        template: 'Değerli {{name}}, {{trainingName}} eğitimi size atanmıştır. Son tamamlama tarihi: {{dueDate}}.',
        type: 'email'
    },
    { 
        id: 2, 
        name: 'Eğitim Hatırlatma', 
        subject: 'Eğitim Tamamlama Hatırlatması',
        template: 'Sayın {{name}}, {{trainingName}} eğitimini tamamlamak için son {{daysLeft}} gününüz kaldı.',
        type: 'email'
    },
    { 
        id: 3, 
        name: 'Performans Değerlendirme Bildirimi', 
        subject: 'Yeni Performans Değerlendirmesi',
        template: 'Değerli {{name}}, {{evaluationPeriod}} dönemi performans değerlendirmeniz başlamıştır.',
        type: 'email'
    },
    { 
        id: 4, 
        name: 'Sertifika Kazanımı', 
        subject: 'Tebrikler! Yeni Sertifika Kazandınız',
        template: 'Tebrikler {{name}}! {{certificateName}} sertifikasını başarıyla kazandınız.',
        type: 'email'
    }
]);

// Audit Log Kayıtları
const auditLogs = ref([
    { 
        id: 1, 
        user: 'Ahmet Yılmaz', 
        action: 'Kullanıcı Oluşturma',
        details: 'Zeynep Şahin adlı kullanıcı oluşturuldu',
        ip: '192.168.1.105',
        timestamp: '2025-03-04 09:25:10'
    },
    { 
        id: 2, 
        user: 'Sistem', 
        action: 'Otomatik Yedekleme',
        details: 'Günlük veritabanı yedeklemesi başarıyla tamamlandı',
        ip: 'Sistem',
        timestamp: '2025-03-04 03:00:00'
    },
    { 
        id: 3, 
        user: 'Ayşe Demir', 
        action: 'Eğitim Oluşturma',
        details: 'Proje Yönetimi Temelleri adlı eğitim oluşturuldu',
        ip: '192.168.1.120',
        timestamp: '2025-03-03 14:15:30'
    },
    { 
        id: 4, 
        user: 'Ahmet Yılmaz', 
        action: 'Departman Güncelleme',
        details: 'Yazılım Geliştirme departmanı güncellendi',
        ip: '192.168.1.105',
        timestamp: '2025-03-03 11:30:45'
    },
    { 
        id: 5, 
        user: 'Ali Öztürk', 
        action: 'Giriş Yapıldı',
        details: 'Kullanıcı başarıyla giriş yaptı',
        ip: '192.168.1.150',
        timestamp: '2025-03-02 08:45:20'
    }
]);

// Fonksiyonlar 
const openNewUser = () => {
    user.value = {
        id: null,
        name: '',
        email: '',
        role: null,
        department: '',
        status: 'active'
    };
    userDialog.value = true;
};

const openNewDepartment = () => {
    department.value = {
        id: null,
        name: '',
        manager: '',
        isActive: true
    };
    departmentDialog.value = true;
};

const openNewCategory = () => {
    category.value = {
        id: null,
        name: '',
        description: '',
        isActive: true
    };
    categoryDialog.value = true;
};

const editUser = (editUser) => {
    user.value = {...editUser};
    userDialog.value = true;
};

const editDepartment = (editDepartment) => {
    department.value = {...editDepartment};
    departmentDialog.value = true;
};

const editCategory = (editCategory) => {
    category.value = {...editCategory};
    categoryDialog.value = true;
};

const confirmDeleteUser = (editUser) => {
    user.value = editUser;
    deleteUserDialog.value = true;
};

const confirmDeleteDepartment = (editDepartment) => {
    department.value = editDepartment;
    deleteDepartmentDialog.value = true;
};

const confirmDeleteCategory = (editCategory) => {
    category.value = editCategory;
    deleteCategoryDialog.value = true;
};

const deleteUserConfirmed = () => {
    users.value = users.value.filter(u => u.id !== user.value.id);
    deleteUserDialog.value = false;
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı silindi', life: 3000 });
};

const deleteDepartmentConfirmed = () => {
    departments.value = departments.value.filter(d => d.id !== department.value.id);
    deleteDepartmentDialog.value = false;
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Departman silindi', life: 3000 });
};

const deleteCategoryConfirmed = () => {
    trainingCategories.value = trainingCategories.value.filter(c => c.id !== category.value.id);
    deleteCategoryDialog.value = false;
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori silindi', life: 3000 });
};

const saveUser = () => {
    if (user.value.id) {
        // Güncelleme
        const index = users.value.findIndex(u => u.id === user.value.id);
        users.value[index] = user.value;
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı güncellendi', life: 3000 });
    } else {
        // Yeni kullanıcı
        user.value.id = users.value.length + 1;
        user.value.createdAt = new Date().toISOString().split('T')[0];
        user.value.lastLogin = '-';
        users.value.push(user.value);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kullanıcı oluşturuldu', life: 3000 });
    }
    
    userDialog.value = false;
};

const saveDepartment = () => {
    if (department.value.id) {
        // Güncelleme
        const index = departments.value.findIndex(d => d.id === department.value.id);
        departments.value[index] = department.value;
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Departman güncellendi', life: 3000 });
    } else {
        // Yeni departman
        department.value.id = departments.value.length + 1;
        department.value.employeeCount = 0;
        department.value.createdAt = new Date().toISOString().split('T')[0];
        departments.value.push(department.value);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Departman oluşturuldu', life: 3000 });
    }
    
    departmentDialog.value = false;
};

const saveCategory = () => {
    if (category.value.id) {
        // Güncelleme
        const index = trainingCategories.value.findIndex(c => c.id === category.value.id);
        trainingCategories.value[index] = category.value;
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori güncellendi', life: 3000 });
    } else {
        // Yeni kategori
        category.value.id = trainingCategories.value.length + 1;
        category.value.courseCount = 0;
        trainingCategories.value.push(category.value);
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Kategori oluşturuldu', life: 3000 });
    }
    
    categoryDialog.value = false;
};

const saveSystemSettings = () => {
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Sistem ayarları kaydedildi', life: 3000 });
};

const saveEmailSettings = () => {
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'E-posta ayarları kaydedildi', life: 3000 });
};

const saveBackupSettings = () => {
    toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Yedekleme ayarları kaydedildi', life: 3000 });
};

const sendTestEmail = () => {
    if (!emailSettings.testEmail) {
        toast.add({ severity: 'error', summary: 'Hata', detail: 'Test e-posta adresi giriniz', life: 3000 });
        return;
    }
    
    toast.add({ severity: 'info', summary: 'Bilgi', detail: `Test e-postası ${emailSettings.testEmail} adresine gönderiliyor...`, life: 3000 });
    setTimeout(() => {
        toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Test e-postası başarıyla gönderildi', life: 3000 });
    }, 2000);
};

const createBackup = () => {
    confirm.require({
        message: 'Manuel yedekleme başlatmak istediğinize emin misiniz?',
        header: 'Yedekleme Onayı',
        icon: 'pi pi-info-circle',
        acceptClass: 'p-button-primary',
        accept: () => {
            toast.add({ severity: 'info', summary: 'Bilgi', detail: 'Yedekleme başlatılıyor...', life: 3000 });
            setTimeout(() => {
                backupSettings.lastBackupDate = new Date().toLocaleString();
                toast.add({ severity: 'success', summary: 'Başarılı', detail: 'Manuel yedekleme başarıyla tamamlandı', life: 3000 });
            }, 3000);
        }
    });
};

const toggleMaintenanceMode = () => {
    const newStatus = !systemSettings.maintenanceMode;
    const message = newStatus 
        ? 'Bakım modu etkinleştirilsin mi? Bu işlem tüm kullanıcıların sistemden çıkış yapmasına neden olacaktır.'
        : 'Bakım modunu devre dışı bırakmak istediğinize emin misiniz? Bu işlem kullanıcıların sisteme giriş yapabilmesini sağlayacaktır.';
    
    confirm.require({
        message: message,
        header: 'Bakım Modu',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: newStatus ? 'p-button-warning' : 'p-button-success',
        accept: () => {
            systemSettings.maintenanceMode = newStatus;
            toast.add({ 
                severity: newStatus ? 'warn' : 'success', 
                summary: newStatus ? 'Bakım Modu Etkin' : 'Bakım Modu Devre Dışı', 
                detail: newStatus ? 'Sistem bakım moduna alındı' : 'Sistem normal modda çalışıyor', 
                life: 3000 
            });
        }
    });
};

const getStatusSeverity = (status) => {
    return status === 'active' ? 'success' : 'danger';
};

const getStatusIcon = (status) => {
    return status === 'active' ? 'pi pi-check-circle' : 'pi pi-times-circle';
};

// Sayfa yüklendiğinde
onMounted(() => {
    console.log('Settings component mounted');
});
</script>

<template>
    <div class="grid">
        <Toast />
        <ConfirmDialog />
        
        <div class="col-12">
            <div class="card">
                <h5 class="m-0">Sistem Ayarları</h5>
            </div>
        </div>
        
        <div class="col-12">
            <TabView>
                <!-- Sistem Yapılandırması -->
                <TabPanel header="Sistem Yapılandırması">
                    <div class="grid">
                        <div class="col-12 lg:col-6">
                            <Card>
                                <template #title>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-cog mr-2"></i>
                                        <span>Genel Ayarlar</span>
                                    </div>
                                </template>
                                <template #content>
                                    <div class="field">
                                        <label for="companyName">Şirket Adı</label>
                                        <InputText id="companyName" v-model="systemSettings.companyName" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="companyLogo">Şirket Logosu</label>
                                        <FileUpload mode="basic" name="companyLogo" accept="image/*" maxFileSize="1000000" 
                                            chooseLabel="Logo Seç" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="systemEmail">Sistem E-posta Adresi</label>
                                        <InputText id="systemEmail" v-model="systemSettings.systemEmail" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="defaultLanguage">Varsayılan Dil</label>
                                        <Dropdown id="defaultLanguage" v-model="systemSettings.defaultLanguage" 
                                            :options="languages" optionLabel="name" optionValue="code" class="w-full" />
                                    </div>
                                    
                                    <div class="grid">
                                        <div class="col-6 field">
                                            <label for="primaryColor">Ana Renk</label>
                                            <div class="flex align-items-center">
                                                <ColorPicker v-model="systemSettings.primaryColor" />
                                                <span class="ml-2">{{ systemSettings.primaryColor }}</span>
                                            </div>
                                        </div>
                                        
                                        <div class="col-6 field">
                                            <label for="secondaryColor">İkincil Renk</label>
                                            <div class="flex align-items-center">
                                                <ColorPicker v-model="systemSettings.secondaryColor" />
                                                <span class="ml-2">{{ systemSettings.secondaryColor }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="field">
                                        <label for="maxUploadSize">Maksimum Dosya Yükleme Boyutu (MB)</label>
                                        <InputNumber id="maxUploadSize" v-model="systemSettings.maxUploadSize" min="1" max="100" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="sessionTimeout">Oturum Zaman Aşımı (Dakika)</label>
                                        <InputNumber id="sessionTimeout" v-model="systemSettings.sessionTimeoutMinutes" min="5" max="120" class="w-full" />
                                    </div>
                                </template>
                            </Card>
                        </div>
                        
                        <div class="col-12 lg:col-6">
                            <div class="grid">
                                <div class="col-12">
                                    <Card>
                                        <template #title>
                                            <div class="flex align-items-center">
                                                <i class="pi pi-bell mr-2"></i>
                                                <span>Bildirim Ayarları</span>
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="field-checkbox">
                                                <Checkbox id="enableNotifications" v-model="systemSettings.enableNotifications" :binary="true" />
                                                <label for="enableNotifications" class="ml-2">Uygulama İçi Bildirimleri Etkinleştir</label>
                                            </div>
                                            
                                            <div class="field-checkbox">
                                                <Checkbox id="enableEmails" v-model="systemSettings.enableEmails" :binary="true" />
                                                <label for="enableEmails" class="ml-2">E-posta Bildirimlerini Etkinleştir</label>
                                            </div>
                                            
                                            <div class="field-checkbox">
                                                <Checkbox id="enableSMS" v-model="systemSettings.enableSMS" :binary="true" />
                                                <label for="enableSMS" class="ml-2">SMS Bildirimlerini Etkinleştir</label>
                                            </div>
                                            
                                            <div class="field-checkbox">
                                                <Checkbox id="enableAuditLogs" v-model="systemSettings.enableAuditLogs" :binary="true" />
                                                <label for="enableAuditLogs" class="ml-2">Denetim Günlüklerini Etkinleştir</label>
                                            </div>
                                        </template>
                                    </Card>
                                </div>
                                
                                <div class="col-12">
                                    <Card>
                                        <template #title>
                                            <div class="flex align-items-center">
                                                <i class="pi pi-lock mr-2"></i>
                                                <span>Güvenlik Ayarları</span>
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="field-checkbox">
                                                <Checkbox id="allowRegistration" v-model="systemSettings.allowRegistration" :binary="true" />
                                                <label for="allowRegistration" class="ml-2">Kullanıcı Kaydına İzin Ver</label>
                                            </div>
                                            
                                            <div class="field-checkbox">
                                                <Checkbox id="allowPasswordReset" v-model="systemSettings.allowPasswordReset" :binary="true" />
                                                <label for="allowPasswordReset" class="ml-2">Şifre Sıfırlamaya İzin Ver</label>
                                            </div>
                                            
                                            <div class="field-checkbox">
                                                <Checkbox id="twoFactorAuth" v-model="systemSettings.twoFactorAuth" :binary="true" />
                                                <label for="twoFactorAuth" class="ml-2">İki Faktörlü Kimlik Doğrulamayı Etkinleştir</label>
                                            </div>
                                            
                                            <Divider />
                                            
                                            <div class="field mb-4">
                                                <div class="flex justify-content-between align-items-center">
                                                    <label for="maintenanceMode">Bakım Modu</label>
                                                    <InputSwitch v-model="systemSettings.maintenanceMode" @change="toggleMaintenanceMode" />
                                                </div>
                                                <small v-if="systemSettings.maintenanceMode" class="p-error block mt-2">
                                                    <i class="pi pi-exclamation-triangle mr-1"></i>
                                                    Bakım modu etkin, kullanıcılar sisteme erişemiyor!
                                                </small>
                                            </div>
                                        </template>
                                    </Card>
                                </div>
                                
                                <div class="col-12">
                                    <Card>
                                        <template #title>
                                            <div class="flex align-items-center">
                                                <i class="pi pi-file mr-2"></i>
                                                <span>Yasal Dokümanlar</span>
                                            </div>
                                        </template>
                                        <template #content>
                                            <div class="field">
                                                <label for="privacyPolicy">Gizlilik Politikası</label>
                                                <Textarea id="privacyPolicy" v-model="systemSettings.privacyPolicy" rows="5" class="w-full" />
                                            </div>
                                            
                                            <div class="field">
                                                <label for="termsOfService">Hizmet Şartları</label>
                                                <Textarea id="termsOfService" v-model="systemSettings.termsOfService" rows="5" class="w-full" />
                                            </div>
                                        </template>
                                    </Card>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-12 flex justify-content-end">
                            <Button label="Değişiklikleri Kaydet" icon="pi pi-save" @click="saveSystemSettings" />
                        </div>
                    </div>
                </TabPanel>
                
                <!-- Kullanıcı Yönetimi -->
                <TabPanel header="Kullanıcı Yönetimi">
                    <div class="card">
                        <div class="flex justify-content-between align-items-center mb-4">
                            <h5 class="m-0">Kullanıcılar</h5>
                            <Button label="Yeni Kullanıcı" icon="pi pi-plus" @click="openNewUser" />
                        </div>
                        
                        <DataTable :value="users" paginator :rows="10" dataKey="id" :rowHover="true" 
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            :rowsPerPageOptions="[5, 10, 25]" 
                            currentPageReportTemplate="Toplam {totalRecords} kullanıcı içinden {first}-{last} arası gösteriliyor"
                            responsiveLayout="scroll">
                            
                            <Column field="id" header="ID" style="width: 5%"></Column>
                            <Column field="name" header="Ad Soyad" sortable style="width: 20%"></Column>
                            <Column field="email" header="E-posta" sortable style="width: 20%"></Column>
                            <Column field="role" header="Rol" sortable style="width: 15%"></Column>
                            <Column field="department" header="Departman" sortable style="width: 15%"></Column>
                            
                            <Column field="status" header="Durum" style="width: 10%">
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.status === 'active' ? 'Aktif' : 'Devre Dışı'"
                                         :severity="getStatusSeverity(slotProps.data.status)" />
                                </template>
                            </Column>
                            
                            <Column header="Son Giriş" field="lastLogin" style="width: 15%"></Column>
                            
                            <Column style="width: 10%">
                                <template #header>
                                    <span>İşlemler</span>
                                </template>
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-text mr-2" 
                                        @click="editUser(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                                        @click="confirmDeleteUser(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    
                    <!-- Kullanıcı Diyalogları -->
                    <Dialog v-model:visible="userDialog" :style="{width: '450px'}" header="Kullanıcı Detayları" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="name">Ad Soyad</label>
                            <InputText id="name" v-model="user.name" required autofocus :class="{'p-invalid': !user.name}" />
                            <small class="p-error" v-if="!user.name">Ad Soyad gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <label for="email">E-posta</label>
                            <InputText id="email" v-model="user.email" required :class="{'p-invalid': !user.email}" />
                            <small class="p-error" v-if="!user.email">E-posta gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <label for="role">Rol</label>
                            <Dropdown id="role" v-model="user.role" :options="roles" optionLabel="name" optionValue="code" 
                                placeholder="Rol Seçin" required :class="{'p-invalid': !user.role}" />
                            <small class="p-error" v-if="!user.role">Rol gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <label for="department">Departman</label>
                            <Dropdown id="department" v-model="user.department" 
                                :options="departments.filter(d => d.isActive).map(d => d.name)" 
                                placeholder="Departman Seçin" required :class="{'p-invalid': !user.department}" />
                            <small class="p-error" v-if="!user.department">Departman gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <label for="status">Durum</label>
                            <Dropdown id="status" v-model="user.status" :options="statusOptions" optionLabel="name" optionValue="code" 
                                placeholder="Durum Seçin" required />
                        </div>
                        
                        <template #footer>
                            <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="userDialog = false" />
                            <Button label="Kaydet" icon="pi pi-check" class="p-button-text" @click="saveUser" />
                        </template>
                    </Dialog>
                    
                    <Dialog v-model:visible="deleteUserDialog" :style="{width: '450px'}" header="Onay" :modal="true">
                        <div class="confirmation-content">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="user">
                                <b>{{ user.name }}</b> adlı kullanıcıyı silmek istediğinize emin misiniz?
                            </span>
                        </div>
                        <template #footer>
                            <Button label="Hayır" icon="pi pi-times" class="p-button-text" @click="deleteUserDialog = false" />
                            <Button label="Evet" icon="pi pi-check" class="p-button-text" @click="deleteUserConfirmed" />
                        </template>
                    </Dialog>
                </TabPanel>
                
                <!-- Departman Yapılandırması -->
                <TabPanel header="Departman Yapılandırması">
                    <div class="card">
                        <div class="flex justify-content-between align-items-center mb-4">
                            <h5 class="m-0">Departmanlar</h5>
                            <Button label="Yeni Departman" icon="pi pi-plus" @click="openNewDepartment" />
                        </div>
                        
                        <DataTable :value="departments" paginator :rows="10" dataKey="id" :rowHover="true" 
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            :rowsPerPageOptions="[5, 10, 25]" 
                            currentPageReportTemplate="Toplam {totalRecords} departman içinden {first}-{last} arası gösteriliyor"
                            responsiveLayout="scroll">
                            
                            <Column field="id" header="ID" style="width: 5%"></Column>
                            <Column field="name" header="Departman Adı" sortable style="width: 25%"></Column>
                            <Column field="manager" header="Departman Yöneticisi" sortable style="width: 25%"></Column>
                            <Column field="employeeCount" header="Çalışan Sayısı" sortable style="width: 15%"></Column>
                            <Column field="createdAt" header="Oluşturulma Tarihi" sortable style="width: 15%"></Column>
                            
                            <Column field="isActive" header="Durum" style="width: 10%">
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.isActive ? 'Aktif' : 'Devre Dışı'"
                                         :severity="slotProps.data.isActive ? 'success' : 'danger'" />
                                </template>
                            </Column>
                            
                            <Column style="width: 10%">
                                <template #header>
                                    <span>İşlemler</span>
                                </template>
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-text mr-2" 
                                        @click="editDepartment(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                                        @click="confirmDeleteDepartment(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    
                    <!-- Departman Diyalogları -->
                    <Dialog v-model:visible="departmentDialog" :style="{width: '450px'}" header="Departman Detayları" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="departmentName">Departman Adı</label>
                            <InputText id="departmentName" v-model="department.name" required autofocus :class="{'p-invalid': !department.name}" />
                            <small class="p-error" v-if="!department.name">Departman adı gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <label for="departmentManager">Departman Yöneticisi</label>
                            <Dropdown id="departmentManager" v-model="department.manager" 
                                :options="users.filter(u => u.status === 'active').map(u => u.name)" 
                                placeholder="Yönetici Seçin" required :class="{'p-invalid': !department.manager}" />
                            <small class="p-error" v-if="!department.manager">Departman yöneticisi gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <div class="flex align-items-center justify-content-between">
                                <label for="departmentActive">Aktif</label>
                                <InputSwitch id="departmentActive" v-model="department.isActive" />
                            </div>
                        </div>
                        
                        <template #footer>
                            <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="departmentDialog = false" />
                            <Button label="Kaydet" icon="pi pi-check" class="p-button-text" @click="saveDepartment" />
                        </template>
                    </Dialog>
                    
                    <Dialog v-model:visible="deleteDepartmentDialog" :style="{width: '450px'}" header="Onay" :modal="true">
                        <div class="confirmation-content">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="department">
                                <b>{{ department.name }}</b> departmanını silmek istediğinize emin misiniz?
                            </span>
                        </div>
                        <template #footer>
                            <Button label="Hayır" icon="pi pi-times" class="p-button-text" @click="deleteDepartmentDialog = false" />
                            <Button label="Evet" icon="pi pi-check" class="p-button-text" @click="deleteDepartmentConfirmed" />
                        </template>
                    </Dialog>
                </TabPanel>
                
                <!-- Eğitim Kategorileri Yapılandırması -->
                <TabPanel header="Eğitim Kategorileri">
                    <div class="card">
                        <div class="flex justify-content-between align-items-center mb-4">
                            <h5 class="m-0">Eğitim Kategorileri</h5>
                            <Button label="Yeni Kategori" icon="pi pi-plus" @click="openNewCategory" />
                        </div>
                        
                        <DataTable :value="trainingCategories" paginator :rows="10" dataKey="id" :rowHover="true" 
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            :rowsPerPageOptions="[5, 10, 25]" 
                            currentPageReportTemplate="Toplam {totalRecords} kategori içinden {first}-{last} arası gösteriliyor"
                            responsiveLayout="scroll">
                            
                            <Column field="id" header="ID" style="width: 5%"></Column>
                            <Column field="name" header="Kategori Adı" sortable style="width: 20%"></Column>
                            <Column field="description" header="Açıklama" style="width: 40%"></Column>
                            <Column field="courseCount" header="Eğitim Sayısı" sortable style="width: 15%"></Column>
                            
                            <Column field="isActive" header="Durum" style="width: 10%">
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.isActive ? 'Aktif' : 'Devre Dışı'"
                                         :severity="slotProps.data.isActive ? 'success' : 'danger'" />
                                </template>
                            </Column>
                            
                            <Column style="width: 10%">
                                <template #header>
                                    <span>İşlemler</span>
                                </template>
                                <template #body="slotProps">
                                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-button-text mr-2" 
                                        @click="editCategory(slotProps.data)" />
                                    <Button icon="pi pi-trash" class="p-button-rounded p-button-danger p-button-text" 
                                        @click="confirmDeleteCategory(slotProps.data)" />
                                </template>
                            </Column>
                        </DataTable>
                    </div>
                    
                    <!-- Kategori Diyalogları -->
                    <Dialog v-model:visible="categoryDialog" :style="{width: '450px'}" header="Kategori Detayları" :modal="true" class="p-fluid">
                        <div class="field">
                            <label for="categoryName">Kategori Adı</label>
                            <InputText id="categoryName" v-model="category.name" required autofocus :class="{'p-invalid': !category.name}" />
                            <small class="p-error" v-if="!category.name">Kategori adı gerekli.</small>
                        </div>
                        
                        <div class="field">
                            <label for="categoryDescription">Açıklama</label>
                            <Textarea id="categoryDescription" v-model="category.description" rows="5" />
                        </div>
                        
                        <div class="field">
                            <div class="flex align-items-center justify-content-between">
                                <label for="categoryActive">Aktif</label>
                                <InputSwitch id="categoryActive" v-model="category.isActive" />
                            </div>
                        </div>
                        
                        <template #footer>
                            <Button label="İptal" icon="pi pi-times" class="p-button-text" @click="categoryDialog = false" />
                            <Button label="Kaydet" icon="pi pi-check" class="p-button-text" @click="saveCategory" />
                        </template>
                    </Dialog>
                    
                    <Dialog v-model:visible="deleteCategoryDialog" :style="{width: '450px'}" header="Onay" :modal="true">
                        <div class="confirmation-content">
                            <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                            <span v-if="category">
                                <b>{{ category.name }}</b> kategorisini silmek istediğinize emin misiniz?
                            </span>
                        </div>
                        <template #footer>
                            <Button label="Hayır" icon="pi pi-times" class="p-button-text" @click="deleteCategoryDialog = false" />
                            <Button label="Evet" icon="pi pi-check" class="p-button-text" @click="deleteCategoryConfirmed" />
                        </template>
                    </Dialog>
                </TabPanel>
                
                <!-- Gelişmiş Ayarlar -->
                <TabPanel header="Gelişmiş Ayarlar">
                    <div class="grid">
                        <!-- E-posta Ayarları -->
                        <div class="col-12 lg:col-6">
                            <Card>
                                <template #title>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-envelope mr-2"></i>
                                        <span>E-posta Ayarları</span>
                                    </div>
                                </template>
                                <template #content>
                                    <div class="field">
                                        <label for="smtpServer">SMTP Sunucu</label>
                                        <InputText id="smtpServer" v-model="emailSettings.smtpServer" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="smtpPort">SMTP Port</label>
                                        <InputNumber id="smtpPort" v-model="emailSettings.smtpPort" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="smtpUsername">SMTP Kullanıcı Adı</label>
                                        <InputText id="smtpUsername" v-model="emailSettings.smtpUsername" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="smtpPassword">SMTP Şifresi</label>
                                        <InputText id="smtpPassword" v-model="emailSettings.smtpPassword" type="password" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <div class="flex align-items-center">
                                            <Checkbox id="useSSL" v-model="emailSettings.useSSL" :binary="true" />
                                            <label for="useSSL" class="ml-2">SSL Kullan</label>
                                        </div>
                                    </div>
                                    
                                    <div class="field">
                                        <label for="fromEmail">Gönderen E-posta</label>
                                        <InputText id="fromEmail" v-model="emailSettings.fromEmail" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="fromName">Gönderen Adı</label>
                                        <InputText id="fromName" v-model="emailSettings.fromName" class="w-full" />
                                    </div>
                                    
                                    <Divider />
                                    
                                    <div class="field">
                                        <label for="testEmail">Test E-postası Gönder</label>
                                        <div class="p-inputgroup">
                                            <InputText id="testEmail" v-model="emailSettings.testEmail" placeholder="E-posta Adresi" />
                                            <Button label="Gönder" icon="pi pi-send" @click="sendTestEmail" />
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-content-end">
                                        <Button label="Ayarları Kaydet" icon="pi pi-save" @click="saveEmailSettings" />
                                    </div>
                                </template>
                            </Card>
                        </div>
                        
                        <!-- Yedekleme Ayarları -->
                        <div class="col-12 lg:col-6">
                            <Card>
                                <template #title>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-database mr-2"></i>
                                        <span>Yedekleme Ayarları</span>
                                    </div>
                                </template>
                                <template #content>
                                    <div class="field">
                                        <div class="flex align-items-center">
                                            <Checkbox id="automaticBackups" v-model="backupSettings.automaticBackups" :binary="true" />
                                            <label for="automaticBackups" class="ml-2">Otomatik Yedekleme</label>
                                        </div>
                                    </div>
                                    
                                    <div class="field">
                                        <label for="backupFrequency">Yedekleme Sıklığı</label>
                                        <Dropdown id="backupFrequency" v-model="backupSettings.backupFrequency" class="w-full"
                                            :options="[
                                                { name: 'Günlük', code: 'daily' },
                                                { name: 'Haftalık', code: 'weekly' },
                                                { name: 'Aylık', code: 'monthly' }
                                            ]" optionLabel="name" optionValue="code" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="backupTime">Yedekleme Saati</label>
                                        <InputText id="backupTime" v-model="backupSettings.backupTime" type="time" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="backupRetentionDays">Saklama Süresi (Gün)</label>
                                        <InputNumber id="backupRetentionDays" v-model="backupSettings.backupRetentionDays" min="1" class="w-full" />
                                    </div>
                                    
                                    <div class="field">
                                        <label for="backupLocation">Yedekleme Lokasyonu</label>
                                        <Dropdown id="backupLocation" v-model="backupSettings.backupLocation" class="w-full"
                                            :options="[
                                                { name: 'Yerel Sunucu', code: 'local' },
                                                { name: 'Bulut Depolama', code: 'cloud' }
                                            ]" optionLabel="name" optionValue="code" />
                                    </div>
                                    
                                    <div class="field" v-if="backupSettings.backupLocation === 'cloud'">
                                        <label for="cloudProvider">Bulut Sağlayıcı</label>
                                        <Dropdown id="cloudProvider" v-model="backupSettings.cloudProvider" class="w-full"
                                            :options="[
                                                { name: 'Amazon S3', code: 'aws' },
                                                { name: 'Google Cloud Storage', code: 'gcp' },
                                                { name: 'Microsoft Azure Blob', code: 'azure' }
                                            ]" optionLabel="name" optionValue="code" />
                                    </div>
                                    
                                    <div class="field">
                                        <label>Son Yedekleme Durumu</label>
                                        <div class="flex align-items-center gap-2">
                                            <Tag :value="backupSettings.lastBackupStatus === 'success' ? 'Başarılı' : 'Başarısız'"
                                                 :severity="backupSettings.lastBackupStatus === 'success' ? 'success' : 'danger'" />
                                            <span>{{ backupSettings.lastBackupDate }}</span>
                                        </div>
                                    </div>
                                    
                                    <div class="flex justify-content-between mt-4">
                                        <Button label="Manuel Yedekle" icon="pi pi-sync" class="p-button-success" @click="createBackup" />
                                        <Button label="Ayarları Kaydet" icon="pi pi-save" @click="saveBackupSettings" />
                                    </div>
                                </template>
                            </Card>
                        </div>
                        
                        <!-- Denetim Günlükleri -->
                        <div class="col-12">
                            <Card>
                                <template #title>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-history mr-2"></i>
                                        <span>Denetim Günlükleri</span>
                                    </div>
                                </template>
                                <template #content>
                                    <DataTable :value="auditLogs" paginator :rows="10" dataKey="id" :rowHover="true"
                                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                        :rowsPerPageOptions="[5, 10, 25]" 
                                        currentPageReportTemplate="Toplam {totalRecords} kayıt içinden {first}-{last} arası gösteriliyor"
                                        responsiveLayout="scroll">
                                        
                                        <Column field="timestamp" header="Tarih" sortable></Column>
                                        <Column field="user" header="Kullanıcı" sortable></Column>
                                        <Column field="action" header="İşlem" sortable></Column>
                                        <Column field="details" header="Detaylar"></Column>
                                        <Column field="ip" header="IP Adresi"></Column>
                                    </DataTable>
                                </template>
                            </Card>
                        </div>
                    </div>
                </TabPanel>
            </TabView>
        </div>
    </div>
</template>

<style scoped>
.p-inputtext {
    padding: 0.5rem;
}

.p-button {
    padding: 0.5rem 1rem;
}

.confirmation-content {
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>