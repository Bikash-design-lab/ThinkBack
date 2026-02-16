"""
Post Controller Module

This module manages the core business logic for ticket operations in the ThinkBack application.
It serves as the intermediary between the API routes and the MongoDB database, handling
data retrieval, persistence, and AI-driven content enhancement.

Key Functionalities:
- get_all_tickets: Retrieves a list of all tickets from the database, sorted by the most recent.
- create_ticket: Validates incoming ticket data, leverages an AI handler (OpenRouter) to 
  generate a concise summary of the issue, and stores the enriched document in the database.

The module utilizes custom serializers for MongoDB BSON-to-JSON conversion and 
integrated logging for monitoring system health and operation status.
"""

from Config.logger import log_info, log_error, log_success
import datetime
import os
from bson import ObjectId
from Config.db import get_db
from Schema.post_model import post_serializer, posts_serializer, TicketCreate

from Schema.post_model import post_serializer, posts_serializer, TicketCreate

from Config.ai_config import ai_handler

async def get_all_tickets():
    log_info("Fetching all tickets...")
    db = get_db()
    if db is None:
        raise Exception("Database not connected")
    
    # await to_list(): Since we are using Motor (Async), the find() method returns a cursor.
    # to_list() asynchronously fetches all documents without blocking the event loop.
    tickets = await db.tickets.find().sort("created_at", -1).to_list(length=None)
    log_success(f"Retrieved {len(tickets)} tickets.")
    return posts_serializer(tickets)

async def create_ticket(ticket_data: TicketCreate):
    log_info(f"Creating new ticket: {ticket_data.title}...")
    db = get_db()
    if db is None:
        raise Exception("Database not connected")
    
    # Prepare ticket document
    ticket_dict = ticket_data.model_dump()
    ticket_dict["created_at"] = datetime.datetime.utcnow()
    
    # Internal AI summarization
    # We automatically generate a summary for every ticket to provide immediate 
    # context for students and to keep the knowledge hub concise.
    try:
        prompt = f"Summarize this educational ticket title and description concisely for a helpdesk: \nTitle: {ticket_data.title}\nDescription: {ticket_data.description}"
        summary = ai_handler.generate_content(prompt)
        ticket_dict["ai_summary"] = summary.strip()
    except Exception as e:
        log_error(f"Error generating AI summary: {e}")
        ticket_dict["ai_summary"] = "AI summary generation failed."
    
    # Save to MongoDB (Async)
    result = await db.tickets.insert_one(ticket_dict)
    
    # Return saved ticket (Async)
    saved_ticket = await db.tickets.find_one({"_id": result.inserted_id})
    log_success(f"Ticket created successfully with ID: {result.inserted_id}")
    return post_serializer(saved_ticket)
