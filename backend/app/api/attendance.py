from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.schemas.attendance import AttendanceResponse
from app.database.session import get_db
from app.services.attendance_service import AttendanceService
from app.schemas.common import ApiResponse
from app.recognition.recognize import FaceRecognizer
import cv2
from fastapi import UploadFile, File
import numpy as np


router = APIRouter(
    prefix="/attendance",
    tags=["Attendance"]
)

@router.get("/today", response_model=ApiResponse)
def today_attendance(db: Session = Depends(get_db)):

    service = AttendanceService(db)

    records = []

    for record in service.get_all():

        records.append({
            "id": record.id,
            "employee_id": record.user.employee_id,
            "employee_name": record.user.full_name,
            "check_in": record.check_in,
            "status": record.status,
            "confidence": 1.0
        })

    return {
        "success": True,
        "message": "Attendance fetched successfully.",
        "data": records
    }

@router.post("/live")
async def live_attendance(
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    recognizer = FaceRecognizer(db)
    attendance_service = AttendanceService(db)

    image_bytes = await image.read()

    npimg = np.frombuffer(image_bytes, np.uint8)

    frame = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    user = recognizer.recognize(frame)

    if user is None:
        return {
            "status": "error",
            "message": "Face not recognized",
            "data": None
        }

    attendance_service.mark_attendance(user.id)

    return {
        "status": "success",
        "message": "Attendance Marked",
        "data": {
            "employee_id": user.employee_id,
            "employee_name": user.full_name,
            "confidence": 1.0
        }
    }


@router.get("/", response_model=ApiResponse)
def all_attendance(db: Session = Depends(get_db)):

    service = AttendanceService(db)

    records = []

    for record in service.get_all():

        records.append({
            "id": record.id,
            "employee_id": record.user.employee_id,
            "employee_name": record.user.full_name,
            "check_in": record.check_in,
            "status": record.status,
            "confidence": 1.0
        })

    return {
        "success": True,
        "message": "Attendance fetched successfully.",
        "data": records
    }