from sqlalchemy.orm import Session
from app.repositories.user import UserRepository
from app.models.enums import UserStatus
from app.utils.security import verify_password, create_access_token

class WrongEmailOrPassword(Exception):
    pass

class PermissionDenied(Exception):
    pass

class AuthService:
    def __init__(self, db: Session):
        self.repo = UserRepository(db)

    def login(self, email: str, password: str):
        user = self.repo.get_by_email(email)
        if user is None:
            raise WrongEmailOrPassword()
        if user.status == UserStatus.SUSPENDED:
            raise PermissionDenied()
        if not verify_password(password, user.password_hash):
            raise WrongEmailOrPassword()
        return create_access_token({"sub": str(user.id), "token_version": user.token_version})