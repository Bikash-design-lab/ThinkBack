"""
Chat Routes Module

This module defines the API endpoints for real-time chat interactions within the application.
It leverages FastAPI's StreamingResponse to provide Server-Sent Events (SSE), allowing 
for asynchronous, chunked delivery of chat responses from the AI controller.

Endpoints:
- POST /global/stream: Initiates a streaming chat session for general queries.
- POST /ticket/{ticket_id}/stream: Initiates a context-aware streaming chat session 
  linked to a specific support ticket.

Security & Performance:
- Rate Limiting: Each endpoint is restricted to 10 requests per minute to prevent 
  resource exhaustion and ensure fair usage.
- Data Validation: Uses Pydantic models to enforce strict request body schemas.
"""

from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from Controllers import chat_controller

from Config.limiter import limiter

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

class ChatMessage(BaseModel):
    message: str

# 10/minutes limit to prevent API Exhaustion
@router.post("/global/stream")
@limiter.limit("10/minute")
async def global_chat(chat_msg: ChatMessage, request: Request):
    return StreamingResponse(
        chat_controller.stream_global_chat(chat_msg.message),
        media_type="text/event-stream"
    )

@router.post("/ticket/{ticket_id}/stream")
@limiter.limit("10/minute")
async def ticket_chat(ticket_id: str, chat_msg: ChatMessage, request: Request):
    return StreamingResponse(
        chat_controller.stream_ticket_chat(ticket_id, chat_msg.message),
        media_type="text/event-stream"
    )
