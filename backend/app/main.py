import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models  # noqa: F401
from .database import Base, engine
from .init_db import main as seed_db
from .routes import auth, catalogue, jobs_admin, profile, recommendations

Base.metadata.create_all(engine)

# Auto-seed verified NSQF qualifications, livelihoods, skills, and programs
seed_db()

app = FastAPI(title="Livelihood Mapping API")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
frontend_url = os.getenv("FRONTEND_URL", "").strip()
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(recommendations.router)
app.include_router(catalogue.router)
app.include_router(jobs_admin.router)


@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Backend is running"}