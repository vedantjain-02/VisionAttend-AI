from sqlalchemy.orm import Session
from app.models.attendance import Attendance
from app.models.user import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_employee_id(self, employee_id: str):
        return (
            self.db.query(User)
            .filter(User.employee_id == employee_id)
            .first()
        )

    def create(self, user: User):
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User) -> User:
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_all(self):
        return self.db.query(User).all()


    def delete(self, employee_id: str):

        user = (
            self.db.query(User)
            .filter(User.employee_id == employee_id)
            .first()
        )

        if not user:
            return None

        # Pehle attendance records delete karo
        self.db.query(Attendance).filter(
            Attendance.user_id == user.id
        ).delete()

        # Fir user delete karo
        self.db.delete(user)

        self.db.commit()

        return user