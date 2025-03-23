import requests
import os
import json
from dotenv import load_dotenv
from datetime import datetime, timedelta
import msal

# .env dosyasını yükle
load_dotenv()

class GraphService:
    def __init__(self):
        self.client_id = os.getenv("AZURE_CLIENT_ID")
        self.client_secret = os.getenv("AZURE_CLIENT_SECRET")
        self.tenant_id = os.getenv("AZURE_TENANT_ID")
        self.authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        self.scope = ["https://graph.microsoft.com/.default"]
        self.endpoint = "https://graph.microsoft.com/v1.0"
        
        # MSAL uygulaması oluştur
        self.app = msal.ConfidentialClientApplication(
            self.client_id,
            authority=self.authority,
            client_credential=self.client_secret
        )
    
    def get_token(self):
        """
        Azure AD'den bir erişim belirteci alır.
        """
        result = self.app.acquire_token_for_client(scopes=self.scope)
        
        if "access_token" in result:
            return result["access_token"]
        else:
            print(f"Token alamadı. Hata: {result.get('error')}")
            print(f"Hata açıklaması: {result.get('error_description')}")
            raise Exception(f"Token alınamadı: {result.get('error_description')}")
    
    def make_request(self, endpoint, method="GET", data=None, params=None):
        """
        Microsoft Graph API'ye bir istek yapar.
        """
        token = self.get_token()
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        url = f"{self.endpoint}/{endpoint}"
        
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            response = requests.post(url, headers=headers, json=data)
        elif method == "PATCH":
            response = requests.patch(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Geçersiz HTTP metodu: {method}")
        
        if response.status_code >= 400:
            print(f"Hata: {response.status_code}")
            print(f"Yanıt: {response.text}")
            raise Exception(f"API isteği başarısız: {response.status_code} - {response.text}")
        
        return response.json() if response.text else None
    
    def get_users(self, tenant_id=None):
        """
        Tüm kullanıcıları getirir.
        """
        return self.make_request("users")
    
    def get_user(self, user_id):
        """
        Belirli bir kullanıcıyı getirir.
        """
        return self.make_request(f"users/{user_id}")
    
    def get_user_emails(self, user_id, period_days=30):
        """
        Belirli bir kullanıcının e-postalarını getirir.
        """
        # Son 30 günün e-postaları
        date_from = (datetime.now() - timedelta(days=period_days)).isoformat()
        
        query_params = {
            "$filter": f"receivedDateTime ge {date_from}",
            "$orderby": "receivedDateTime DESC",
            "$top": 100
        }
        
        return self.make_request(f"users/{user_id}/messages", params=query_params)
    
    def get_user_calendar(self, user_id, period_days=30):
        """
        Belirli bir kullanıcının takvim etkinliklerini getirir.
        """
        # Son 30 günün etkinlikleri
        date_from = (datetime.now() - timedelta(days=period_days)).isoformat()
        date_to = datetime.now().isoformat()
        
        query_params = {
            "$filter": f"start/dateTime ge '{date_from}' and end/dateTime le '{date_to}'",
            "$orderby": "start/dateTime DESC"
        }
        
        return self.make_request(f"users/{user_id}/calendar/events", params=query_params)
    
    def get_user_teams_activity(self, user_id):
        """
        Belirli bir kullanıcının Teams aktivitelerini getirir.
        """
        # Teams aktiviteleri için beta API'yi kullanmamız gerekiyor
        # Bu örnekte basitleştirme amaçlı olarak katıldığı takımları alıyoruz
        return self.make_request(f"users/{user_id}/joinedTeams") 