"""
Chat Controller Module

This module manages real-time AI communication using Server-Sent Events (SSE). 
It facilitates streaming responses for two primary use cases:

1. Global Educational Chat: An AI tutor providing step-by-step explanations 
   for general user queries.
2. Ticket-Specific Chat: Context-aware assistance that retrieves ticket 
   data from MongoDB to provide targeted support.

The module integrates with:
- ai_handler: For LLM content generation and streaming.
- MongoDB: For ticket data persistence and retrieval.
- Custom Logging: For tracking stream lifecycle and error diagnostics.

Responses are yielded in standard SSE format: `data: {json}\n\n`.
"""
import os
import json
from Config.logger import log_info, log_error, log_success
from Config.db import get_db
from bson import ObjectId
from Config.ai_config import ai_handler

async def stream_global_chat(message: str):
    try:
        # StreamingResponse (SSE).
        # Server-Sent Events (SSE) allow us to stream AI responses in real-time. 
        # This provides a much better UX than waiting 10+ seconds for a full paragraph.
        prompt = f"You are an educational AI tutor. Explain clearly and step-by-step: {message}"
        response = ai_handler.stream_content(prompt)
        
        try:
            # Mid-stream error handling.
            # If the AI connection drops or the quota is hit while generating text,
            # we must catch the exception and send a structured error message to
            # the client to prevent the browser from hanging in a "loading" state.
            for chunk in response:
                content = chunk.choices[0].delta.content
                if content:
                    yield f"data: {json.dumps({'text': content})}\n\n"
        except Exception as iter_error:
            log_error(f"Mid-stream error in global chat: {iter_error}")
            yield f"data: {json.dumps({'error': 'AI connection lost mid-stream. Please try again.'})}\n\n"
            return
        
        log_success("Global chat stream completed.")
        yield "data: [DONE]\n\n"
    except Exception as e:
        log_error(f"Initial error in global chat stream: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"

async def stream_ticket_chat(ticket_id: str, message: str):
    log_info(f"Starting ticket chat stream for ID: {ticket_id}...")
    try:
        db = get_db()
        ticket = await db.tickets.find_one({"_id": ObjectId(ticket_id)})
        
        if not ticket:
            yield f"data: {json.dumps({'error': 'Ticket not found'})}\n\n"
            return

        context = f"Ticket Title: {ticket['title']}\nTicket Description: {ticket['description']}\nAI Summary: {ticket.get('ai_summary', '')}"
        prompt = f"Use this ticket as context and answer educationally:\n\nCONTEXT:\n{context}\n\nUSER QUESTION: {message}"
        
        response = ai_handler.stream_content(prompt)
        
        try:
            for chunk in response:
                content = chunk.choices[0].delta.content
                if content:
                    yield f"data: {json.dumps({'text': content})}\n\n"
        except Exception as iter_error:
            log_error(f"Mid-stream error in ticket chat: {iter_error}")
            yield f"data: {json.dumps({'error': 'AI connection lost mid-stream. Please try again.'})}\n\n"
            return
        
        log_success("Ticket chat stream completed.")
        yield "data: [DONE]\n\n"
    except Exception as e:
        log_error(f"Initial error in ticket chat stream: {e}")
        yield f"data: {json.dumps({'error': str(e)})}\n\n"
