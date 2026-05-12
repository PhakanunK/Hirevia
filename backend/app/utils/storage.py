from supabase import create_client
from app.core.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

def upload_resume(file_bytes: bytes, filename: str, content_type: str) -> str:
    path = f"{filename}"
    
    supabase.storage.from_(settings.SUPABASE_BUCKET).upload(
        path=path,
        file=file_bytes,
        file_options={"content-type": content_type}
    )
    
    url = supabase.storage.from_(settings.SUPABASE_BUCKET).get_public_url(path)
    return url