from datetime import date

from app.models.attendance import Attendance
from app.repositories.attendance_repository import AttendanceRepository


class AttendanceService:

    def __init__(self, db):

        self.repository = AttendanceRepository(db)

    def mark_attendance(self, user_id: int):

        attendance = self.repository.already_marked_today(user_id)

        if attendance:

            return {
                "message": "Attendance already marked."
            }

        attendance = Attendance(
            user_id=user_id,
            date=date.today(),
            status="Present"
        )

        self.repository.create(attendance)

        return {
            "message": "Attendance marked successfully."
        }


    def get_today(self):

        return self.repository.get_today()


    def get_user_attendance(self, user_id: int):

        return self.repository.get_by_user(user_id)


    def get_all(self):

        return self.repository.get_all()