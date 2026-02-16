"""
Ticket Routes Module

This module defines the FastAPI routing for ticket-related operations. It provides 
endpoints for fetching and creating tickets, integrating business logic from 
the post_controller and applying security/validation measures.

Key Features:
- GET /tickets: Retrieves a collection of all existing tickets.
- POST /tickets: Handles ticket creation with:
    - Rate Limiting: Restricted to 10 requests per minute to prevent abuse.
    - Validation: Uses validate_ticket_data middleware to ensure data integrity.
    - Schema: Utilizes TicketCreate and TicketResponse for structured data handling.
"""


from fastapi import APIRouter, Depends, HTTPException
from typing import List
from Schema.post_model import TicketCreate, TicketResponse
from Controllers import post_controller
from Middleware.middleware_post import validate_ticket_data
from Config.limiter import limiter
from fastapi import Request

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

@router.get("/", response_model=List[TicketResponse])
async def get_tickets():
    return await post_controller.get_all_tickets()

# 10/minutes limit to prevent API Exhaustion
@router.post("/", response_model=TicketResponse)
@limiter.limit("10/minute")
async def create_ticket(request: Request, ticket: TicketCreate = Depends(validate_ticket_data)):
    return await post_controller.create_ticket(ticket)
