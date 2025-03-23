import redis
import json
import os
from dotenv import load_dotenv
import logging
from functools import wraps
from typing import Optional, Any, Callable

# .env dosyasından ortam değişkenlerini yükle
load_dotenv()

# Redis yapılandırmasını ortam değişkenlerinden al
REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = int(os.environ.get("REDIS_PORT", 6380))
REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")
REDIS_SSL = os.environ.get("REDIS_SSL", "True").lower() in ["true", "1", "t", "y", "yes"]

# Varsayılan cache süresi (saniye cinsinden)
DEFAULT_CACHE_TTL = 3600  # 1 saat

# Logger yapılandırması
logger = logging.getLogger(__name__)

# Redis istemcisi oluştur
try:
    redis_client = redis.Redis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        password=REDIS_PASSWORD,
        ssl=REDIS_SSL,
        decode_responses=True
    )
    # Bağlantıyı kontrol et
    if redis_client.ping():
        logger.info("Redis Cache'e başarıyla bağlandı")
    else:
        logger.warning("Redis Cache bağlantısı başarısız oldu")
        redis_client = None
except Exception as e:
    logger.error(f"Redis Cache bağlantısı sırasında hata oluştu: {e}")
    redis_client = None


def get_from_cache(key: str) -> Optional[Any]:
    """
    Redis Cache'den veri alır.
    
    Args:
        key: Önbellek anahtarı
        
    Returns:
        Önbellekteki veri veya None (eğer veri bulunamazsa)
    """
    if not redis_client:
        return None
    
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception as e:
        logger.error(f"Cache'den veri alınırken hata oluştu: {e}")
        return None


def set_to_cache(key: str, value: Any, expire_time: int = DEFAULT_CACHE_TTL) -> bool:
    """
    Redis Cache'e veri kaydeder.
    
    Args:
        key: Önbellek anahtarı
        value: Kaydedilecek veri
        expire_time: Önbellek süresi (saniye cinsinden)
        
    Returns:
        İşlem başarılı ise True, değilse False
    """
    if not redis_client:
        return False
    
    try:
        redis_client.set(key, json.dumps(value), ex=expire_time)
        return True
    except Exception as e:
        logger.error(f"Cache'e veri kaydedilirken hata oluştu: {e}")
        return False


def delete_from_cache(key: str) -> bool:
    """
    Redis Cache'den veri siler.
    
    Args:
        key: Önbellek anahtarı
        
    Returns:
        İşlem başarılı ise True, değilse False
    """
    if not redis_client:
        return False
    
    try:
        redis_client.delete(key)
        return True
    except Exception as e:
        logger.error(f"Cache'den veri silinirken hata oluştu: {e}")
        return False


def cached(expire_time: int = DEFAULT_CACHE_TTL):
    """
    Fonksiyon sonuçlarını önbelleklemek için dekoratör.
    
    Args:
        expire_time: Önbellek süresi (saniye cinsinden)
        
    Returns:
        Dekoratör fonksiyonu
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Önbellek anahtarı oluştur
            cache_key = f"{func.__name__}:{str(args)}:{str(kwargs)}"
            
            # Önbellekte veri var mı kontrol et
            cached_data = get_from_cache(cache_key)
            if cached_data is not None:
                logger.debug(f"Önbellekten veri alındı: {cache_key}")
                return cached_data
            
            # Önbellekte veri yoksa fonksiyonu çalıştır
            result = await func(*args, **kwargs)
            
            # Sonucu önbelleğe kaydet
            set_to_cache(cache_key, result, expire_time)
            logger.debug(f"Veri önbelleğe kaydedildi: {cache_key}")
            
            return result
        return wrapper
    return decorator 