from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post("/register")
def register(
    data: UserCreate,
    db: Session = Depends(get_db)
):

    repository = UserRepository(db)

    existing_user = repository.get_by_employee_id(
        data.employee_id
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists."
        )

    user = User(
        employee_id=data.employee_id,
        full_name=data.full_name,
        email=data.email,
        photo_folder="",
        face_embedding=b""
    )

    repository.create(user)

    return {
        "message": "Employee created successfully."
    }