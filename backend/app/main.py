from fastapi import FastAPI
from sqlalchemy import text
from app.core.database import SessionLocal

app = FastAPI(title="Mini ATS")

@app.get("/health")
def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "ok", "database": "connected"}
    except Exception as e:
        return {"status": "error", "database": str(e)}