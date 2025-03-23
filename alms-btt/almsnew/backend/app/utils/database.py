from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv
import urllib.parse
import pyodbc
import platform
import msal

# .env dosyasından ortam değişkenlerini yükle
load_dotenv()

# ODBC sürücülerini görüntüle
print("Python sürümü:", platform.python_version())
print("Platform:", platform.platform())
print("ODBCSYSINI:", os.environ.get("ODBCSYSINI", "Tanımlanmamış"))
print("ODBCINI:", os.environ.get("ODBCINI", "Tanımlanmamış"))
print("DYLD_LIBRARY_PATH:", os.environ.get("DYLD_LIBRARY_PATH", "Tanımlanmamış"))

try:
    drivers = pyodbc.drivers()
    print("Kullanılabilir ODBC sürücüleri:", drivers)
except Exception as e:
    print("ODBC sürücüleri listelenirken hata oluştu:", e)

# Azure AD kimlik bilgileri
client_id = os.environ.get("AZURE_CLIENT_ID")
client_secret = os.environ.get("AZURE_CLIENT_SECRET")
tenant_id = os.environ.get("AZURE_TENANT_ID")
azure_username = "almsproje@gmail.com"  # Azure AD kullanıcı adı

# Bağlantı parametreleri
server = "alms-db-server.database.windows.net"
database = "almss-db"
driver = "ODBC Driver 18 for SQL Server"

# SQL kimlik doğrulaması - yedek olarak kullanılacak
sql_username = "almsadmin"
sql_password = "Alms!631234"  # Güncellenen şifre

try:
    print("Azure Entra (Active Directory) kimlik doğrulaması deneniyor...")
    
    # Basitleştirilmiş bağlantı - doğrudan Azure AD kullanıcı adı ile
    odbc_conn_str = f"DRIVER={{{driver}}};SERVER={server};PORT=1433;DATABASE={database};UID={azure_username};Authentication=ActiveDirectoryInteractive;Encrypt=yes;TrustServerCertificate=yes;Connection Timeout=60;"
    conn_str = f"mssql+pyodbc:///?odbc_connect={urllib.parse.quote_plus(odbc_conn_str)}"
    
    print(f"Azure AD bağlantı dizesi: {conn_str}")
    
except Exception as e:
    print(f"Azure Entra kimlik doğrulaması hazırlanırken hata: {e}")
    print("Yedek olarak standart SQL kimlik doğrulaması kullanılıyor...")
    odbc_conn_str = f"DRIVER={{{driver}}};SERVER={server};PORT=1433;DATABASE={database};UID={sql_username};PWD={sql_password};Encrypt=yes;TrustServerCertificate=yes;Connection Timeout=60;"
    conn_str = f"mssql+pyodbc:///?odbc_connect={urllib.parse.quote_plus(odbc_conn_str)}"
    print(f"SQL kimlik doğrulama bağlantı dizesi: {conn_str.replace(sql_password, '********')}")

# Veritabanı bağlantı hatası olursa başka bir yaklaşım dene
try:
    # SQLAlchemy motorunu oluştur
    engine = create_engine(conn_str, pool_timeout=60, connect_args={"timeout": 60})
    
    # Test için bağlantıyı doğrula
    with engine.connect() as connection:
        print("Veritabanı bağlantısı başarılı!")
        
except Exception as e:
    print(f"İlk bağlantı denemesi başarısız: {e}")
    print("Yedek SQL kimlik doğrulaması ile tekrar deneniyor...")
    
    # Yedek SQL kimlik doğrulaması
    odbc_conn_str = f"DRIVER={{{driver}}};SERVER={server};PORT=1433;DATABASE={database};UID={sql_username};PWD={sql_password};Encrypt=yes;TrustServerCertificate=yes;Connection Timeout=60;"
    conn_str = f"mssql+pyodbc:///?odbc_connect={urllib.parse.quote_plus(odbc_conn_str)}"
    engine = create_engine(conn_str, pool_timeout=60, connect_args={"timeout": 60})
    print("Yedek bağlantı dizesi kullanılıyor")

# Oturum oluşturucu
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Taban sınıfı
Base = declarative_base()

# Dependency için fonksiyon
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 