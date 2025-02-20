import random
from faker import Faker
from datetime import datetime, timedelta
import json
from supabase import create_client

# Supabase yapılandırması
SUPABASE_URL = "https://oyzqnkdivklvbolyoziz.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95enFua2RpdmtsdmJvbHlveml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODkxMjAsImV4cCI6MjA1NTY2NTEyMH0.R4AayXQ7ubfOqBW2ZW23w_J_Kt9qz2saLSNgreu-Kis"

# Supabase istemcisini oluştur
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Yapay veri üretme fonksiyonları
NUM_EMPLOYEES = 20  # Çalışan sayısını azalttık
NUM_TEAMS = 5
NUM_DEPARTMENTS = 3
DAYS_IN_WEEK = 7

DEPARTMENTS = ["Sales", "Product Development", "HR"]
TEAMS = [f"Team-{i+1}" for i in range(NUM_TEAMS)]

def get_performance_profile(employee_id):
    """Çalışan ID'sine göre performans profili döndürür"""
    if employee_id <= 5:  # Yüksek performans
        return {
            # Outlook verileri
            "email": {
                "sent_count": (25, 40),  # Günlük gönderilen e-posta
                "response_time": (10, 30),  # Dakika cinsinden yanıt süresi
                "read_rate": (0.8, 0.95),  # Okunan e-posta oranı
                "focus_hours": (3, 5)  # Günlük odaklanma saatleri
            },
            # Teams verileri
            "teams": {
                "meetings_attended": (3, 5),  # Günlük toplantı sayısı
                "meeting_duration": (30, 60),  # Dakika cinsinden ortalama toplantı süresi
                "chat_messages": (40, 60),  # Günlük mesaj sayısı
                "reaction_count": (10, 20),  # Emojiler, beğeniler vs.
                "camera_on_ratio": (0.7, 0.9)  # Kamera açık olma oranı
            },
            # SharePoint/OneDrive verileri
            "document": {
                "files_accessed": (15, 25),  # Erişilen dosya sayısı
                "files_edited": (8, 12),  # Düzenlenen dosya sayısı
                "comments_made": (5, 10),  # Yapılan yorum sayısı
                "shared_files": (3, 6),  # Paylaşılan dosya sayısı
                "file_types": {
                    "excel": (0.4, 0.5),  # Dosya türü dağılım oranları
                    "word": (0.2, 0.3),
                    "powerpoint": (0.2, 0.3),
                    "other": (0.1, 0.2)
                }
            },
            # Planner/Tasks verileri
            "tasks": {
                "assigned": (8, 12),  # Atanan görev sayısı
                "completed": (7, 10),  # Tamamlanan görev sayısı
                "completion_time": (60, 120),  # Dakika cinsinden ortalama tamamlama süresi
                "overdue_ratio": (0.1, 0.2)  # Geciken görev oranı
            }
        }
    elif employee_id <= 10:  # Düşük performans
        return {
            "email": {
                "sent_count": (5, 15),
                "response_time": (120, 240),
                "read_rate": (0.3, 0.5),
                "focus_hours": (1, 2)
            },
            "teams": {
                "meetings_attended": (1, 2),
                "meeting_duration": (45, 90),
                "chat_messages": (10, 20),
                "reaction_count": (2, 5),
                "camera_on_ratio": (0.2, 0.4)
            },
            "document": {
                "files_accessed": (5, 10),
                "files_edited": (2, 4),
                "comments_made": (1, 3),
                "shared_files": (1, 2),
                "file_types": {
                    "excel": (0.3, 0.4),
                    "word": (0.3, 0.4),
                    "powerpoint": (0.1, 0.2),
                    "other": (0.1, 0.2)
                }
            },
            "tasks": {
                "assigned": (6, 8),
                "completed": (2, 4),
                "completion_time": (180, 240),
                "overdue_ratio": (0.4, 0.6)
            }
        }
    elif employee_id <= 15:  # Orta performans
        return {
            "email": {
                "sent_count": (15, 25),
                "response_time": (30, 90),
                "read_rate": (0.5, 0.7),
                "focus_hours": (2, 4)
            },
            "teams": {
                "meetings_attended": (2, 4),
                "meeting_duration": (30, 75),
                "chat_messages": (20, 40),
                "reaction_count": (5, 10),
                "camera_on_ratio": (0.4, 0.6)
            },
            "document": {
                "files_accessed": (10, 20),
                "files_edited": (5, 8),
                "comments_made": (3, 6),
                "shared_files": (2, 4),
                "file_types": {
                    "excel": (0.3, 0.4),
                    "word": (0.2, 0.3),
                    "powerpoint": (0.2, 0.3),
                    "other": (0.2, 0.3)
                }
            },
            "tasks": {
                "assigned": (7, 10),
                "completed": (5, 7),
                "completion_time": (120, 180),
                "overdue_ratio": (0.2, 0.4)
            }
        }
    else:  # Dengesiz performans
        return {
            "email": {
                "sent_count": (30, 45),  # İyi e-posta performansı
                "response_time": (15, 45),
                "read_rate": (0.6, 0.8),
                "focus_hours": (2, 5)  # Değişken
            },
            "teams": {
                "meetings_attended": (1, 2),  # Düşük toplantı katılımı
                "meeting_duration": (60, 120),
                "chat_messages": (50, 70),  # Yüksek chat aktivitesi
                "reaction_count": (15, 25),
                "camera_on_ratio": (0.3, 0.7)  # Değişken
            },
            "document": {
                "files_accessed": (20, 30),  # Yüksek dosya erişimi
                "files_edited": (3, 6),  # Düşük düzenleme
                "comments_made": (8, 12),  # Yüksek yorum
                "shared_files": (4, 7),
                "file_types": {
                    "excel": (0.5, 0.6),  # Excel ağırlıklı
                    "word": (0.2, 0.3),
                    "powerpoint": (0.1, 0.2),
                    "other": (0.1, 0.2)
                }
            },
            "tasks": {
                "assigned": (7, 10),
                "completed": (3, 8),  # Değişken tamamlama
                "completion_time": (90, 210),  # Değişken süre
                "overdue_ratio": (0.3, 0.5)
            }
        }

def generate_daily_data(employee_id):
    profile = get_performance_profile(employee_id)
    
    # E-posta aktiviteleri (Outlook)
    email_data = {
        "sent_count": random.randint(*profile["email"]["sent_count"]),
        "response_time": random.randint(*profile["email"]["response_time"]),
        "read_rate": round(random.uniform(*profile["email"]["read_rate"]), 2),
        "focus_hours": round(random.uniform(*profile["email"]["focus_hours"]), 1)
    }
    
    # Teams aktiviteleri
    teams_data = {
        "meetings_attended": random.randint(*profile["teams"]["meetings_attended"]),
        "meeting_duration": random.randint(*profile["teams"]["meeting_duration"]),
        "chat_messages": random.randint(*profile["teams"]["chat_messages"]),
        "reaction_count": random.randint(*profile["teams"]["reaction_count"]),
        "camera_on_ratio": round(random.uniform(*profile["teams"]["camera_on_ratio"]), 2)
    }
    
    # Doküman aktiviteleri (SharePoint/OneDrive)
    doc_data = {
        "files_accessed": random.randint(*profile["document"]["files_accessed"]),
        "files_edited": random.randint(*profile["document"]["files_edited"]),
        "comments_made": random.randint(*profile["document"]["comments_made"]),
        "shared_files": random.randint(*profile["document"]["shared_files"])
    }
    
    # Dosya türü dağılımı
    file_types = {}
    total_files = doc_data["files_edited"]
    for ftype, (min_ratio, max_ratio) in profile["document"]["file_types"].items():
        ratio = random.uniform(min_ratio, max_ratio)
        file_types[ftype] = round(total_files * ratio)
    
    # Görev aktiviteleri (Planner/Tasks)
    tasks_data = {
        "assigned": random.randint(*profile["tasks"]["assigned"]),
        "completed": random.randint(*profile["tasks"]["completed"]),
        "completion_time": random.randint(*profile["tasks"]["completion_time"]),
        "overdue_ratio": round(random.uniform(*profile["tasks"]["overdue_ratio"]), 2)
    }
    
    # Hesaplanan metrikler
    productivity_metrics = {
        "task_completion_rate": round(tasks_data["completed"] / tasks_data["assigned"], 2),
        "meeting_efficiency": round(teams_data["meeting_duration"] / (8 * 60), 2),  # 8 saatlik güne oranı
        "communication_score": round((email_data["sent_count"] + teams_data["chat_messages"]) / 100, 2),
        "collaboration_score": round((doc_data["shared_files"] + doc_data["comments_made"]) / 20, 2)
    }

    return {
        # Outlook verileri
        "email_sent_count": email_data["sent_count"],
        "email_response_time": email_data["response_time"],
        "email_read_rate": email_data["read_rate"],
        "focus_hours": email_data["focus_hours"],
        
        # Teams verileri
        "meetings_attended": teams_data["meetings_attended"],
        "meeting_duration": teams_data["meeting_duration"],
        "chat_messages": teams_data["chat_messages"],
        "reaction_count": teams_data["reaction_count"],
        "camera_on_ratio": teams_data["camera_on_ratio"],
        
        # SharePoint/OneDrive verileri
        "files_accessed": doc_data["files_accessed"],
        "files_edited": doc_data["files_edited"],
        "comments_made": doc_data["comments_made"],
        "shared_files": doc_data["shared_files"],
        "file_types": file_types,
        
        # Planner/Tasks verileri
        "tasks_assigned": tasks_data["assigned"],
        "tasks_completed": tasks_data["completed"],
        "task_completion_time": tasks_data["completion_time"],
        "overdue_ratio": tasks_data["overdue_ratio"],
        
        # Hesaplanan metrikler
        "productivity_metrics": productivity_metrics
    }

def create_employees():
    """Çalışanları oluştur ve Supabase'e kaydet"""
    print("Çalışanlar oluşturuluyor...")
    for employee_id in range(1, NUM_EMPLOYEES + 1):
        department = random.choice(DEPARTMENTS)
        team = random.choice(TEAMS)
        
        # Çalışanı Supabase'e ekle
        data = supabase.table('employees').insert({
            "id": employee_id,
            "department": department,
            "team": team
        }).execute()
        
    print(f"{NUM_EMPLOYEES} çalışan oluşturuldu.")

def generate_weekly_data():
    """Haftalık veri üret ve Supabase'e kaydet"""
    print("Haftalık veriler oluşturuluyor...")
    
    for employee_id in range(1, NUM_EMPLOYEES + 1):
        for day in range(1, DAYS_IN_WEEK + 1):
            daily_data = generate_daily_data(employee_id)
            daily_data["employee_id"] = employee_id
            daily_data["day"] = day
            daily_data["file_types"] = json.dumps(daily_data["file_types"])  # JSONB için string'e çevir
            daily_data["productivity_metrics"] = json.dumps(daily_data["productivity_metrics"])  # JSONB için string'e çevir
            
            # Veriyi Supabase'e ekle
            data = supabase.table('employee_data').insert(daily_data).execute()
            
    print("Haftalık veriler başarıyla oluşturuldu ve kaydedildi.")

if __name__ == "__main__":
    try:
        # Önce çalışanları oluştur
        create_employees()
        
        # Sonra haftalık verileri oluştur
        generate_weekly_data()
        
        print("Tüm veriler başarıyla oluşturuldu ve Supabase'e yüklendi!")
        
    except Exception as e:
        print(f"Bir hata oluştu: {str(e)}")