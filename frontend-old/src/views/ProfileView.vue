<template>
    <div class="flex flex-col w-full bg-[#1c1c1c] min-h-screen text-white">
      <!-- Header -->
      <div class="py-6 px-6 md:px-10 border-b border-gray-800">
        <h1 class="text-2xl font-medium text-white flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-3"></span>
          Profil Ayarları
        </h1>
        <p class="text-gray-400 mt-1">
          Hesap bilgilerinizi ve tercihlerinizi yönetin
        </p>
      </div>
  
      <!-- Main Content -->
      <div class="flex-1 p-6 md:p-10">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center h-64">
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 relative">
              <div class="animate-ping absolute w-full h-full rounded-full bg-emerald-500 opacity-75"></div>
              <div class="relative w-full h-full rounded-full bg-emerald-500"></div>
            </div>
            <p class="mt-4 text-gray-400">Veriler yükleniyor...</p>
          </div>
        </div>
  
        <!-- Error State -->
        <div v-else-if="error" class="mb-8 bg-red-900/20 border border-red-700 text-red-200 rounded-md p-4 flex items-start">
          <div class="mr-3 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-medium">Veri yüklenirken bir hata oluştu</h3>
            <p class="mt-1 text-sm text-red-300">{{ error }}</p>
          </div>
        </div>
  
        <!-- Content (when loaded) -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <div class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800 sticky top-8">
              <div class="flex flex-col items-center mb-6">
                <div class="relative group">
                  <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 bg-gray-800 flex items-center justify-center">
                    <img v-if="profile.avatar" :src="profile.avatar" alt="Profile" class="w-full h-full object-cover" />
                    <div v-else class="text-4xl font-medium uppercase text-gray-400">
                      {{ getInitials(profile.name) }}
                    </div>
                  </div>
                  <div @click="openFileUpload" class="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileUpload" />
                </div>
                <div class="mt-4 text-center">
                  <h3 class="text-xl font-medium">{{ profile.name }}</h3>
                  <p class="text-gray-400">{{ profile.position }}</p>
                  <p class="mt-1 text-sm text-gray-500">
                    {{ profile.department }}
                  </p>
                </div>
              </div>
  
              <div class="border-t border-gray-700 pt-4">
                <nav class="flex flex-col space-y-1">
                  <a href="#personal" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md" :class="activeSection === 'personal' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 hover:bg-gray-700/50'" @click.prevent="setActiveSection('personal')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Kişisel Bilgiler
                  </a>
                  <a href="#security" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md" :class="activeSection === 'security' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 hover:bg-gray-700/50'" @click.prevent="setActiveSection('security')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Güvenlik
                  </a>
                  <a href="#notifications" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md" :class="activeSection === 'notifications' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 hover:bg-gray-700/50'" @click.prevent="setActiveSection('notifications')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Bildirim Tercihleri
                  </a>
                  <a href="#appearance" class="flex items-center px-4 py-2.5 text-sm font-medium rounded-md" :class="activeSection === 'appearance' ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-300 hover:bg-gray-700/50'" @click.prevent="setActiveSection('appearance')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Görünüm
                  </a>
                </nav>
              </div>
            </div>
          </div>
  
          <!-- Main Content Area -->
          <div class="lg:col-span-2 space-y-8">
            <!-- Personal Information -->
            <div v-show="activeSection === 'personal'" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <h2 class="text-xl font-medium mb-6">Kişisel Bilgiler</h2>
              
              <form @submit.prevent="savePersonalInfo">
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="name" class="block text-sm font-medium text-gray-400 mb-1">Ad Soyad</label>
                      <input type="text" id="name" v-model="profile.name" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    </div>
                    <div>
                      <label for="email" class="block text-sm font-medium text-gray-400 mb-1">E-posta</label>
                      <input type="email" id="email" v-model="profile.email" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="position" class="block text-sm font-medium text-gray-400 mb-1">Pozisyon</label>
                      <input type="text" id="position" v-model="profile.position" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    </div>
                    <div>
                      <label for="department" class="block text-sm font-medium text-gray-400 mb-1">Departman</label>
                      <input type="text" id="department" v-model="profile.department" disabled class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent opacity-70 cursor-not-allowed">
                      <p class="mt-1 text-xs text-gray-500">Departman değişikliği için İK ile iletişime geçin</p>
                    </div>
                  </div>
                  
                  <div>
                    <label for="bio" class="block text-sm font-medium text-gray-400 mb-1">Hakkında</label>
                    <textarea id="bio" v-model="profile.bio" rows="4" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"></textarea>
                  </div>
  
                  <div class="flex justify-end">
                    <button type="submit" :disabled="saving" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center" :class="{ 'opacity-70 cursor-not-allowed': saving }">
                      <svg v-if="saving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
  
            <!-- Security Settings -->
            <div v-show="activeSection === 'security'" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <h2 class="text-xl font-medium mb-6">Güvenlik</h2>
              
              <form @submit.prevent="changePassword">
                <div class="space-y-6">
                  <div>
                    <label for="current-password" class="block text-sm font-medium text-gray-400 mb-1">Mevcut Şifre</label>
                    <input type="password" id="current-password" v-model="passwordForm.currentPassword" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label for="new-password" class="block text-sm font-medium text-gray-400 mb-1">Yeni Şifre</label>
                      <input type="password" id="new-password" v-model="passwordForm.newPassword" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    </div>
                    <div>
                      <label for="confirm-password" class="block text-sm font-medium text-gray-400 mb-1">Yeni Şifre (Tekrar)</label>
                      <input type="password" id="confirm-password" v-model="passwordForm.confirmPassword" class="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                    </div>
                  </div>
  
                  <div>
                    <div class="flex items-center mb-1">
                      <h3 class="text-sm font-medium text-gray-400">Şifre Gereksinimleri</h3>
                      <span class="ml-2 px-2 py-0.5 bg-gray-700 text-xs rounded-full text-gray-300">Zorunlu</span>
                    </div>
                    <ul class="text-xs space-y-1.5 text-gray-400">
                      <li class="flex items-center" :class="{ 'text-emerald-500': passwordForm.newPassword.length >= 8 }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" :class="{ 'text-emerald-500': passwordForm.newPassword.length >= 8 }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path :stroke-linecap="passwordForm.newPassword.length >= 8 ? 'round' : 'butt'" stroke-linejoin="round" stroke-width="2" :d="passwordForm.newPassword.length >= 8 ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                        </svg>
                        En az 8 karakter uzunluğunda
                      </li>
                      <li class="flex items-center" :class="{ 'text-emerald-500': /[A-Z]/.test(passwordForm.newPassword) }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" :class="{ 'text-emerald-500': /[A-Z]/.test(passwordForm.newPassword) }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path :stroke-linecap="/[A-Z]/.test(passwordForm.newPassword) ? 'round' : 'butt'" stroke-linejoin="round" stroke-width="2" :d="/[A-Z]/.test(passwordForm.newPassword) ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                        </svg>
                        En az bir büyük harf
                      </li>
                      <li class="flex items-center" :class="{ 'text-emerald-500': /[0-9]/.test(passwordForm.newPassword) }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" :class="{ 'text-emerald-500': /[0-9]/.test(passwordForm.newPassword) }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path :stroke-linecap="/[0-9]/.test(passwordForm.newPassword) ? 'round' : 'butt'" stroke-linejoin="round" stroke-width="2" :d="/[0-9]/.test(passwordForm.newPassword) ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                        </svg>
                        En az bir rakam
                      </li>
                      <li class="flex items-center" :class="{ 'text-emerald-500': passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword !== '' }">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" :class="{ 'text-emerald-500': passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword !== '' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path :stroke-linecap="passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword !== '' ? 'round' : 'butt'" stroke-linejoin="round" stroke-width="2" :d="passwordForm.newPassword === passwordForm.confirmPassword && passwordForm.newPassword !== '' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'" />
                        </svg>
                        Şifreler eşleşiyor
                      </li>
                    </ul>
                  </div>
  
                  <div class="flex justify-end">
                    <button type="submit" :disabled="changingPassword || !isPasswordValid" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center" :class="{ 'opacity-70 cursor-not-allowed': changingPassword || !isPasswordValid }">
                      <svg v-if="changingPassword" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ changingPassword ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir' }}
                    </button>
                  </div>
                </div>
              </form>
  
              <div class="mt-8 pt-6 border-t border-gray-700">
                <h3 class="text-md font-medium mb-3">İki Faktörlü Kimlik Doğrulama</h3>
                <p class="text-sm text-gray-400 mb-4">
                  İki faktörlü kimlik doğrulama, hesabınıza bir güvenlik katmanı daha ekler. Etkinleştirildiğinde, giriş yaparken şifrenizin yanı sıra telefonunuzdan bir kod girmeniz istenecektir.
                </p>
                
                <div class="flex items-center">
                  <button class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                    {{ profile.twoFactorEnabled ? 'Devre Dışı Bırak' : 'Etkinleştir' }}
                  </button>
                  <span class="ml-3 text-sm" :class="profile.twoFactorEnabled ? 'text-emerald-500' : 'text-gray-400'">
                    {{ profile.twoFactorEnabled ? 'Etkin' : 'Devre Dışı' }}
                  </span>
                </div>
              </div>
            </div>
  
            <!-- Notification Preferences -->
            <div v-show="activeSection === 'notifications'" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
              <h2 class="text-xl font-medium mb-6">Bildirim Tercihleri</h2>
              
              <form @submit.prevent="saveNotificationSettings">
                <div class="space-y-6">
                  <div>
                    <h3 class="text-md font-medium mb-3">E-posta Bildirimleri</h3>
                    <div class="space-y-3">
                      <div class="flex items-center">
                        <input type="checkbox" id="email-training" v-model="notifications.emailTraining" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="email-training" class="ml-3 text-sm text-gray-300">Yeni eğitimler hakkında bilgilendirme</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="email-performance" v-model="notifications.emailPerformance" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="email-performance" class="ml-3 text-sm text-gray-300">Performans değerlendirmeleri</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="email-news" v-model="notifications.emailNews" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="email-news" class="ml-3 text-sm text-gray-300">Şirket haberleri ve duyurular</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="email-reminders" v-model="notifications.emailReminders" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="email-reminders" class="ml-3 text-sm text-gray-300">Eğitim hatırlatıcıları</label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 class="text-md font-medium mb-3">Sistem Bildirimleri</h3>
                    <div class="space-y-3">
                      <div class="flex items-center">
                        <input type="checkbox" id="system-training" v-model="notifications.systemTraining" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="system-training" class="ml-3 text-sm text-gray-300">Yeni eğitimler</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="system-performance" v-model="notifications.systemPerformance" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="system-performance" class="ml-3 text-sm text-gray-300">Performans güncellemeleri</label>
                      </div>
                      <div class="flex items-center">
                        <input type="checkbox" id="system-reminders" v-model="notifications.systemReminders" class="h-4 w-4 rounded border-gray-700 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-gray-800">
                        <label for="system-reminders" class="ml-3 text-sm text-gray-300">Eğitim son tarih hatırlatıcıları</label>
                      </div>
                    </div>
                  </div>
                  
                  <div class="flex justify-end">
                    <button type="submit" :disabled="savingNotifications" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center" :class="{ 'opacity-70 cursor-not-allowed': savingNotifications }">
                      <svg v-if="savingNotifications" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ savingNotifications ? 'Kaydediliyor...' : 'Tercihleri Kaydet' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
  
                      <!-- Appearance Settings -->
          <div v-show="activeSection === 'appearance'" class="bg-[#2e2e2e] rounded-lg p-6 border border-gray-800">
            <h2 class="text-xl font-medium mb-6">Görünüm</h2>
            
            <form @submit.prevent="saveAppearanceSettings">
              <div class="space-y-6">
                <div>
                  <h3 class="text-md font-medium mb-3">Tema</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div 
                      class="relative border border-gray-700 rounded-lg p-4 cursor-pointer" 
                      :class="{ 'ring-2 ring-emerald-500': appearance.theme === 'dark' }"
                      @click="appearance.theme = 'dark'"
                    >
                      <div class="flex items-center mb-2">
                        <div class="h-4 w-4 rounded-full border border-gray-500" :class="{'bg-emerald-500 border-emerald-500': appearance.theme === 'dark'}"></div>
                        <span class="ml-2 text-sm font-medium">Koyu</span>
                      </div>
                      <div class="h-20 bg-gray-900 rounded-md overflow-hidden">
                        <div class="h-6 bg-gray-800 border-b border-gray-700 flex items-center px-2">
                          <div class="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                          <div class="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                          <div class="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div class="p-2">
                          <div class="h-2 w-12 bg-gray-700 rounded-full mb-1"></div>
                          <div class="h-2 w-10 bg-gray-700 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      class="relative border border-gray-700 rounded-lg p-4 cursor-pointer" 
                      :class="{ 'ring-2 ring-emerald-500': appearance.theme === 'light' }"
                      @click="appearance.theme = 'light'"
                    >
                      <div class="flex items-center mb-2">
                        <div class="h-4 w-4 rounded-full border border-gray-500" :class="{'bg-emerald-500 border-emerald-500': appearance.theme === 'light'}"></div>
                        <span class="ml-2 text-sm font-medium">Açık</span>
                      </div>
                      <div class="h-20 bg-white rounded-md overflow-hidden">
                        <div class="h-6 bg-gray-100 border-b border-gray-200 flex items-center px-2">
                          <div class="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                          <div class="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
                          <div class="h-2 w-2 rounded-full bg-green-500"></div>
                        </div>
                        <div class="p-2">
                          <div class="h-2 w-12 bg-gray-300 rounded-full mb-1"></div>
                          <div class="h-2 w-10 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-md font-medium mb-3">Yazı Tipi Boyutu</h3>
                  <div class="flex items-center">
                    <span class="text-xs text-gray-400">Küçük</span>
                    <input 
                      type="range" 
                      min="0" 
                      max="2" 
                      step="1" 
                      v-model="appearance.fontSize" 
                      class="mx-3 w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    >
                    <span class="text-sm text-gray-400">Büyük</span>
                  </div>
                  <div class="mt-2 text-sm text-gray-500">
                    <span>Örnek metin: </span>
                    <span :class="{
                      'text-xs': appearance.fontSize === '0',
                      'text-sm': appearance.fontSize === '1',
                      'text-base': appearance.fontSize === '2'
                    }">Bu yazı boyutu seçiminizi gösterir.</span>
                  </div>
                </div>
                
                <div>
                  <h3 class="text-md font-medium mb-3">Renk Vurgusu</h3>
                  <div class="grid grid-cols-4 gap-4">
                    <div 
                      v-for="color in accentColors" 
                      :key="color.value"
                      class="flex flex-col items-center space-y-2 cursor-pointer"
                      @click="appearance.accentColor = color.value"
                    >
                      <div 
                        class="h-8 w-8 rounded-full"
                        :class="`bg-${color.value}-500`"
                        :style="`outline: 2px solid ${appearance.accentColor === color.value ? `rgb(var(--color-${color.value}-500))` : 'transparent'}; outline-offset: 2px;`"
                      ></div>
                      <span class="text-xs text-gray-400">{{ color.name }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-end">
                  <button type="submit" :disabled="savingAppearance" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center" :class="{ 'opacity-70 cursor-not-allowed': savingAppearance }">
                    <svg v-if="savingAppearance" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ savingAppearance ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          <!-- Success Message -->
          <transition name="fade">
            <div v-if="showSuccessMessage" class="fixed bottom-4 right-4 bg-emerald-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ successMessage }}
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// api tanımlanmış ama kullanılmadığı için yorum satırına alalım
// import api from '../api'
// Auth store kullanılmıyor, yorum satırına alalım
// import { useAuthStore } from '@/stores/auth'

// Auth store
// const authStore = useAuthStore()

// Active section state
const activeSection = ref('personal')

// Loading states
const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const changingPassword = ref(false)
const savingNotifications = ref(false)
const savingAppearance = ref(false)
const showSuccessMessage = ref(false)
const successMessage = ref('')

// File upload
const fileInput = ref<HTMLInputElement | null>(null)

// Profile data
const profile = ref({
  name: '',
  email: '',
  position: '',
  department: '',
  bio: '',
  avatar: null as string | null,
  twoFactorEnabled: false
})

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Notification settings
const notifications = ref({
  emailTraining: true,
  emailPerformance: true,
  emailNews: false,
  emailReminders: true,
  systemTraining: true,
  systemPerformance: true,
  systemReminders: true
})

// Appearance settings
const appearance = ref({
  theme: 'dark',
  fontSize: '1',
  accentColor: 'emerald'
})

// Accent colors
const accentColors = [
  { name: 'Yeşil', value: 'emerald' },
  { name: 'Mor', value: 'purple' },
  { name: 'Mavi', value: 'cyan' },
  { name: 'Turuncu', value: 'amber' }
]

// Computed properties
const isPasswordValid = computed(() => {
  return passwordForm.value.currentPassword.length > 0 &&
    passwordForm.value.newPassword.length >= 8 &&
    /[A-Z]/.test(passwordForm.value.newPassword) &&
    /[0-9]/.test(passwordForm.value.newPassword) &&
    passwordForm.value.newPassword === passwordForm.value.confirmPassword
})

// Get initials from name
function getInitials(name: string): string {
  if (!name) return ''
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Set active section
function setActiveSection(section: string): void {
  activeSection.value = section
}

// Open file upload dialog
function openFileUpload(): void {
  fileInput.value?.click()
}

// Handle file upload
function handleFileUpload(event: Event): void {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  const reader = new FileReader()
  
  reader.onload = (e: ProgressEvent<FileReader>) => {
    profile.value.avatar = e.target?.result as string
  }
  
  reader.readAsDataURL(file)
}

// Save personal information
async function savePersonalInfo(): Promise<void> {
  try {
    saving.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // TODO: Replace with actual API call
    // await api.put('/profile', {
    //   name: profile.value.name,
    //   email: profile.value.email,
    //   position: profile.value.position,
    //   bio: profile.value.bio,
    //   avatar: profile.value.avatar
    // })
    
    showSuccess('Profil bilgileriniz kaydedildi')
  } catch (e: unknown) {
    error.value = (e as Error).message || 'Profil kaydedilirken bir hata oluştu'
  } finally {
    saving.value = false
  }
}

// Change password
async function changePassword(): Promise<void> {
  if (!isPasswordValid.value) return
  
  try {
    changingPassword.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // TODO: Replace with actual API call
    // await api.put('/profile/password', {
    //   currentPassword: passwordForm.value.currentPassword,
    //   newPassword: passwordForm.value.newPassword
    // })
    
    // Reset form
    passwordForm.value.currentPassword = ''
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
    
    showSuccess('Şifreniz başarıyla değiştirildi')
  } catch (e: unknown) {
    error.value = (e as Error).message || 'Şifre değiştirilirken bir hata oluştu'
  } finally {
    changingPassword.value = false
  }
}

// Save notification settings
async function saveNotificationSettings(): Promise<void> {
  try {
    savingNotifications.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // TODO: Replace with actual API call
    // await api.put('/profile/notifications', notifications.value)
    
    showSuccess('Bildirim tercihleriniz kaydedildi')
  } catch (e: unknown) {
    error.value = (e as Error).message || 'Bildirim tercihleri kaydedilirken bir hata oluştu'
  } finally {
    savingNotifications.value = false
  }
}

// Save appearance settings
async function saveAppearanceSettings(): Promise<void> {
  try {
    savingAppearance.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // TODO: Replace with actual API call
    // await api.put('/profile/appearance', appearance.value)
    
    // Apply theme changes (in a real app, this would be handled by a theme manager)
    document.documentElement.classList.toggle('dark', appearance.value.theme === 'dark')
    
    showSuccess('Görünüm ayarlarınız kaydedildi')
  } catch (e: unknown) {
    error.value = (e as Error).message || 'Görünüm ayarları kaydedilirken bir hata oluştu'
  } finally {
    savingAppearance.value = false
  }
}

// Show success message
function showSuccess(message: string): void {
  successMessage.value = message
  showSuccessMessage.value = true
  
  setTimeout(() => {
    showSuccessMessage.value = false
  }, 3000)
}

// Fetch profile data
async function fetchProfile(): Promise<void> {
  try {
    loading.value = true
    error.value = null
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    // TODO: Replace with actual API call
    // const response = await api.get('/profile')
    // const data = response.data
    
    // Mock data
    const data = {
      name: 'Ahmet Yılmaz',
      email: 'ahmet.yilmaz@example.com',
      position: 'Yazılım Mühendisi',
      department: 'Bilgi Teknolojileri',
      bio: 'Yazılım geliştirme konusunda 5 yıllık deneyime sahibim. Frontend ve backend teknolojilerinde uzmanım. Takım çalışmasına ve sürekli öğrenmeye önem veriyorum.',
      avatar: null,
      twoFactorEnabled: false
    }
    
    profile.value = data
  } catch (e: unknown) {
    error.value = (e as Error).message || 'Profil bilgileri yüklenirken bir hata oluştu'
  } finally {
    loading.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>