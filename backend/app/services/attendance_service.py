from datetime import date, datetime, time

from app.models.attendance import Attendance
from app.repositories.attendance_repository import AttendanceRepository


class AttendanceService:

    def __init__(self, db):

        self.repository = AttendanceRepository(db)

    def mark_attendance(self, user_id: int):

        attendance = self.repository.already_marked_today(user_id)

        if attendance:
            return {
                "attendance": attendance,
                "already_marked": True
            }

        now = datetime.now()

        if now.time() >= time(12, 0):
            status = "Late"
        else:
            status = "Present"

        attendance = Attendance(
            user_id=user_id,
            date=date.today(),
            status=status,
            check_in=now
        )

        self.repository.create(attendance)

        return {
            "attendance": attendance,
            "already_marked": False
        }


    def get_today(self):

        return self.repository.get_today()


    def get_user_attendance(self, user_id: int):

        return self.repository.get_by_user(user_id)


    def get_all(self):

        return self.repository.get_all()