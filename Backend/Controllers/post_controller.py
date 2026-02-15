import logging
import datetime
import os
import google.generativeai as genai
from bson import ObjectId
from Config.db import get_db
from Schema.post_model import post_serializer, posts_serializer, TicketCreate

logger = logging.getLogger("api")

# Configure Gemini
GENI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GENI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

async def get_all_tickets():
    db = get_db()
    if db is None:
        raise Exception("Database not connected")
    
    tickets = list(db.tickets.find().sort("created_at", -1))
    return posts_serializer(tickets)

async def create_ticket(ticket_data: TicketCreate):
    db = get_db()
    if db is None:
        raise Exception("Database not connected")
    
    # Prepare ticket document
    ticket_dict = ticket_data.model_dump()
    ticket_dict["created_at"] = datetime.datetime.utcnow()
    
    # Generate AI summary using Gemini
    try:
        prompt = f"Summarize this educational ticket title and description concisely for a helpdesk: \nTitle: {ticket_data.title}\nDescription: {ticket_data.description}"
        response = model.generate_content(prompt)
        ticket_dict["ai_summary"] = response.text.strip()
    except Exception as e:
        logger.error(f"Error generating AI summary: {e}")
        ticket_dict["ai_summary"] = "AI summary generation failed."
    
    # Save to MongoDB
    result = db.tickets.insert_one(ticket_dict)
    
    # Return saved ticket
    saved_ticket = db.tickets.find_one({"_id": result.inserted_id})
    return post_serializer(saved_ticket)
