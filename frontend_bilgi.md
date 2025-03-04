
***Frontend Planlama (Tüm Çıktılar İçin)***


1. Ana Sayfa (Landing Page)
Bu sayfa, şirket yöneticileri ve çalışanlar için giriş noktasıdır. Hizmetlerinizi tanıtan ve kullanıcıları sisteme çekmek için tasarlanır.

Çıktılar:
Hizmet Tanıtımı:
Performans analizi, eğitim önerileri ve raporlama hizmetlerinin kısa açıklamaları.
Şirketler için nasıl fayda sağlayacağına dair bilgiler.
Kayıt/Giriş Butonları:
Şirket yöneticileri için "Ücretsiz Deneme Başlat" butonu.
Çalışanlar için "Giriş Yap" butonu.

2. Kayıt ve Giriş Sayfaları
Şirket Yöneticisi İçin Kayıt Formu:
Form Alanları:
Şirket adı
Departman sayısı
Çalışan sayısı
Yönetici e-posta adresi
Şifre
Çıktılar:
Kayıt işlemi tamamlandıktan sonra, yöneticiye bir onay e-postası gönderilir.
Ücretsiz deneme hesabı oluşturulur ve yönetici dashboard'a yönlendirilir.
Çalışanlar İçin Giriş Formu:
Form Alanları:
Çalışan e-posta adresi
Şifre (şirket yöneticisi tarafından sağlanan)
Çıktılar:
Giriş başarılı olursa, çalışan kendi performans paneline yönlendirilir.

3. Şirket Yöneticisi Paneli (Dashboard)
Genel Görünüm:
Üst Kısım (Header):
Şirket logosu veya ismi.
Çıkış yap butonu.
Sol Menü (Sidebar):
Dashboard
Çalışanlar
Raporlar
Eğitim Önerileri
Ayarlar
Ana İçerik Alanı:
Genel Performans Göstergeleri:
Ortalama e-posta yanıt süresi (dakika cinsinden).
Görev tamamlama oranı (%).
Toplam e-posta gönderme sayısı.
Katılan toplantı sayısı.
Filtreleme Seçenekleri:
Tarih aralığı (haftalık, aylık, yıllık).
Departman bazlı filtreleme.
Metrikler (e-posta yanıt süresi, görev tamamlama oranı, toplantı katılımı).
Grafikler:
Haftalık trendler (çizgi grafikleri).
Departman bazlı performans karşılaştırması (çubuk grafikleri).
Mevsimsellik analizi (pasta grafikleri).
PDF Rapor İndirme:
Her çalışan veya departman için detaylı performans raporu indirme butonu.
Eğitim Önerileri:
Çalışanlara yönelik eğitim önerileri listesi.
Microsoft Learn API'sinden alınan kurs başlıkları ve URL'leri.
Kümeleme Analizi Sonuçları:
Optimal küme sayısı ve her kümenin özellikleri (PCA sonuçları ile görselleştirme).
Öngörücü Analiz:
Gelecekteki performans tahminleri (Prophet modeli ile).
Görev tamamlama, e-posta gönderme ve toplantı katılımının tahmini değerleri.
Duygu Analizi:
Çalışanların duygu skorları (pozitif, negatif, nötr).
Duygu analizi sonuçlarının metin bazlı açıklamaları.
4. Çalışan Paneli
Genel Görünüm:
Üst Kısım (Header):
Çalışan ismi ve fotoğrafı.
Çıkış yap butonu.
Sol Menü (Sidebar):
Performans Analizi
Eğitim Önerileri
Takım İstatistikleri (opsiyonel)
Ana İçerik Alanı:
Kişisel Performans Analizi:
Ortalama e-posta yanıt süresi (dakika cinsinden).
Görev tamamlama oranı (%).
Toplam e-posta gönderme sayısı.
Katılan toplantı sayısı.
Trend Analizi:
Günlük/haftalık performans değişimi (çizgi grafikleri).
Görev tamamlama oranının zaman içindeki gelişimi.
Eğitim Önerileri:
Kişiselleştirilmiş eğitim önerileri.
Microsoft Learn API'sinden alınan kurs başlıkları ve URL'leri.
Eğitim kaydetme özelliği (tamamlandı olarak işaretlenebilir).
Takım Bazlı İstatistikler (Opsiyonel):
Takımın ortalama performansı.
Departman bazlı genel istatistikler.
Gelişim Takibi:
Zaman içindeki performans değişim oranı.
Verimlilik skoru (görev tamamlama, e-posta gönderme, toplantı katılımına göre hesaplanır).

5. Responsive Tasarım
Frontend, mobil cihazlar, tabletler ve masaüstü bilgisayarlar için uyumlu bir tasarım sunmalıdır. Bu amaçla:

CSS Framework: Bootstrap veya Tailwind CSS kullanılabilir.
Düzen Ayarları:
Mobil cihazlarda menüler hamburger menü şeklinde daraltılır.
Grafikler ve tablolar daha küçük ekranlarda otomatik olarak yeniden boyutlandırılır.

6. Ekran Görüntüleri ve Çıktı Örnekleri
Ana Sayfa:
Büyük bir banner ile hizmetlerinizi tanıtan bir görsel.
Alt kısımda özellikler listesi ve kayıt/giriş butonları.
Dashboard:
Sol tarafta menü, sağ tarafta ise grafikler ve filtreleme seçenekleri.
PDF indirme butonu, üst kısımda belirgin bir şekilde yer alır.
Çalışan Paneli:
Sol tarafta menü, sağ tarafta ise kişisel performans analizi ve eğitim önerileri.
Eğitim önerileri altında kurs başlıkları ve URL'ler listelenir.

7. Teknik Detaylar
Framework: React.js veya Vue.js gibi modern JavaScript framework'leri kullanılabilir.
Stil: Bootstrap veya Tailwind CSS ile hızlı bir şekilde responsive tasarım oluşturulabilir.
API Entegrasyonu:
Backend'deki API endpoint'leri (örneğin /api/analyze, /api/recommendations) Axios veya Fetch API ile çağrılabilir.
Grafikler:
Chart.js veya D3.js gibi kütüphaneler kullanılabilir.

8. Örnek Kullanım Senaryosu
Şirket Yöneticisi:
Dashboard üzerinden tüm çalışanların performansını izler.
Filtreleme seçenekleriyle departman bazlı analiz yapar.
PDF rapor indirerek detaylı inceleme yapar.
Eğitim önerilerini görür ve çalışanlara atar.
Çalışan:
Kendi performansını izler.
Kişiselleştirilmiş eğitim önerilerini görür ve kurslara kaydolur.
Takım bazlı istatistiklere erişir