from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/api/ai", tags=["AI Services"])

class SymptomCheckRequest(BaseModel):
    symptoms: str
    duration: Optional[str] = None
    severity: Optional[str] = None

class SymptomCheckResponse(BaseModel):
    urgency: str
    possible_causes: List[str]
    recommendation: str
    estimated_cost: str

class BillAnalysisRequest(BaseModel):
    bill_data: str
    patient_id: str

class BillCharge(BaseModel):
    description: str
    amount: float
    status: str
    reason: Optional[str] = None
    fair_price: Optional[float] = None
    overcharge: Optional[float] = None

class BillAnalysisResponse(BaseModel):
    total: float
    charges: List[BillCharge]
    potential_savings: float

@router.post("/symptom-check", response_model=SymptomCheckResponse)
async def analyze_symptoms(request: SymptomCheckRequest):
    """
    AI-powered symptom analysis
    This is a simulated response for the prototype
    """
    # Simulate AI analysis
    if "chest pain" in request.symptoms.lower() or "shortness of breath" in request.symptoms.lower():
        return SymptomCheckResponse(
            urgency="HIGH",
            possible_causes=[
                "Anxiety/panic attack",
                "Cardiac concern",
                "Pulmonary issue"
            ],
            recommendation="ER Visit",
            estimated_cost="$2,000-5,000"
        )
    elif "headache" in request.symptoms.lower():
        return SymptomCheckResponse(
            urgency="MEDIUM",
            possible_causes=[
                "Tension headache",
                "Migraine",
                "Dehydration"
            ],
            recommendation="Urgent Care or Primary Care",
            estimated_cost="$150-500"
        )
    else:
        return SymptomCheckResponse(
            urgency="LOW",
            possible_causes=[
                "Common cold",
                "Viral infection",
                "Minor ailment"
            ],
            recommendation="Rest and monitor symptoms",
            estimated_cost="$0-200"
        )

@router.post("/bill-analysis", response_model=BillAnalysisResponse)
async def analyze_bill(request: BillAnalysisRequest):
    """
    AI-powered medical bill analysis
    This is a simulated response for the prototype
    """
    # Simulate bill analysis
    charges = [
        BillCharge(
            description="ER Facility Fee",
            amount=1200.0,
            status="approved"
        ),
        BillCharge(
            description="EKG",
            amount=300.0,
            status="approved"
        ),
        BillCharge(
            description="Lab Work",
            amount=500.0,
            status="approved"
        ),
        BillCharge(
            description="Critical Care Charge",
            amount=1500.0,
            status="flagged",
            reason="Patient was stable, not critical",
            fair_price=300.0,
            overcharge=1200.0
        )
    ]
    
    total = sum(charge.amount for charge in charges)
    potential_savings = sum(charge.overcharge or 0 for charge in charges)
    
    return BillAnalysisResponse(
        total=total,
        charges=charges,
        potential_savings=potential_savings
    )

@router.post("/cost-estimate")
async def estimate_cost(procedure: str, location: str):
    """
    Estimate healthcare costs
    """
    # Simulated cost estimates
    estimates = {
        "er_visit": {"min": 2000, "max": 5000},
        "urgent_care": {"min": 150, "max": 500},
        "primary_care": {"min": 100, "max": 300},
        "specialist": {"min": 200, "max": 600}
    }
    
    return {
        "procedure": procedure,
        "location": location,
        "estimate": estimates.get(procedure.lower().replace(" ", "_"), {"min": 100, "max": 500})
    }
