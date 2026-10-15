from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, field_validator

class TaskBase(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)
    priority: int = Field(default=1, ge=1, le=5)

    @field_validator("title")
    @classmethod
    def title_not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("title can't be blank")
        return v.strip()

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, min_length=1, max_length=500)
    priority : Optional[int] = Field(default=None, ge=1, le=5)
    completed : Optional[bool] = None 

class TaskResponse(TaskBase):
    id: int
    completed: bool = False
    created_at: datetime