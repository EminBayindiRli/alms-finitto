import numpy as np
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..models.models import User, PerformanceMetric, ActivityLog, CourseRecommendation
import uuid
import json

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_communication_metrics(self, user_id, email_data, calendar_data):
        """
        E-posta ve takvim verilerine dayalı iletişim metrikleri hesaplar.
        """
        metrics = {}
        
        # E-posta yanıt süresi
        if email_data and "value" in email_data and len(email_data["value"]) > 0:
            response_times = []
            
            for email in email_data["value"]:
                if "conversationId" in email and "receivedDateTime" in email:
                    # Yanıt e-postalarını bul
                    conversation_id = email["conversationId"]
                    related_emails = [e for e in email_data["value"] if e.get("conversationId") == conversation_id]
                    
                    if len(related_emails) > 1:
                        # E-postaları tarih sırasına göre sırala
                        related_emails.sort(key=lambda x: x["receivedDateTime"])
                        
                        for i in range(1, len(related_emails)):
                            received = datetime.fromisoformat(related_emails[i-1]["receivedDateTime"].replace("Z", "+00:00"))
                            replied = datetime.fromisoformat(related_emails[i]["receivedDateTime"].replace("Z", "+00:00"))
                            
                            if related_emails[i]["from"]["emailAddress"]["address"] == user_id:
                                # Kullanıcı yanıt vermiş
                                response_time = (replied - received).total_seconds() / 3600  # Saat cinsinden
                                response_times.append(response_time)
            
            if response_times:
                metrics["email_response_time"] = np.mean(response_times)
                metrics["email_response_time_score"] = self._normalize_score(metrics["email_response_time"], 0, 48, inverse=True)
            
        # Toplantı katılım oranı
        if calendar_data and "value" in calendar_data and len(calendar_data["value"]) > 0:
            attended = 0
            total = len(calendar_data["value"])
            
            for event in calendar_data["value"]:
                if "attendees" in event:
                    for attendee in event["attendees"]:
                        if attendee["emailAddress"]["address"] == user_id and attendee.get("status", {}).get("response") == "accepted":
                            attended += 1
                            break
            
            if total > 0:
                metrics["meeting_attendance_rate"] = attended / total
                metrics["meeting_attendance_score"] = self._normalize_score(metrics["meeting_attendance_rate"], 0, 1)
        
        return metrics
    
    def calculate_productivity_metrics(self, teams_data, sharepoint_data=None):
        """
        Teams ve SharePoint verilerine dayalı üretkenlik metrikleri hesaplar.
        """
        metrics = {}
        
        # Teams aktivite skoru
        if teams_data and "value" in teams_data and len(teams_data["value"]) > 0:
            team_count = len(teams_data["value"])
            metrics["teams_count"] = team_count
            metrics["teams_activity_score"] = self._normalize_score(team_count, 0, 10)
        
        # SharePoint için benzer metrikler eklenebilir
        
        return metrics
    
    def calculate_overall_performance(self, communication_metrics, productivity_metrics):
        """
        Tüm metrikleri birleştirerek genel performans skoru hesaplar.
        """
        # Ağırlıklar
        weights = {
            "email_response_time_score": 0.3,
            "meeting_attendance_score": 0.3,
            "teams_activity_score": 0.4
        }
        
        all_metrics = {**communication_metrics, **productivity_metrics}
        total_score = 0
        total_weight = 0
        
        for metric, weight in weights.items():
            if metric in all_metrics:
                total_score += all_metrics[metric] * weight
                total_weight += weight
        
        if total_weight > 0:
            return total_score / total_weight
        else:
            return 0
    
    def store_metrics(self, tenant_id, user_id, metrics):
        """
        Hesaplanan metrikleri veritabanına kaydeder.
        """
        period_end = datetime.utcnow()
        period_start = period_end - timedelta(days=30)
        
        for metric_type, metric_value in metrics.items():
            performance_metric = PerformanceMetric(
                id=uuid.uuid4(),
                tenant_id=tenant_id,
                user_id=user_id,
                metric_type=metric_type,
                metric_value=float(metric_value),
                period_start=period_start,
                period_end=period_end
            )
            
            self.db.add(performance_metric)
        
        self.db.commit()
    
    def store_activity(self, tenant_id, user_id, activity_type, activity_data):
        """
        Kullanıcı aktivitesini kaydeder.
        """
        activity_log = ActivityLog(
            id=uuid.uuid4(),
            tenant_id=tenant_id,
            user_id=user_id,
            activity_type=activity_type,
            activity_data=json.dumps(activity_data)
        )
        
        self.db.add(activity_log)
        self.db.commit()
    
    def _normalize_score(self, value, min_value, max_value, inverse=False):
        """
        Bir değeri 0-1 aralığında normalize eder.
        inverse=True ise, düşük değerler daha iyi olarak değerlendirilir.
        """
        if value is None:
            return 0
        
        if inverse:
            # Düşük değer daha iyi (örn. yanıt süresi)
            if value <= min_value:
                return 1.0
            elif value >= max_value:
                return 0.0
            else:
                return 1.0 - ((value - min_value) / (max_value - min_value))
        else:
            # Yüksek değer daha iyi (örn. katılım oranı)
            if value <= min_value:
                return 0.0
            elif value >= max_value:
                return 1.0
            else:
                return (value - min_value) / (max_value - min_value) 
    
    def generate_recommendations(self, user_id):
        """
        Kullanıcı için eğitim önerileri oluşturur.
        """
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        
        # Kullanıcının mevcut metriklerini al
        metrics = self.db.query(PerformanceMetric).filter(PerformanceMetric.user_id == user_id).all()
        
        # Metriklerden düşük performans alanlarını belirle
        weak_areas = []
        for metric in metrics:
            if metric.metric_type.endswith("_score") and metric.metric_value < 0.6:
                weak_areas.append(metric.metric_type.replace("_score", ""))
        
        # Örnek öneriler (gerçek bir ortamda Microsoft Learn API veya başka eğitim API'ları kullanılabilir)
        recommendation_catalog = {
            "email_response_time": {
                "title": "Etkili E-posta Yönetimi",
                "url": "https://learn.microsoft.com/tr-tr/training/modules/email-management/",
                "score": 0.85
            },
            "meeting_attendance": {
                "title": "Toplantı Planlaması ve Katılımı",
                "url": "https://learn.microsoft.com/tr-tr/training/modules/meeting-skills/",
                "score": 0.80
            },
            "teams_activity": {
                "title": "Microsoft Teams İleri Düzey Kullanımı",
                "url": "https://learn.microsoft.com/tr-tr/training/modules/advanced-teams/",
                "score": 0.90
            }
        }
        
        # Öneriler oluştur
        recommendations = []
        for area in weak_areas:
            if area in recommendation_catalog:
                course = recommendation_catalog[area]
                
                # Veritabanına kaydet
                course_recommendation = CourseRecommendation(
                    id=str(uuid.uuid4()),
                    user_id=user_id,
                    course_id=f"course-{area}",
                    course_title=course["title"],
                    course_url=course["url"],
                    recommendation_score=course["score"],
                    is_completed=False
                )
                self.db.add(course_recommendation)
                recommendations.append(course_recommendation)
        
        if recommendations:
            self.db.commit()
        
        return recommendations 