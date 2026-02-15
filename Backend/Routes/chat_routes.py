from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from Controllers import chat_controller
from pydantic import BaseModel

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

class ChatMessage(BaseModel):
    message: str

@router.post("/global/stream")
async def global_chat(chat_msg: ChatMessage):
    return StreamingResponse(
        chat_controller.stream_global_chat(chat_msg.message),
        media_type="text/event-stream"
    )

@router.post("/ticket/{ticket_id}/stream")
async def ticket_chat(ticket_id: str, chat_msg: ChatMessage):
    return StreamingResponse(
        chat_controller.stream_ticket_chat(ticket_id, chat_msg.message),
        media_type="text/event-stream"
    )
