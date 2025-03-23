from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from ..models.models import User
from ..utils.database import get_db

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/")
async def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Tüm kullanıcıları listeler.
    """
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/{user_id}")
async def read_user(user_id: str, db: Session = Depends(get_db)):
    """
    Belirli bir kullanıcının bilgilerini getirir.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return user 