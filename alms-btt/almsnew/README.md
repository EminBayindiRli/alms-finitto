# ALMS - Analitik Öğrenme Yönetim Sistemi

ALMS, Microsoft 365 ekosistemi üzerine inşa edilmiş, çalışanların performansını analiz eden ve kişiselleştirilmiş eğitim önerileri sunan modern bir öğrenme yönetim sistemidir.

## Özellikler

### Tüm Kullanıcılar İçin
- **Dashboard**: Kişiselleştirilmiş genel bakış ve önemli metrikler
- **Performans Analizi**: Microsoft 365 verilerine dayalı detaylı performans metrikleri
- **Eğitim Önerileri**: Microsoft Learn ile entegre kişiselleştirilmiş eğitim önerileri

### Yöneticiler İçin Ek Özellikler
- **Çalışan Yönetimi**: Tüm çalışanların performans ve gelişim takibi
- **Raporlama**: Departman, takım ve kişi bazlı raporlar oluşturma ve indirme
- **Analiz Merkezi**: İleri düzey veri analizi ve görselleştirme araçları

## Teknolojiler

- **Frontend**: React + TypeScript, Chakra UI, React Router
- **Backend**: FastAPI, SQLAlchemy, Microsoft Graph SDK
- **Veritabanı**: Azure SQL Database
- **Önbellek**: Azure Cache for Redis
- **Kimlik Doğrulama**: Azure AD
- **Storage**: Azure Blob Storage

## Başlangıç

### Gereksinimler
- Node.js (v18+)
- Python (v3.11+)
- Microsoft 365 hesabı

### Kurulum

1. Backend bağımlılıklarının yüklenmesi:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Frontend bağımlılıklarının yüklenmesi:
```bash
cd frontend
npm install
```

3. Uygulamanın çalıştırılması:
```bash
# Backend
cd backend
uvicorn app.main:app --reload

# Frontend
cd frontend
npm run dev
``` 