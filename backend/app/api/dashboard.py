from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.models.attendance import Attendance
from sqlalchemy import func, extract
from datetime import date,timedelta, time

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats(db: Session = Depends(get_db)):

    total = db.query(User).count()

    present = (
        db.query(Attendance)
        .filter(
            Attendance.date == date.today(),
            Attendance.status == "Present"
        )
        .count()
    )

    late = (
        db.query(Attendance)
        .filter(
            Attendance.date == date.today(),
            Attendance.status == "Late"
        )
        .count()
    )

    # Late bhi present hi hai
    present_today = present + late

    absent = max(total - present_today, 0)

    return {
        "total_employees": total,
        "present_today": present_today,
        "late_today": late,
        "absent_today": absent,
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

    total_late = 0

    for attendance, user in records:

        status = attendance.status.lower()

        attendance_records.append({
            "id": attendance.id,
            "employee_id": user.employee_id,
            "employee_name": user.full_name,
            "date": str(attendance.date),
            "check_in": attendance.check_in.strftime("%H:%M"),
            "status": status,
        })

    total_employees = db.query(User).count()

    total_present = sum(
        1 for attendance, _ in records
        if attendance.status in ["Present", "Late"]
    )

    total_late = sum(
        1 for attendance, _ in records
        if attendance.status == "Late"
    )

    total_absent = max(
        total_employees - total_present,
        0
    )

    return {
        "total_present": total_present,
        "total_absent": total_absent,
        "total_late": total_late,
        "records": attendance_records,
    }



@router.get("/weekly-attendance")
def weekly_attendance(db: Session = Depends(get_db)):

    total_employees = db.query(User).count()

    result = []

    for i in range(6, -1, -1):

        day = date.today() - timedelta(days=i)

        present = (
            db.query(Attendance)
            .filter(
                Attendance.date == day,
                Attendance.status == "Present"
            )
            .count()
        )

        late = (
            db.query(Attendance)
            .filter(
                Attendance.date == day,
                Attendance.status == "Late"
            )
            .count()
        )

        absent = max(total_employees - (present + late), 0)

        result.append({
            "name": day.strftime("%a"),
            "present": present,
            "absent": absent,
            "late": late
        })

    return result


@router.get("/employee-growth")
def employee_growth(db: Session = Depends(get_db)):

    result = []

    current_year = date.today().year

    month_names = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    total = 0

    for month in range(1, 13):

        count = (
            db.query(User)
            .filter(
                extract("year", User.created_at) == current_year,
                extract("month", User.created_at) == month
            )
            .count()
        )

        total += count

        result.append({
            "name": month_names[month - 1],
            "employees": total
        })

    return result


@router.get("/monthly-attendance")
def monthly_attendance(db: Session = Depends(get_db)):

    total_employees = db.query(User).count()
    year = date.today().year

    months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ]

    result = []

    for month in range(1, 13):

        present = (
            db.query(Attendance)
            .filter(
                extract("year", Attendance.date) == year,
                extract("month", Attendance.date) == month,
                Attendance.status.in_(["Present", "Late"])
            )
            .count()
        )

        employees_added = (
            db.query(User)
            .filter(
                extract("year", User.created_at) == year,
                extract("month", User.created_at) == month
            )
            .count()
        )

        base = total_employees if total_employees > 0 else employees_added

        attendance = round((present / base) * 100, 1) if base > 0 else 0

        result.append({
            "name": months[month - 1],
            "attendance": attendance
        })

    return result