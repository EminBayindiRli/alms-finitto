# ALMS - Analitik Öğrenme Yönetim Sistemi

ALMS, çalışanların performansını analiz eden, eğitim önerileri sunan ve yöneticilere kapsamlı raporlama araçları sağlayan modern bir öğrenme yönetim sistemidir.

## Özellikler

### Tüm Kullanıcılar İçin
- **Dashboard**: Kişiselleştirilmiş genel bakış ve önemli metrikler
- **Performans Analizi**: Detaylı performans metrikleri ve geçmiş trendler
- **Eğitim Önerileri**: Performans verilerine dayalı kişiselleştirilmiş eğitim önerileri

### Yöneticiler İçin Ek Özellikler
- **Çalışan Yönetimi**: Tüm çalışanların performans ve gelişim takibi
- **Raporlama**: Departman, takım ve kişi bazlı raporlar oluşturma ve indirme
- **Analiz Merkezi**: İleri düzey veri analizi ve görselleştirme araçları

## Teknolojiler

- **Frontend**: React, Chakra UI, React Router
- **Performans İzleme**: Özel analitik algoritmaları
- **Grafikler ve Görselleştirme**: Placeholder grafikler (gerçek uygulamada Chart.js veya benzeri kullanılabilir)
- **Authentication**: Kimlik bilgileri yerel depolama ile yönetilir (demo amaçlı)

## Başlangıç

### Gereksinimler
- Node.js (v14+)
- npm veya yarn

### Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/your-username/alms.git
cd alms
```

2. Bağımlılıkları yükleyin:
```bash
cd frontend
npm install
```

3. Uygulamayı başlatın:
```bash
npm run dev
```

4. Tarayıcınızda şu adresi açın: `http://localhost:5173`

## Demo Hesaplar

Uygulamayı test etmek için aşağıdaki hesapları kullanabilirsiniz:

### Yönetici Hesabı
- **E-posta**: admin@alms-system.com
- **Şifre**: admin123

### Çalışan Hesabı
- **E-posta**: employee@alms-system.com
- **Şifre**: employee123

## Proje Yapısı

```
frontend/
├── public/
├── src/
│   ├── components/        # Yeniden kullanılabilir bileşenler
│   ├── context/           # Context API kullanılan dosyalar
│   ├── pages/             # Sayfa bileşenleri
│   ├── services/          # API servisleri ve yardımcı fonksiyonlar
│   ├── theme/             # Chakra UI tema yapılandırması
│   ├── App.jsx            # Ana uygulama bileşeni
│   └── main.jsx           # Uygulama giriş noktası
└── package.json
```

## Sayfalar ve İşlevleri

### 1. Dashboard (Ana Sayfa)
Ana gösterge paneli, kullanıcının rolüne göre kişiselleştirilmiş özet bilgiler sunar.

### 2. Performans Sayfası
Kullanıcının veya şirketin performans metriklerini detaylı olarak gösterir.

### 3. Eğitim Önerileri Sayfası
Performans analizine dayalı kişiselleştirilmiş eğitim önerileri sunar.

### 4. Çalışan Yönetimi (Sadece Yöneticiler)
Tüm çalışanların performans ve gelişim takibi için kapsamlı arayüz.

### 5. Raporlar (Sadece Yöneticiler)
Özelleştirilebilir raporlar oluşturma ve indirme imkanı.

### 6. Analiz (Sadece Yöneticiler)
İleri düzey veri analizleri ve görselleştirmeler.

## Katkıda Bulunma

1. Projeyi fork edin
2. Özellik branchi oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## İletişim

Proje Sahibi: [İsim Soyisim](mailto:email@example.com)

Proje Linki: [https://github.com/your-username/alms](https://github.com/your-username/alms) 