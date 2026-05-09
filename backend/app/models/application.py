from sqlalchemy import String, Integer, DateTime, Enum as SAEnum, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.core.database import Base
from app.models.enums import ApplicationStatus, enum_values
from app.models.job import Job

class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    job_id: Mapped[int] = mapped_column(Integer, ForeignKey("jobs.id"), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    resume_url: Mapped[str] = mapped_column(String(255), nullable=False)
    portfolio_url: Mapped[str] = mapped_column(String(255), nullable=True)
    status: Mapped[ApplicationStatus] = mapped_column(
        SAEnum(ApplicationStatus, name="application_status", create_type=False, values_callable=enum_values),
        server_default=ApplicationStatus.APPLIED.value,
        nullable=False
    )
    interview_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    rejected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    job: Mapped["Job"] = relationship("Job")