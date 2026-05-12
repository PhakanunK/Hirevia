from fastapi import APIRouter, UploadFile, File, HTTPException
from app.utils.storage import upload_resume
import uuid

router = APIRouter()

@router.post("/resume")
async def upload_resume_file(file: UploadFile = File(...)):
    if file.content_type not in ["application/pdf", "application/msword", 
                                   "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]:
        raise HTTPException(status_code=400, detail="Only PDF and Word documents allowed")
    
    file_bytes = await file.read()
    filename = f"{uuid.uuid4()}_{file.filename}"
    
    try:
        url = upload_resume(file_bytes, filename, file.content_type)
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))  # ← show real error