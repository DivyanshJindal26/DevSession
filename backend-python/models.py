from pydantic import BaseModel
from typing import Optional


class NoteCreate(BaseModel):
    title: str
    content: str
    tag: str = "general"


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tag: Optional[str] = None
