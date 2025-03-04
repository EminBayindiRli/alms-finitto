<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <h5>Profil Sayfası</h5>
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <!-- Profil Kartı -->
                        <Card>
                            <template #header>
                                <div class="flex flex-column align-items-center">
                                    <div class="mb-3">
                                        <Avatar icon="pi pi-user" size="xlarge" class="p-overlay-badge" shape="circle" style="width: 120px; height: 120px; background-color: #0078d4; color: #ffffff;">
                                            <Badge value="3" severity="danger" />
                                        </Avatar>
                                    </div>
                                    <h4 class="mb-1">Ahmet Yılmaz</h4>
                                    <span class="text-500">Eğitim Koordinatörü</span>
                                </div>
                            </template>
                            <template #content>
                                <div class="flex flex-column">
                                    <div class="flex align-items-center mb-3">
                                        <i class="pi pi-building mr-2"></i>
                                        <span class="font-semibold">Departman:</span>
                                        <span class="ml-2">İnsan Kaynakları</span>
                                    </div>
                                    <div class="flex align-items-center mb-3">
                                        <i class="pi pi-envelope mr-2"></i>
                                        <span class="font-semibold">E-posta:</span>
                                        <span class="ml-2">ahmet.yilmaz@example.com</span>
                                    </div>
                                    <div class="flex align-items-center mb-3">
                                        <i class="pi pi-phone mr-2"></i>
                                        <span class="font-semibold">Telefon:</span>
                                        <span class="ml-2">+90 555 123 4567</span>
                                    </div>
                                    <div class="flex align-items-center mb-3">
                                        <i class="pi pi-calendar mr-2"></i>
                                        <span class="font-semibold">Katılım Tarihi:</span>
                                        <span class="ml-2">01.05.2024</span>
                                    </div>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-id-card mr-2"></i>
                                        <span class="font-semibold">Çalışan ID:</span>
                                        <span class="ml-2">EMP-2345</span>
                                    </div>
                                </div>
                            </template>
                            <template #footer>
                                <div class="flex flex-wrap justify-content-center gap-2">
                                    <Button label="Profil Düzenle" icon="pi pi-pencil" />
                                    <Button label="Şifre Değiştir" icon="pi pi-key" severity="secondary" />
                                </div>
                            </template>
                        </Card>
                    </div>
                    
                    <div class="col-12 md:col-8">
                        <TabView>
                            <!-- Kişisel Bilgiler -->
                            <TabPanel header="Kişisel Bilgiler">
                                <div class="p-fluid">
                                    <div class="field">
                                        <label for="firstname">Ad</label>
                                        <InputText id="firstname" v-model="userProfile.firstName" />
                                    </div>
                                    <div class="field">
                                        <label for="lastname">Soyad</label>
                                        <InputText id="lastname" v-model="userProfile.lastName" />
                                    </div>
                                    <div class="field">
                                        <label for="email">E-posta</label>
                                        <InputText id="email" v-model="userProfile.email" disabled />
                                    </div>
                                    <div class="field">
                                        <label for="phone">Telefon</label>
                                        <InputText id="phone" v-model="userProfile.phone" />
                                    </div>
                                    <div class="field">
                                        <label for="address">Adres</label>
                                        <Textarea id="address" v-model="userProfile.address" rows="4" />
                                    </div>
                                    <div class="flex justify-content-end">
                                        <Button label="Bilgileri Kaydet" icon="pi pi-save" />
                                    </div>
                                </div>
                            </TabPanel>
                            
                            <!-- Tamamlanan Eğitimler -->
                            <TabPanel header="Tamamlanan Eğitimler">
                                <DataTable :value="completedTrainings" paginator :rows="5" dataKey="id"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    :rowsPerPageOptions="[5, 10, 25]"
                                    currentPageReportTemplate="Toplam {totalRecords} eğitim içinden {first}-{last} arası gösteriliyor"
                                    responsiveLayout="scroll">
                                    
                                    <Column field="name" header="Eğitim Adı" style="min-width: 200px"></Column>
                                    <Column field="category" header="Kategori"></Column>
                                    <Column field="completionDate" header="Tamamlanma Tarihi"></Column>
                                    <Column field="score" header="Başarı Puanı">
                                        <template #body="slotProps">
                                            <Tag :value="slotProps.data.score + '%'" 
                                                 :severity="getScoreSeverity(slotProps.data.score)" />
                                        </template>
                                    </Column>
                                    <Column header="Sertifika">
                                        <template #body>
                                            <Button icon="pi pi-download" class="p-button-rounded p-button-success p-button-text" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                            
                            <!-- Devam Eden Eğitimler -->
                            <TabPanel header="Devam Eden Eğitimler">
                                <DataTable :value="ongoingTrainings" paginator :rows="5" dataKey="id"
                                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                    :rowsPerPageOptions="[5, 10, 25]"
                                    currentPageReportTemplate="Toplam {totalRecords} eğitim içinden {first}-{last} arası gösteriliyor"
                                    responsiveLayout="scroll">
                                    
                                    <Column field="name" header="Eğitim Adı" style="min-width: 200px"></Column>
                                    <Column field="category" header="Kategori"></Column>
                                    <Column field="startDate" header="Başlangıç Tarihi"></Column>
                                    <Column field="dueDate" header="Bitiş Tarihi"></Column>
                                    <Column field="progress" header="İlerleme Durumu">
                                        <template #body="slotProps">
                                            <ProgressBar :value="slotProps.data.progress" :showValue="true" />
                                        </template>
                                    </Column>
                                    <Column header="İşlemler">
                                        <template #body>
                                            <Button label="Devam Et" icon="pi pi-play" size="small" />
                                        </template>
                                    </Column>
                                </DataTable>
                            </TabPanel>
                            
                            <!-- Bildirimler -->
                            <TabPanel header="Bildirimler">
                                <div class="field-checkbox mb-3">
                                    <Checkbox id="emailNotifications" v-model="notificationSettings.email" :binary="true" />
                                    <label for="emailNotifications" class="ml-2">E-posta Bildirimleri</label>
                                </div>
                                <div class="field-checkbox mb-3">
                                    <Checkbox id="newCourseNotifications" v-model="notificationSettings.newCourses" :binary="true" />
                                    <label for="newCourseNotifications" class="ml-2">Yeni Eğitim Bildirimleri</label>
                                </div>
                                <div class="field-checkbox mb-3">
                                    <Checkbox id="courseReminderNotifications" v-model="notificationSettings.courseReminders" :binary="true" />
                                    <label for="courseReminderNotifications" class="ml-2">Eğitim Hatırlatıcıları</label>
                                </div>
                                <div class="field-checkbox mb-3">
                                    <Checkbox id="deadlineNotifications" v-model="notificationSettings.deadlines" :binary="true" />
                                    <label for="deadlineNotifications" class="ml-2">Son Tarih Uyarıları</label>
                                </div>
                                <div class="field-checkbox mb-3">
                                    <Checkbox id="systemUpdateNotifications" v-model="notificationSettings.systemUpdates" :binary="true" />
                                    <label for="systemUpdateNotifications" class="ml-2">Sistem Güncellemeleri</label>
                                </div>
                                <div class="flex justify-content-end mt-4">
                                    <Button label="Ayarları Kaydet" icon="pi pi-save" />
                                </div>
                            </TabPanel>
                            
                            <!-- Güvenlik -->
                            <TabPanel header="Güvenlik">
                                <div class="p-fluid">
                                    <div class="field">
                                        <label for="currentPassword">Mevcut Şifre</label>
                                        <Password id="currentPassword" v-model="securitySettings.currentPassword" toggleMask />
                                    </div>
                                    <div class="field">
                                        <label for="newPassword">Yeni Şifre</label>
                                        <Password id="newPassword" v-model="securitySettings.newPassword" toggleMask />
                                    </div>
                                    <div class="field">
                                        <label for="confirmPassword">Şifre Tekrar</label>
                                        <Password id="confirmPassword" v-model="securitySettings.confirmPassword" toggleMask />
                                    </div>
                                    
                                    <Divider />
                                    
                                    <div class="field-checkbox mb-3">
                                        <Checkbox id="twoFactorAuth" v-model="securitySettings.twoFactorAuth" :binary="true" />
                                        <label for="twoFactorAuth" class="ml-2">İki Faktörlü Kimlik Doğrulama</label>
                                    </div>
                                    
                                    <div class="flex justify-content-end">
                                        <Button label="Değişiklikleri Kaydet" icon="pi pi-save" />
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            userProfile: {
                firstName: 'Ahmet',
                lastName: 'Yılmaz',
                email: 'ahmet.yilmaz@example.com',
                phone: '+90 555 123 4567',
                department: 'İnsan Kaynakları',
                position: 'Eğitim Koordinatörü',
                address: 'Bağdat Caddesi No:123\nKadıköy, İstanbul'
            },
            completedTrainings: [
                { id: 1, name: 'İş Sağlığı ve Güvenliği', category: 'Zorunlu Eğitimler', completionDate: '01.02.2025', score: 95 },
                { id: 2, name: 'Veri Güvenliği ve KVKK', category: 'Bilgi Güvenliği', completionDate: '15.01.2025', score: 88 },
                { id: 3, name: 'Proje Yönetimi', category: 'Yönetim', completionDate: '20.12.2024', score: 92 },
                { id: 4, name: 'Excel İleri Seviye', category: 'Ofis Uygulamaları', completionDate: '10.11.2024', score: 78 },
                { id: 5, name: 'İletişim Becerileri', category: 'Kişisel Gelişim', completionDate: '05.10.2024', score: 85 },
                { id: 6, name: 'Zaman Yönetimi', category: 'Kişisel Gelişim', completionDate: '15.09.2024', score: 90 }
            ],
            ongoingTrainings: [
                { id: 1, name: 'Liderlik ve Yöneticilik', category: 'Yönetim', startDate: '01.02.2025', dueDate: '01.04.2025', progress: 45 },
                { id: 2, name: 'Müşteri İlişkileri Yönetimi', category: 'Satış', startDate: '15.01.2025', dueDate: '15.03.2025', progress: 30 },
                { id: 3, name: 'İleri Düzey Sunum Teknikleri', category: 'Kişisel Gelişim', startDate: '20.02.2025', dueDate: '20.04.2025', progress: 10 }
            ],
            notificationSettings: {
                email: true,
                newCourses: true,
                courseReminders: true,
                deadlines: true,
                systemUpdates: false
            },
            securitySettings: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
                twoFactorAuth: false
            }
        };
    },
    methods: {
        getScoreSeverity(score) {
            if (score >= 90) return 'success';
            if (score >= 75) return 'info';
            if (score >= 60) return 'warning';
            return 'danger';
        }
    }
};
</script>

<style scoped>
.p-card-header {
    background-color: #f8f9fa;
    padding-top: 1.5rem;
}

.p-card .p-card-content {
    padding: 1.5rem;
}

.p-tabview .p-tabview-panels {
    padding: 1.5rem 0;
}

.progress-circle {
    width: 100px;
    height: 100px;
    margin: 0 auto;
}
</style>
