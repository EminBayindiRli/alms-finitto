import supabase from './supabase';

// Demo mod - gerçek API kullanmak yerine sahte veriler
const DEMO_MODE = true;

// Admin için sahte veriler
const ADMIN_MOCK_DATA = {
  total_employees: 15,
  department_statistics: {
    'Sales': { avg_task_completion: 0.78, avg_email_response: 0.65 },
    'Product Development': { avg_task_completion: 0.85, avg_email_response: 0.72 },
    'HR': { avg_task_completion: 0.92, avg_email_response: 0.88 },
  },
  team_statistics: {
    'Team-1': { avg_task_completion: 0.82, avg_email_response: 0.70 },
    'Team-2': { avg_task_completion: 0.75, avg_email_response: 0.68 },
    'Team-3': { avg_task_completion: 0.90, avg_email_response: 0.85 },
  }
};

// Çalışan için sahte veriler
const EMPLOYEE_MOCK_DATA = {
  employee_id: '1',
  current_metrics: {
    task_completion_rate: 0.85,
    email_efficiency: 0.75,
    meeting_efficiency: 0.70,
    communication_score: 0.80,
    collaboration_score: 0.65,
    time_efficiency: 0.78,
    file_activity: 0.62
  },
  historical_trends: {
    task_completion: [
      { day: 1, completion_rate: 0.82, overdue_ratio: 0.15 },
      { day: 2, completion_rate: 0.84, overdue_ratio: 0.12 },
      { day: 3, completion_rate: 0.79, overdue_ratio: 0.18 },
      { day: 4, completion_rate: 0.85, overdue_ratio: 0.10 },
      { day: 5, completion_rate: 0.88, overdue_ratio: 0.08 },
      { day: 6, completion_rate: 0.86, overdue_ratio: 0.09 },
      { day: 7, completion_rate: 0.90, overdue_ratio: 0.05 }
    ],
    communication: [
      { day: 1, email_activity: 32, chat_activity: 45, response_time: 25 },
      { day: 2, email_activity: 28, chat_activity: 42, response_time: 30 },
      { day: 3, email_activity: 35, chat_activity: 50, response_time: 20 },
      { day: 4, email_activity: 30, chat_activity: 48, response_time: 28 },
      { day: 5, email_activity: 25, chat_activity: 40, response_time: 35 },
      { day: 6, email_activity: 38, chat_activity: 52, response_time: 18 },
      { day: 7, email_activity: 35, chat_activity: 55, response_time: 15 }
    ],
    collaboration: [
      { day: 1, file_sharing: 3, comments: 8, meeting_participation: 0.7 },
      { day: 2, file_sharing: 2, comments: 5, meeting_participation: 0.8 },
      { day: 3, file_sharing: 4, comments: 10, meeting_participation: 0.6 },
      { day: 4, file_sharing: 3, comments: 7, meeting_participation: 0.9 },
      { day: 5, file_sharing: 5, comments: 12, meeting_participation: 0.8 },
      { day: 6, file_sharing: 4, comments: 9, meeting_participation: 0.7 },
      { day: 7, file_sharing: 6, comments: 15, meeting_participation: 0.9 }
    ],
    time_management: [
      { day: 1, focus_time: 2.5, meeting_time: 1.5 },
      { day: 2, focus_time: 3.0, meeting_time: 1.2 },
      { day: 3, focus_time: 2.2, meeting_time: 1.8 },
      { day: 4, focus_time: 3.5, meeting_time: 1.0 },
      { day: 5, focus_time: 4.0, meeting_time: 0.8 },
      { day: 6, focus_time: 3.2, meeting_time: 1.3 },
      { day: 7, focus_time: 3.8, meeting_time: 1.0 }
    ]
  },
  recommendations: [
    { suggestion: "E-posta yanıt sürelerini iyileştirin", reason: "E-posta yanıt süreleriniz ortalama 25 dakikanın üzerinde", priority: "high" },
    { suggestion: "Toplantı süresini optimize edin", reason: "Toplantılarda geçirdiğiniz süre günlük 2 saatin üzerinde", priority: "medium" },
    { suggestion: "Dosya paylaşımını artırın", reason: "Dosya paylaşım oranınız takım ortalamasının altında", priority: "low" }
  ],
  segment_info: {
    segment_name: "Yüksek Performans - Orta İletişim",
    segment_characteristics: {
      performance: "Yüksek görev tamamlama, iyi zaman yönetimi",
      communication: "Orta seviye iletişim becerisi",
      improvement: "İşbirliği alanında gelişim potansiyeli"
    },
    segment_size: 4,
    segment_percentage: 20
  },
  performance_summary: {
    overall_score: 0.74,
    strongest_area: "task_completion_rate",
    improvement_needed: "collaboration_score"
  }
};

// API istekleri için yardımcı fonksiyon
const fetchWithAuth = async (url, options = {}) => {
  if (DEMO_MODE) {
    // Demo modda ise API isteklerini simüle et
    console.log(`Demo modunda API isteği: ${url}`);
    
    return new Promise((resolve) => {
      // Ağ gecikmesini simüle et
      setTimeout(() => {
        // URL'e göre uygun mock veriyi döndür
        if (url === '/analyze/all') {
          resolve({
            ok: true,
            json: () => Promise.resolve(ADMIN_MOCK_DATA)
          });
        } else if (url.startsWith('/employee/')) {
          resolve({
            ok: true,
            json: () => Promise.resolve(EMPLOYEE_MOCK_DATA)
          });
        } else if (url.startsWith('/generate/reports')) {
          resolve({
            ok: true,
            json: () => Promise.resolve({
              status: "success",
              message: "All reports generated successfully",
              report_paths: ["report1.pdf", "report2.pdf"]
            })
          });
        } else {
          resolve({
            ok: false,
            status: 404,
            statusText: 'Not Found'
          });
        }
      }, 500); // 500ms gecikme
    });
  }
  
  // Gerçek API isteği (demo mod kapalıysa)
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
  };

  return fetch(`${API_URL}${url}`, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });
};

export const EmployeeService = {
  // Bireysel çalışan analizini getir
  getAnalysis: async (employeeId) => {
    try {
      // Kullanıcı bilgilerini localStorage'dan al
      const userData = JSON.parse(localStorage.getItem('alms_user') || '{}');
      
      console.log(`Çalışan analizi isteniyor: ${employeeId}, kullanıcı: `, userData);
      
      const response = await fetchWithAuth(`/employee/${employeeId}`);
      if (!response.ok) throw new Error('Çalışan verileri alınamadı');
      return await response.json();
    } catch (error) {
      console.error('Çalışan analizi hatası:', error);
      throw error;
    }
  },

  // Çalışan raporunu getir
  getReport: async (employeeId) => {
    try {
      // Demo modda sahte bir PDF Blob döndür
      if (DEMO_MODE) {
        // Boş bir PDF bytes dizisini simüle etmek için yeni bir ArrayBuffer oluştur
        const bytes = new Uint8Array(100);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        return blob;
      }
      
      const response = await fetchWithAuth(`/employee/${employeeId}/report`);
      if (!response.ok) throw new Error('Çalışan raporu alınamadı');
      return await response.blob();
    } catch (error) {
      console.error('Rapor alma hatası:', error);
      throw error;
    }
  },
};

export const AdminService = {
  // Tüm çalışanların analizini getir
  getAllAnalyses: async () => {
    try {
      const response = await fetchWithAuth('/analyze/all');
      if (!response.ok) throw new Error('Veriler alınamadı');
      return await response.json();
    } catch (error) {
      console.error('Tüm analizler hatası:', error);
      throw error;
    }
  },

  // Tüm raporları oluştur
  generateReports: async () => {
    try {
      const response = await fetchWithAuth('/generate/reports', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Raporlar oluşturulamadı');
      return await response.json();
    } catch (error) {
      console.error('Rapor oluşturma hatası:', error);
      throw error;
    }
  },
};

export const ProfileService = {
  // Kullanıcı profil bilgilerini getir
  getUserProfile: async (userId) => {
    try {
      // Demo modda localStorage'dan kullanıcı bilgilerini döndür
      if (DEMO_MODE) {
        const userData = JSON.parse(localStorage.getItem('alms_user') || '{}');
        return userData;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Profil alma hatası:', error);
      throw error;
    }
  },

  // Profil güncelleme
  updateProfile: async (userId, updates) => {
    try {
      // Demo modda güncelleme simülasyonu yap
      if (DEMO_MODE) {
        const userData = JSON.parse(localStorage.getItem('alms_user') || '{}');
        const updatedUser = { ...userData, ...updates };
        localStorage.setItem('alms_user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      throw error;
    }
  },
}; 