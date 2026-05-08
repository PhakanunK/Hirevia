from sqlalchemy.orm import Session
from app.repositories.user import UserRepository
from app.schemas.user import UserCreate, UserUpdate
from app.models.enums import UserRole
from app.utils.security import hash_password

class UserNotFound(Exception):
    pass

class EmailAlreadyExists(Exception):
    pass

class PermissionDenied(Exception):
    pass

class UserService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def get_all(self):
        return self.repo.get_all()
    
    def get_by_id(self, user_id: int):
        user = self.repo.get_by_id(user_id)
        if user is None:
            raise UserNotFound()
        return user
    
    def create(self, data: UserCreate):
        if self.repo.get_by_email(data.email):
            raise EmailAlreadyExists()
        create_data = data.model_dump()
        create_data["password_hash"] = hash_password(create_data.pop("password"))
        return self.repo.create(create_data)
    
    def update(self, user_id: int, data: UserUpdate):
        user = self.repo.get_by_id(user_id)
        if user is None:
            raise UserNotFound()
        update_data = data.model_dump(exclude_unset=True)
        if "password" in update_data:
            update_data["password_hash"] = hash_password(update_data.pop("password"))
        if "email" in update_data:
            existing = self.repo.get_by_email(update_data["email"])
            if existing:
                raise EmailAlreadyExists()
        return self.repo.update(user, update_data)
    
    def suspend(self, user_id: int):
        user = self.repo.get_by_id(user_id)
        if user is None:
            raise UserNotFound()
        if user.role == UserRole.HEAD_ADMIN:
            raise PermissionDenied()
        return self.repo.suspend(user)