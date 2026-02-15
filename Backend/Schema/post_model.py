# schema for post monogodb 
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TicketBase(BaseModel):
    title: str
    description: str
    category: str
    tags: List[str] = []
    image: Optional[str] = None

class TicketCreate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: str
    ai_summary: Optional[str] = None
    created_at: datetime

def post_serializer(post) -> dict:
    return {
        "id": str(post["_id"]) if post.get("_id") else "Id is missing",
        "title": post.get("title", "Title is missing"),
        "image": post.get("image"),
        "description": post.get("description", "Description is missing"),
        "category": post.get("category", "Category is missing"),
        "tags": post.get("tags", []),
        "ai_summary": post.get("ai_summary"),
        "created_at": post.get("created_at"),
    }

def posts_serializer(posts) -> list:
    return [post_serializer(post) for post in posts]