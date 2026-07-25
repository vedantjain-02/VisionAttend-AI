from datetime import date

from sqlalchemy.orm import Session
from datetime import date
from app.models.attendance import Attendance


class AttendanceRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, attendance: Attendance):
        self.db.add(attendance)
        self.db.commit()
        self.db.refresh(attendance)
        return attendance

    def already_marked_today(self, user_id: int):

        return (
            self.db.query(Attendance)
            .filter(
                Attendance.user_id == user_id,
                Attendance.date == date.today()
            )
            .first()
        )

    def get_today(self):
        return (
            self.db.query(Attendance)
            .filter(
                Attendance.date == date.today()
            )
            .all()
        )

    

    def get_by_user(self, user_id: int):

        return (
            self.db.query(Attendance)
            .filter(
                Attendance.user_id == user_id
            )
            .order_by(
                Attendance.check_in.desc()
            )
            .all()
        )


    def get_all(self):

        return (
            self.db.query(Attendance)
            .order_by(
                Attendance.check_in.desc()
            )
            .all()
        )