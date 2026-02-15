import os
import json
import logging
import google.generativeai as genai
from Config.db import get_db
from bson import ObjectId

logger = logging.getLogger("api")

# Configure Gemini
GENI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GENI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

async def stream_global_chat(message: str):
    try:
        prompt = f"You are an educational AI tutor. Explain clearly and step-by-step: {message}"
        response = model.generate_content(prompt, stream=True)
        
        for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'text': chunk.text})}\n\n"
        
        yield "data: [DONE]\n\n"
    except Exception as e:
        logger.error(f"Error in global chat stream: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

async def stream_ticket_chat(ticket_id: str, message: str):
    try:
        db = get_db()
        ticket = db.tickets.find_one({"_id": ObjectId(ticket_id)})
        
        if not ticket:
            yield f"data: {json.dumps({'error': 'Ticket not found'})}\n\n"
            return

        context = f"Ticket Title: {ticket['title']}\nTicket Description: {ticket['description']}\nAI Summary: {ticket.get('ai_summary', '')}"
        prompt = f"Use this ticket as context and answer educationally:\n\nCONTEXT:\n{context}\n\nUSER QUESTION: {message}"
        
        response = model.generate_content(prompt, stream=True)
        
        for chunk in response:
            if chunk.text:
                yield f"data: {json.dumps({'text': chunk.text})}\n\n"
        
        yield "data: [DONE]\n\n"
    except Exception as e:
        logger.error(f"Error in ticket chat stream: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
