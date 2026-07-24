from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr | None = None