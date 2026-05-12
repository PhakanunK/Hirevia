from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.database import SessionLocal
from app.core.config import settings
from app.api.v1.admin import auth, users, jobs as admin_jobs, applications as admin_applications, dashboard
from app.api.v1.public import jobs as public_jobs, apply, status

app = FastAPI(
    title="HireFlow ATS",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/admin/auth", tags=["Admin Auth"])
app.include_router(users.router, prefix="/admin/users", tags=["Admin Users"])
app.include_router(admin_jobs.router, prefix="/admin/jobs", tags=["Admin Jobs"])
app.include_router(admin_applications.router, prefix="/admin/applications", tags=["Admin Applications"])
app.include_router(dashboard.router, prefix="/admin/dashboard", tags=["Admin Dashboard"])

app.include_router(public_jobs.router, prefix="/public/jobs", tags=["Public Jobs"])
app.include_router(apply.router, prefix="/public/apply", tags=["Public Apply"])
app.include_router(status.router, prefix="/public/status", tags=["Public Status"])

@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}