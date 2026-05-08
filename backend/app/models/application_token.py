from sqlalchemy import String, Integer, DateTime, func, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.core.database import Base
from app.models.application import Application

class ApplicationToken(Base):
    __tablename__ = "application_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    application_id: Mapped[int] = mapped_column(Integer, ForeignKey("applications.id"), nullable=False)
    token: Mapped[str] = mapped_column(Text, unique=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)

    application: Mapped["Application"] = relationship("Application")