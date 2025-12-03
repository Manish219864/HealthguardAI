from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ai, auth, records

app = FastAPI(title="HealthGuard AI API")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:3000",  # React default port
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(ai.router)
app.include_router(records.router)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "HealthGuard AI Backend"}

@app.get("/")
async def root():
    return {"message": "Welcome to HealthGuard AI API"}
