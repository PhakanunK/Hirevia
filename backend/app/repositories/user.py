from sqlalchemy.orm import Session
from app.models.user import User
from app.models.enums import UserStatus
from datetime import datetime, timezone

class UserRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, user_id: int) -> User | None:
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_by_email(self, email:str) -> User | None:
        return self.db.query(User).filter(User.email == email).first()
    
    def get_all(self) -> list[User]:
        return self.db.query(User).all()
    
    def create(self, data: dict) -> User:
        user = User(**data)
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update(self, user: User, data: dict) -> User:
        for key, value in data.items():
            setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def suspend(self, user: User) -> User:
        user.status = UserStatus.SUSPENDED
        user.suspended_at = datetime.now(timezone.utc)
        user.token_version += 1
        self.db.commit()
        self.db.refresh(user)
        return user