from pydantic import BaseModel, ConfigDict


class UserCreate(BaseModel):
    employee_id: str
    full_name: str
    email: str


class UserResponse(BaseModel):
    id: int
    employee_id: str
    full_name: str
    email: str

    model_config = ConfigDict(from_attributes=True)