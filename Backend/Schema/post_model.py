"""
Post Model Schema Module

This module defines the Pydantic data models used for validating and structuring 
post-related data stored in MongoDB. It includes schemas for ticket creation, 
updates, and retrieval, ensuring type safety and data integrity across the backend.

Allowed categories for posts are predefined to maintain consistency.
"""

# schema for post monogodb 
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


allowed = {"AI", "Podcast", "Education", "Programming", "Science", "Math", "Other"}


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
        "id": str(post["_id"]),
        "title": post.get("title", "Title is missing"),
        "image": post.get("image"),
        "description": post.get("description", "Description is missing"),
        "category": post.get("category", "Category is missing") if post.get("category") in allowed else "Please select a valid category",
        "tags": post.get("tags", []),
        "ai_summary": post.get("ai_summary"),
        "created_at": post.get("created_at"),
    }

def posts_serializer(posts) -> list:
    return [post_serializer(post) for post in posts]