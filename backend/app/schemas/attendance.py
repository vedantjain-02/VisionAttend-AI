from datetime import date, datetime

from pydantic import BaseModel, ConfigDict


class AttendanceResponse(BaseModel):
    id: int
    user_id: int
    date: date
    check_in: datetime
    status: str

    model_config = ConfigDict(from_attributes=True)