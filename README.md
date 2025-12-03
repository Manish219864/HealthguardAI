# HealthGuard AI

Health & Cost Navigator Prototype - AI & Blockchain Powered.

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** & **npm**

## Getting Started

### 1. Backend Setup (FastAPI)

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
# Windows
python -m venv venv
```

Activate the virtual environment:
```bash
# Windows
.\venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn main:app --reload
```
The backend API will be available at `http://127.0.0.1:8000`.
Docs are available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup (React + Vite)

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

## Project Structure

- `backend/`: FastAPI application
- `frontend/`: React + TypeScript application
