from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import secrets
from datetime import datetime

router = APIRouter(prefix="/api/records", tags=["Medical Records"])

class MedicalRecord(BaseModel):
    id: str
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
async def upload_record(file: UploadFile = File(...), patient_id: str = ""):
    """
    Upload medical record to IPFS
    """
    # Simulate IPFS upload
    # In production: upload to IPFS, store hash in blockchain
    
    ipfs_hash = "Qm" + secrets.token_hex(22)
    
    return {
        "success": True,
        "record_id": f"record_{secrets.token_hex(8)}",
        "ipfs_hash": ipfs_hash,
        "filename": file.filename
    }

@router.get("/list")
async def list_records(patient_id: str):
    """
    Get patient's medical records
    """
    # Simulate fetching records
    # In production: fetch from database
    
    records = [
        MedicalRecord(
            id="record_1",
            name="Lab Results",
            type="PDF",
            date="Oct 2024",
            ipfs_hash="QmXxx...",
            size="245 KB"
        ),
        MedicalRecord(
            id="record_2",
            name="Prescription History",
            type="PDF",
            date="Sep 2024",
            ipfs_hash="QmYyy...",
            size="180 KB"
        ),
        MedicalRecord(
            id="record_3",
            name="Insurance Card",
            type="Image",
            date="Jan 2024",
            ipfs_hash="QmZzz...",
            size="120 KB"
        )
    ]
    
    return {"records": records}

@router.post("/share")
async def share_records(request: ShareRecordRequest):
    """
    Share records with doctor (blockchain transaction)
    """
    # Simulate blockchain transaction
    # In production: create smart contract transaction
    
    transaction_hash = "0x" + secrets.token_hex(32)
    
    return {
        "success": True,
        "transaction_hash": transaction_hash,
        "gas_fee": "0.15",
        "message": f"Records shared with doctor. Access granted for {request.access_duration}"
    }

@router.get("/{record_id}")
async def get_record(record_id: str):
    """
    Retrieve specific record from IPFS
    """
    # Simulate IPFS retrieval
    # In production: fetch from IPFS using hash
    
    return {
        "record_id": record_id,
        "ipfs_hash": "Qm" + secrets.token_hex(22),
        "url": f"https://ipfs.io/ipfs/Qm{secrets.token_hex(22)}",
        "metadata": {
            "name": "Medical Record",
            "type": "PDF",
            "size": "245 KB"
        }
    }

@router.get("/access-log/{patient_id}")
async def get_access_log(patient_id: str):
    """
    View blockchain access history
    """
    # Simulate blockchain query
    # In production: query blockchain for access events
    
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
