from sqlalchemy import Column, String, DateTime, ForeignKey, Float, Boolean, Text
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime

from ..utils.database import Base

class Tenant(Base):
    __tablename__ = "tenants"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    azure_tenant_id = Column(String(255), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # İlişkiler
    users = relationship("User", back_populates="tenant")
    activity_logs = relationship("ActivityLog", back_populates="tenant")
    performance_metrics = relationship("PerformanceMetric", back_populates="tenant")

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String(36), ForeignKey("tenants.id"))
    azure_user_id = Column(String(255), unique=True, nullable=False)
    email = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    department = Column(String(255))
    role = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # İlişkiler
    tenant = relationship("Tenant", back_populates="users")
    activity_logs = relationship("ActivityLog", back_populates="user")
    performance_metrics = relationship("PerformanceMetric", back_populates="user")
    course_recommendations = relationship("CourseRecommendation", back_populates="user")

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String(36), ForeignKey("tenants.id"))
    user_id = Column(String(36), ForeignKey("users.id"))
    activity_type = Column(String(50), nullable=False)
    activity_data = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # İlişkiler
    tenant = relationship("Tenant", back_populates="activity_logs")
    user = relationship("User", back_populates="activity_logs")

class PerformanceMetric(Base):
    __tablename__ = "performance_metrics"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tenant_id = Column(String(36), ForeignKey("tenants.id"))
    user_id = Column(String(36), ForeignKey("users.id"))
    metric_type = Column(String(50), nullable=False)
    metric_value = Column(Float, nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # İlişkiler
    tenant = relationship("Tenant", back_populates="performance_metrics")
    user = relationship("User", back_populates="performance_metrics")

class CourseRecommendation(Base):
    __tablename__ = "course_recommendations"
    
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"))
    course_id = Column(String(255), nullable=False)
    course_title = Column(String(255), nullable=False)
    course_url = Column(String(512), nullable=False)
    recommendation_score = Column(Float, nullable=False)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # İlişkiler
    user = relationship("User", back_populates="course_recommendations") 