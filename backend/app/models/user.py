from sqlalchemy import String, Integer, DateTime, Enum as SAEnum, func
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from app.core.database import Base
from app.models.enums import UserStatus, UserRole, enum_values

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[UserStatus] = mapped_column(
        SAEnum(UserStatus, name="user_status", create_type=False, values_callable=enum_values),
        server_default=UserStatus.ACTIVE.value,
        nullable=False
    )
    suspended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    token_version: Mapped[int] = mapped_column(Integer, server_default="0", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, name="user_role", create_type=False, values_callable=enum_values),
        server_default=UserRole.ADMIN.value,
        nullable=False
    )