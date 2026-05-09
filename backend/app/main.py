from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import SessionLocal
from app.api.v1.admin import auth

app = FastAPI(title="Mini ATS")

app.include_router(auth.router, prefix="/admin/auth", tags=["Admin Auth"])

@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}