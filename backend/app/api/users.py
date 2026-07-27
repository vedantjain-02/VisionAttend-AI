from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from fastapi import UploadFile, File
from app.dependencies.database import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate
from app.services.face_registration_service import FaceRegistrationService

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


@router.post("/{employee_id}/register-face")
def register_face(
    employee_id: str,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    service = FaceRegistrationService(db)
    return service.register_face(employee_id, image)

@router.get("")
def get_users(
    db: Session = Depends(get_db)
):
    repository = UserRepository(db)

    users = repository.get_all()

    return {
        "data": [
            {
                "employee_id": user.employee_id,
                "name": user.full_name,
                "email": user.email,
                "face_registered": bool(user.face_embedding),
                "created_at": "",
                "updated_at": ""
            }
            for user in users
        ],
        "total": len(users),
        "page": 1,
        "per_page": len(users),
        "total_pages": 1
    }


@router.delete("/{employee_id}")
def delete_user(
    employee_id: str,
    db: Session = Depends(get_db)
):

    repository = UserRepository(db)

    user = repository.delete(employee_id)

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Employee not found."
        )

    return {
        "message": "Employee deleted successfully."
    }