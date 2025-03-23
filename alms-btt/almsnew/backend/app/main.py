from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import time

from .utils.database import engine, Base, get_db, SessionLocal
from .utils.redis_cache import redis_client, get_from_cache, set_to_cache
from .models import models
from .routers import users, analytics, auth

# Veritabanı tablolarını oluştur
print("Veritabanı tablolarını oluşturmaya çalışıyor...")
max_attempts = 3
current_attempt = 0

while current_attempt < max_attempts:
    try:
        Base.metadata.create_all(bind=engine)
        print("Veritabanı tabloları başarıyla oluşturuldu!")
        break
    except Exception as e:
        current_attempt += 1
        if current_attempt < max_attempts:
            print(f"Veritabanı bağlantı hatası (Deneme {current_attempt}/{max_attempts}): {e}")
            print(f"{10} saniye sonra tekrar denenecek...")
            time.sleep(10)
        else:
            print(f"Veritabanı tabloları oluşturulamadı: {e}")
            print("API veritabanı bağlantısı olmadan çalışacak, veri kaydetme işlemleri gerçekleşmeyecek.")

# Redis bağlantısını kontrol et
if redis_client:
    try:
        if redis_client.ping():
            print("Redis Cache bağlantısı başarılı!")
            # Test için önbelleğe veri ekle
            set_to_cache("test_key", {"status": "ok"}, 300)
            test_data = get_from_cache("test_key")
            if test_data and test_data.get("status") == "ok":
                print("Redis Cache test: Başarılı ✅")
            else:
                print("Redis Cache veri testi başarısız ❌")
        else:
            print("Redis Cache bağlantısı başarısız ❌")
    except Exception as e:
        print(f"Redis Cache kontrol hatası: {e}")
else:
    print("Redis Cache bağlantısı kurulmadı ❌")

app = FastAPI(
    title="ALMS API",
    description="Analitik Öğrenme Yönetim Sistemi API",
    version="0.1.0"
)

# CORS yapılandırması
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Geliştirme aşamasında * kullanılabilir, üretimde güncellenmeli
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router'ları dahil et
app.include_router(users.router)
app.include_router(analytics.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "ALMS API'ye Hoş Geldiniz!"}

@app.get("/health")
async def health_check():
    db_status = "connected"
    redis_status = "connected"
    
    # Veritabanı bağlantısını kontrol et
    try:
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
    except Exception:
        db_status = "disconnected"
    
    # Redis bağlantısını kontrol et
    if not redis_client or not redis_client.ping():
        redis_status = "disconnected"
    
    return {
        "status": "healthy",
        "database": db_status,
        "redis": redis_status,
        "version": "0.1.0"
    } 