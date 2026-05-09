from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from math import ceil

from app.core.deps import get_db, get_current_user
from app.core.config import settings
from app.services.user import UserService, UserNotFound, EmailAlreadyExists, PermissionDenied
from app.schemas.user import UserCreate, UserUpdate, UserResponse
from app.schemas.pagination import PaginatedResponse, PaginationMeta
from app.models.enums import UserRole, UserStatus

router = APIRouter()

@router.get("", response_model=PaginatedResponse[UserResponse])
def get_users( page: int = 1,
    page_size: int = settings.PAGE_SIZE_TABLE,
    role: UserRole | None = None,
    status: UserStatus | None = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != UserRole.HEAD_ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    service = UserService(db)
    users, total = service.get_all(page, page_size, status=status, role=role)
    return PaginatedResponse(
        data=users,
        meta=PaginationMeta(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=ceil(total / page_size)
        )
    )

@router.post("", response_model=UserResponse)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != UserRole.HEAD_ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    service = UserService(db)
    try:
        return service.create(data)
    except EmailAlreadyExists:
        raise HTTPException(status_code=400, detail="Email already exists")

@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    if current_user.role != UserRole.HEAD_ADMIN:
        raise HTTPException(status_code=403, detail="Not authorized")
    service = UserService(db)
    try:
        return service.update(user_id, data, current_user.id)
    except UserNotFound:
        raise HTTPException(status_code=404, detail="User not found")
    except EmailAlreadyExists:
        raise HTTPException(status_code=400, detail="Email already exists")

@router.delete("/{user_id}")
def suspend_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = UserService(db)
    try:
        service.suspend(user_id, current_user.id)
        return {"message": "User suspended successfully"}
    except UserNotFound:
        raise HTTPException(status_code=404, detail="User not found")
    except PermissionDenied:
        raise HTTPException(status_code=403, detail="Cannot suspend this user")