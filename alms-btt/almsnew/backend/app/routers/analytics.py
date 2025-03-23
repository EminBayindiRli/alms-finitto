from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..models.models import User, PerformanceMetric
from ..utils.database import get_db
from ..services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
    responses={404: {"description": "Not found"}},
)

@router.get("/metrics/{user_id}")
async def get_user_metrics(user_id: str, db: Session = Depends(get_db)):
    """
    Belirli bir kullanıcının performans metriklerini döndürür.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    analytics_service = AnalyticsService(db)
    metrics = db.query(PerformanceMetric).filter(PerformanceMetric.user_id == user_id).all()
    
    return metrics

@router.get("/recommendations/{user_id}")
async def get_recommendations(user_id: str, db: Session = Depends(get_db)):
    """
    Kullanıcı için eğitim önerileri getirir.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    
    analytics_service = AnalyticsService(db)
    recommendations = analytics_service.generate_recommendations(user_id)
    
    return recommendations 