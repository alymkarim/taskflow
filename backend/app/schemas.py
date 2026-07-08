
from pydantic import BaseModel

class TaskCreate(BaseModel):
    title: str
    note: str | None = None

class TaskUpdate(BaseModel):
    title: str | None = None
    note: str | None = None
    completed: bool | None = None

class TaskOut(BaseModel):
    id: int
    title: str
    note: str | None
    completed: bool

    class Config:
        from_attributes = True