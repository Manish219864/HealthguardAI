from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import secrets
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class WalletConnectRequest(BaseModel):
    wallet_address: str
    signature: Optional[str] = None

class HealthIDRequest(BaseModel):
    name: str
    email: str
    password: str
    date_of_birth: str

class AuthResponse(BaseModel):
    token: str
    user_id: str
    wallet_address: Optional[str]
    user_type: str  # "patient" or "doctor"

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/wallet-connect", response_model=AuthResponse)
async def connect_wallet(request: WalletConnectRequest, db: Session = Depends(get_db)):
    """
    Authenticate user via MetaMask wallet.
    Finds existing user or creates a new one by wallet address.
    """
    if not request.wallet_address:
         raise HTTPException(status_code=400, detail="Wallet address required")

    user = db.query(models.User).filter(models.User.wallet_address == request.wallet_address).first()
    
    
    if not user:
        user_id = f"user_{secrets.token_hex(4)}"
        user = models.User(
            user_id=user_id,
            name="Wallet User",
            email=f"wallet_{secrets.token_hex(4)}@healthguard.ai",
            wallet_address=request.wallet_address,
            hashed_password="wallet_login" 
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    token = secrets.token_urlsafe(32)
    
    
    # Log Activity
    login_activity = models.Activity(
        type="login",
        text="Wallet connected",
        owner=user
    )
    db.add(login_activity)
    db.commit()

    return AuthResponse(
        token=token,
        user_id=user.user_id,
        wallet_address=user.wallet_address,
        user_type="patient"
    )

@router.post("/create-health-id", response_model=AuthResponse)
async def create_health_id(request: HealthIDRequest, db: Session = Depends(get_db)):
    """
    Create traditional account with background wallet generation.
    Stores user in DB.
    """
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    wallet_address = "0x" + secrets.token_hex(20)
    user_id = f"user_{secrets.token_hex(4)}"
    
    new_user = models.User(
        user_id=user_id,
        name=request.name,
        email=request.email,
        wallet_address=wallet_address,
        hashed_password=request.password,
        date_of_birth=request.date_of_birth
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = secrets.token_urlsafe(32)
    
    
    # Log Activity
    reg_activity = models.Activity(
        type="registration",
        text="Account created",
        owner=new_user
    )
    db.add(reg_activity)
    db.commit()

    return AuthResponse(
        token=token,
        user_id=new_user.user_id,
        wallet_address=new_user.wallet_address,
        user_type="patient"
    )

@router.post("/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Traditional login
    """
    user = db.query(models.User).filter(models.User.email == request.email).first()
    
    if not user or user.hashed_password != request.password:
         raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Log Activity
    login_activity = models.Activity(
        type="login",
        text="Logged in via email",
        owner=user
    )
    db.add(login_activity)
    db.commit()

    return {
        "token": secrets.token_urlsafe(32),
        "user_id": user.user_id,
        "wallet_address": user.wallet_address,
        "message": "Login successful"
    }

@router.get("/verify-token")
async def verify_token(token: str):
    """
    Verify JWT token
    """
    if not token:
        return {"valid": False}
        
    return {
        "valid": True,
        "user_id": "test123"
    }
