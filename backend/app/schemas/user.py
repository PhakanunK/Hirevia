from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enums import UserRole, UserStatus
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: UserRole

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    role: UserRole | None = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)