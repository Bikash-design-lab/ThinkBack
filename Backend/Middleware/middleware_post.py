from fastapi import HTTPException, status
from Schema.post_model import TicketCreate
from Config.logger import log_warning, log_error

# Valid categories for tickets
VALID_CATEGORIES = {"AI", "Podcast", "Education", "Programming", "Science", "Math", "Other"}

async def validate_ticket_data(ticket: TicketCreate):
    """
    Middleware/Dependency to validate ticket data before reaching the controller.
    """
    # Check title length
    if len(ticket.title.strip()) < 5:
        log_warning(f"Validation failed: Title too short ({len(ticket.title)} chars)")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Title must be at least 5 characters long."
        )

    # Check description length
    if len(ticket.description.strip()) < 10:
        log_warning(f"Validation failed: Description too short ({len(ticket.description)} chars)")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Description must be at least 10 characters long."
        )

    # Check category
    if ticket.category not in VALID_CATEGORIES:
        log_warning(f"Validation failed: Invalid category '{ticket.category}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid category. Must be one of: {', '.join(VALID_CATEGORIES)}"
        )

    return ticket