from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import secrets

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
    wallet_address: str
    user_type: str  # "patient" or "doctor"

@router.post("/wallet-connect", response_model=AuthResponse)
async def connect_wallet(request: WalletConnectRequest):
    """
    Authenticate user via MetaMask wallet
    """
    # Simulate wallet authentication
    # In production, verify signature
    
    token = secrets.token_urlsafe(32)
    
    return AuthResponse(
        token=token,
        user_id=f"user_{secrets.token_hex(8)}",
        wallet_address=request.wallet_address,
        user_type="patient"
    )

@router.post("/create-health-id", response_model=AuthResponse)
async def create_health_id(request: HealthIDRequest):
    """
    Create traditional account with background wallet generation
    """
    # Simulate account creation
    # In production: hash password, create wallet, store in database
    
    # Generate wallet address for user
    wallet_address = "0x" + secrets.token_hex(20)
    token = secrets.token_urlsafe(32)
    
    return AuthResponse(
        token=token,
        user_id=f"user_{secrets.token_hex(8)}",
        wallet_address=wallet_address,
        user_type="patient"
    )

@router.post("/login")
async def login(email: str, password: str):
    """
    Traditional login
    """
    # Simulate login
    # In production: verify credentials from database
    
    return {
        "token": secrets.token_urlsafe(32),
        "user_id": f"user_{secrets.token_hex(8)}",
        "message": "Login successful"
    }

@router.get("/verify-token")
async def verify_token(token: str):
    """
    Verify JWT token
    """
    # Simulate token verification
    # In production: verify JWT signature and expiration
    
    return {
        "valid": True,
        "user_id": f"user_{secrets.token_hex(8)}"
    }
