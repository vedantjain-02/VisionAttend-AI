from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
from app.database.session import get_db
from app.models.user import User
from app.models.attendance import Attendance

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):

    total = db.query(User).count()

    today = db.query(Attendance).count()

    present = (
        db.query(Attendance)
        .filter(Attendance.status == "Present")
        .count()
    )

    return {
        "total_employees": total,
        "today_attendance": today,
        "present_today": present,
        "recognition_accuracy": 96.5,
        "system_status": "online"
    }


@router.get("/recent-attendance")
def recent_attendance(db: Session = Depends(get_db)):

    records = (
        db.query(Attendance, User)
        .join(User, Attendance.user_id == User.id)
        .order_by(Attendance.check_in.desc())
        .limit(5)
        .all()
    )

    result = []

    for attendance, user in records:
        result.append({
            "id": attendance.id,
            "employee_name": user.full_name,
            "employee_id": user.employee_id,
            "check_in": attendance.check_in.strftime("%H:%M"),
            "status": attendance.status.lower()
        })

    return result


@router.get("/system-health")
def system_health():

    return {
        "backend_status": "online",
        "camera_status": "connected",
        "model_status": "loaded",
        "cpu_usage": 22,
        "memory_usage": 41,
        "version": "1.0.0"
    }


@router.get("/today")
def today_dashboard(db: Session = Depends(get_db)):

    records = (
        db.query(Attendance, User)
        .join(User, Attendance.user_id == User.id)
        .filter(Attendance.date == date.today())
        .order_by(Attendance.check_in.desc())
        .all()
    )

    attendance_records = []

    for attendance, user in records:

        attendance_records.append({
            "id": attendance.id,
            "employee_id": user.employee_id,
            "employee_name": user.full_name,
            "date": str(attendance.date),
            "check_in": attendance.check_in.strftime("%H:%M"),
            "status": attendance.status.lower(),
        })

    total_present = len(records)

    return {
        "total_present": total_present,
        "total_absent": 0,
        "total_late": 0,
        "records": attendance_records,
    }