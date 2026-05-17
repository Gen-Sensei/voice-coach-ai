import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.database import init_db
from app.routers import analyze, history

app = FastAPI(title="Voice Coach AI", version="1.0.0")

# Allow origins from env var (comma-separated) or fallback to localhost
_origins_env = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3001")
origins = [o.strip() for o in _origins_env.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("app/storage/uploads", exist_ok=True)

@app.on_event("startup")
async def startup():
    init_db()

app.include_router(analyze.router, prefix="/api")
app.include_router(history.router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Voice Coach AI API"}
