from fastapi import APIRouter, Depends, HTTPException
from typing import List
from Schema.post_model import TicketCreate, TicketResponse
from Controllers import post_controller

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

@router.get("/", response_model=List[TicketResponse])
async def get_tickets():
    return await post_controller.get_all_tickets()

@router.post("/", response_model=TicketResponse)
async def create_ticket(ticket: TicketCreate):
    return await post_controller.create_ticket(ticket)
