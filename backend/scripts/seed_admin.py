from app.core.database import SessionLocal
from app.repositories.user import UserRepository
from app.utils.security import hash_password
from app.models.enums import UserRole

def seed():
    db = SessionLocal()
    repo = UserRepository(db)
    
    existing = repo.get_by_email("admin@hireflow.com")
    if existing:
        print("Head admin already exists!")
        return
    
    repo.create({
        "username": "Head Admin",
        "email": "admin@hireflow.com",
        "password_hash": hash_password("Admin123"),
        "role": UserRole.HEAD_ADMIN.value
    })
    print("Head admin created!")
    db.close()

if __name__ == "__main__":
    seed()