<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col space-y-8">
        <!-- Başlık -->
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Sistem Yönetimi</h2>
          <p class="mt-1 text-sm text-gray-500">
            Kullanıcı, departman ve takım yönetimini buradan yapabilirsiniz.
          </p>
        </div>

        <!-- Kullanıcı Yönetimi -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Kullanıcı Yönetimi</h3>
              <button
                @click="openNewUserModal"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon class="h-5 w-5 mr-2" />
                Yeni Kullanıcı
              </button>
            </div>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksiyonlar
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="user in users" :key="user.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                            {{ getInitials(user.name) }}
                          </div>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ user.name }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ user.email }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'">
                        {{ user.role === 'admin' ? 'Admin' : 'Kullanıcı' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                        {{ user.active ? 'Aktif' : 'Pasif' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="editUser(user)"
                        class="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Düzenle
                      </button>
                      <button
                        @click="deleteUser(user)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Organizasyon Yönetimi -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg font-medium text-gray-900">Organizasyon Yönetimi</h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Departman Yönetimi -->
              <div class="border rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-base font-medium text-gray-900">Departmanlar</h4>
                  <button
                    @click="openNewDepartmentModal"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon class="h-4 w-4 mr-1" />
                    Yeni
                  </button>
                </div>
                <ul class="divide-y divide-gray-200">
                  <li v-for="dept in departments" :key="dept.id" class="py-3 flex justify-between items-center">
                    <span class="text-sm text-gray-900">{{ dept.name }}</span>
                    <div>
                      <button
                        @click="editDepartment(dept)"
                        class="text-blue-600 hover:text-blue-900 text-sm mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        @click="deleteDepartment(dept)"
                        class="text-red-600 hover:text-red-900 text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                </ul>
              </div>

              <!-- Takım Yönetimi -->
              <div class="border rounded-lg p-4">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-base font-medium text-gray-900">Takımlar</h4>
                  <button
                    @click="openNewTeamModal"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <PlusIcon class="h-4 w-4 mr-1" />
                    Yeni
                  </button>
                </div>
                <ul class="divide-y divide-gray-200">
                  <li v-for="team in teams" :key="team.id" class="py-3 flex justify-between items-center">
                    <div>
                      <span class="text-sm text-gray-900">{{ team.name }}</span>
                      <span class="text-xs text-gray-500 ml-2">({{ team.department_name }})</span>
                    </div>
                    <div>
                      <button
                        @click="editTeam(team)"
                        class="text-blue-600 hover:text-blue-900 text-sm mr-3"
                      >
                        Düzenle
                      </button>
                      <button
                        @click="deleteTeam(team)"
                        class="text-red-600 hover:text-red-900 text-sm"
                      >
                        Sil
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Yeni Kullanıcı Modal -->
    <TransitionRoot appear :show="isUserModalOpen" as="template">
      <Dialog as="div" @close="closeUserModal" class="relative z-10">
        <TransitionChild
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              enter="ease-out duration-300"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  {{ editingUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı' }}
                </DialogTitle>
                <div class="mt-4">
                  <form @submit.prevent="saveUser" class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Ad Soyad</label>
                      <input
                        type="text"
                        v-model="userForm.name"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        v-model="userForm.email"
                        required
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Rol</label>
                      <select
                        v-model="userForm.role"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Durum</label>
                      <select
                        v-model="userForm.active"
                        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option :value="true">Aktif</option>
                        <option :value="false">Pasif</option>
                      </select>
                    </div>
                    <div class="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        @click="closeUserModal"
                        class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {{ editingUser ? 'Güncelle' : 'Oluştur' }}
                      </button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import { PlusIcon } from '@heroicons/vue/24/outline'
import { supabase } from '@/utils/supabase'

// State
const users = ref<any[]>([])
const departments = ref<any[]>([])
const teams = ref<any[]>([])
const isUserModalOpen = ref(false)
const editingUser = ref<any>(null)
const userForm = ref({
  name: '',
  email: '',
  role: 'user',
  active: true
})

// Methods
function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function openNewUserModal() {
  editingUser.value = null
  userForm.value = {
    name: '',
    email: '',
    role: 'user',
    active: true
  }
  isUserModalOpen.value = true
}

function editUser(user: any) {
  editingUser.value = user
  userForm.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    active: user.active
  }
  isUserModalOpen.value = true
}

function closeUserModal() {
  isUserModalOpen.value = false
  editingUser.value = null
}

async function saveUser() {
  try {
    if (editingUser.value) {
      // Kullanıcı güncelle
      const { error } = await supabase
        .from('users')
        .update({
          name: userForm.value.name,
          role: userForm.value.role,
          active: userForm.value.active
        })
        .eq('id', editingUser.value.id)

      if (error) throw error
    } else {
      // Yeni kullanıcı oluştur
      const { data: { user }, error } = await supabase.auth.signUp({
        email: userForm.value.email,
        password: generateRandomPassword() // Güvenli rastgele şifre
      })

      if (error) throw error

      // Kullanıcı profilini oluştur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user?.id,
          name: userForm.value.name,
          role: userForm.value.role,
          active: userForm.value.active
        })

      if (profileError) throw profileError
    }

    await loadUsers()
    closeUserModal()
  } catch (error) {
    console.error('Error saving user:', error)
    // Hata mesajını göster
  }
}

async function deleteUser(user: any) {
  if (!confirm(`${user.name} kullanıcısını silmek istediğinize emin misiniz?`)) {
    return
  }

  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', user.id)

    if (error) throw error
    await loadUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

function generateRandomPassword() {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

async function loadUsers() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('name')

    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('Error loading users:', error)
  }
}

async function loadDepartments() {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .order('name')

    if (error) throw error
    departments.value = data || []
  } catch (error) {
    console.error('Error loading departments:', error)
  }
}

async function loadTeams() {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*, department:departments(name)')
      .order('name')

    if (error) throw error
    teams.value = data?.map(team => ({
      ...team,
      department_name: team.department?.name
    })) || []
  } catch (error) {
    console.error('Error loading teams:', error)
  }
}

onMounted(() => {
  loadUsers()
  loadDepartments()
  loadTeams()
})</script>
