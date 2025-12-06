from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ai, auth, records, user

app = FastAPI(title="HealthGuard AI API")

# Configure CORS
origins = [
    "http://localhost:5173",  # Vite default port
    "http://localhost:5174",  # Vite fallback port
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
print("DEBUG: Including AI Router")
app.include_router(ai.router)
app.include_router(records.router)
app.include_router(user.router)

from app import models
from app.database import engine

models.Base.metadata.create_all(bind=engine)

@app.on_event("startup")
async def startup_event():
    for route in app.routes:
        print(f"DEBUG ROUTE: {route.path} {route.methods}")

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "HealthGuard AI Backend"}

@app.get("/")
async def root():
    return {"message": "Welcome to HealthGuard AI API"}
