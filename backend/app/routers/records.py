from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import secrets
from datetime import datetime
from sqlalchemy.orm import Session
from app import models
from app.database import get_db

router = APIRouter(prefix="/api/records", tags=["Medical Records"])

class MedicalRecordDTO(BaseModel):
    id: str  # using record_id string from DB
    name: str
    type: str
    date: str
    ipfs_hash: Optional[str] = None
    size: str

class ShareRecordRequest(BaseModel):
    record_ids: List[str]
    doctor_id: str
    access_duration: str  # "7_days", "30_days", "90_days", "until_revoked"

class AccessLog(BaseModel):
    timestamp: str
    accessor: str
    action: str
    record_id: Optional[str] = None

@router.post("/upload")
async def upload_record(
    file: UploadFile = File(...), 
    patient_id: str = "test123", # Default for prototype
    db: Session = Depends(get_db)
):
    """
    Upload medical record to IPFS (Simulated) and save to DB
    """
    ipfs_hash = "Qm" + secrets.token_hex(22)
    record_id = f"record_{secrets.token_hex(8)}"
    
    user = db.query(models.User).filter(models.User.user_id == patient_id).first()
    if not user:
        try:
           user = models.User(
               user_id=patient_id, 
               name="New User", 
               email=f"{patient_id}@example.com",
               hashed_password="pw"
           )
           db.add(user)
           db.commit()
           db.refresh(user)
        except:
             raise HTTPException(status_code=404, detail="User not found")
    
    new_record = models.Record(
        record_id=record_id,
        name=file.filename,
        type=file.content_type or "Unknown",
        date=datetime.now().strftime("%b %Y"),
        ipfs_hash=ipfs_hash,
        size=f"{(file.size or 0) / 1024:.1f} KB",
        owner=user
    )
    
    db.add(new_record)
    
    new_activity = models.Activity(
        type="upload",
        text=f"Uploaded record: {file.filename}",
        owner=user
    )
    db.add(new_activity)
    
    db.commit()
    
    return {
        "success": True,
        "record_id": record_id,
        "ipfs_hash": ipfs_hash,
        "filename": file.filename
    }

@router.get("/list")
async def list_records(patient_id: str = "test123", db: Session = Depends(get_db)):
    """
    Get patient's medical records
    """
    user = db.query(models.User).filter(models.User.user_id == patient_id).first()
    if not user:
        return {"records": []}
    
    records = db.query(models.Record).filter(models.Record.user_id == user.id).all()
    
    return {"records": [
        MedicalRecordDTO(
            id=rec.record_id,
            name=rec.name,
            type=rec.type,
            date=rec.date,
            ipfs_hash=rec.ipfs_hash,
            size=rec.size
        ) for rec in records
    ]}

@router.post("/share")
async def share_records(request: ShareRecordRequest):
    """
    Share records with doctor (blockchain transaction)
    """
    transaction_hash = "0x" + secrets.token_hex(32)
    
    return {
        "success": True,
        "transaction_hash": transaction_hash,
        "gas_fee": "0.15",
        "message": f"Records shared with doctor. Access granted for {request.access_duration}"
    }

@router.get("/{record_id}")
async def get_record(record_id: str, db: Session = Depends(get_db)):
    """
    Retrieve specific record from IPFS (via DB metadata)
    """
    record = db.query(models.Record).filter(models.Record.record_id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found")
        
    return {
        "record_id": record.record_id,
        "ipfs_hash": record.ipfs_hash,
        "url": f"https://ipfs.io/ipfs/{record.ipfs_hash}",
        "metadata": {
            "name": record.name,
            "type": record.type,
            "size": record.size
        }
    }

@router.get("/access-log/{patient_id}")
async def get_access_log(patient_id: str):
    """
    View blockchain access history
    """

    
    logs = [
        AccessLog(
            timestamp=datetime.now().isoformat(),
            accessor="Dr. Lee Patel",
            action="Viewed records",
            record_id="record_1"
        ),
        AccessLog(
            timestamp=datetime.now().isoformat(),
            accessor="ER Dr. Smith",
            action="Emergency access",
            record_id="record_2"
        )
    ]
    
    return {"logs": logs}
