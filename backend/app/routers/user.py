from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

router = APIRouter(prefix="/api/user", tags=["User"])

class UserProfileDTO(BaseModel):
    user_id: str
    name: str
    email: str
    wallet_address: Optional[str] = None
    date_of_birth: Optional[str] = None
    phone: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    chronic_conditions: Optional[str] = None

class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    date_of_birth: Optional[str] = None
    phone: Optional[str] = None
    blood_type: Optional[str] = None
    allergies: Optional[str] = None
    medications: Optional[str] = None
    chronic_conditions: Optional[str] = None

class ActivityDTO(BaseModel):
    id: int
    type: str
    text: str
    time: str

class HealthVaultItemDTO(BaseModel):
    id: int
    name: str
    date: str
    type: str

@router.get("/profile", response_model=UserProfileDTO)
async def get_user_profile(user_id: str = "test123", db: Session = Depends(get_db)):
    """
    Get user profile information
    """
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    
    if user:
        return UserProfileDTO(
            user_id=user.user_id,
            name=user.name,
            email=user.email,
            wallet_address=user.wallet_address,
            date_of_birth=user.date_of_birth,
            phone=user.phone,
            blood_type=user.blood_type,
            allergies=user.allergies,
            medications=user.medications,
            chronic_conditions=user.chronic_conditions
        )
    
    if user_id == "test123":
        try:
            new_user = models.User(
                user_id="test123",
                name="New User",
                email="user@example.com",
                wallet_address="0x123...",
                date_of_birth="1990-01-01",
                phone="555-0000",
                hashed_password="hashed_password"
            )
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            return UserProfileDTO(
                user_id=new_user.user_id,
                name=new_user.name,
                email=new_user.email,
                wallet_address=new_user.wallet_address,
                date_of_birth=new_user.date_of_birth,
                phone=new_user.phone
            )
        except:
            db.rollback()
            raise HTTPException(status_code=500, detail="Could not create default user")
            
    raise HTTPException(status_code=404, detail="User not found")

@router.put("/profile")
async def update_user_profile(profile_data: UpdateProfileRequest, user_id: str = "test123", db: Session = Depends(get_db)):
    """
    Update user profile information
    """
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields if provided
    if profile_data.name: user.name = profile_data.name
    if profile_data.date_of_birth: user.date_of_birth = profile_data.date_of_birth
    if profile_data.phone: user.phone = profile_data.phone
    if profile_data.blood_type: user.blood_type = profile_data.blood_type
    if profile_data.allergies: user.allergies = profile_data.allergies
    if profile_data.medications: user.medications = profile_data.medications
    if profile_data.chronic_conditions: user.chronic_conditions = profile_data.chronic_conditions
    
    db.commit()
    db.refresh(user)
    
    # Log Activity
    activity = models.Activity(
        type="profile_update",
        text="Updated health profile",
        owner=user
    )
    db.add(activity)
    db.commit()
    
    return {
        "success": True,
        "message": "Profile updated successfully"
    }

@router.get("/activity")
async def get_user_activity(user_id: str = "test123", db: Session = Depends(get_db)):
    """
    Get user's recent activity
    """
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        return {"activities": []}
    
    
    activities = db.query(models.Activity).filter(models.Activity.user_id == user.id)\
        .order_by(models.Activity.time.desc()).limit(10).all()
        
    return {
        "activities": [
            ActivityDTO(
                id=act.id,
                type=act.type,
                text=act.text,
                time=act.time.strftime("%Y-%m-%d %H:%M") 
            ) for act in activities
        ]
    }

@router.get("/health-vault")
async def get_health_vault(user_id: str = "test123", db: Session = Depends(get_db)):
    """
    Get user's health vault records
    """
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if not user:
        return {"vault": []}
    
    items = db.query(models.VaultItem).filter(models.VaultItem.user_id == user.id).all()
    
    return {
        "vault": [
            HealthVaultItemDTO(
                id=item.id,
                name=item.name,
                date=item.date,
                type=item.type
            ) for item in items
        ]
    }
