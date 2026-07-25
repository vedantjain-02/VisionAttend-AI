from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.attendance import AttendanceResponse
from app.database.session import get_db
from app.services.attendance_service import AttendanceService
from app.schemas.common import ApiResponse


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.get("/today", response_model=list[AttendanceResponse])
def today_attendance(
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)
    return ApiResponse(
        success=True,
        message="Today's attendance fetched successfully.",
        data=service.get_today()
    )


@router.get("/", response_model=list[AttendanceResponse])
def all_attendance(
    db: Session = Depends(get_db)
):

    service = AttendanceService(db)

    return ApiResponse(
    success=True,
    message="Attendance fetched successfully.",
    data=service.get_all()
    )