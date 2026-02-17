"""
ThinkBack Backend - FastAPI Application

This module serves as the entry point for the ThinkBack backend service. 
It facilitates a flashcard-based knowledge-sharing platform with AI-driven 
chat capabilities.

Key Features:
- Lifecycle Management: Handles MongoDB connection/disconnection via async lifespan.
- Middleware Integration: 
    - SlowAPI for rate limiting to prevent abuse.
    - CORSMiddleware for cross-origin resource sharing.
- Routing: Modular API routes for posts and chat functionalities.
- Health Monitoring: Simple health check endpoint for deployment verification.
- Environment Configuration: Dynamic port and development mode detection using .env.

Usage:
    Run via `uvicorn app:app` or through the `main()` entry point.
"""

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

from Config.db import ConnectToDB, DisconnectFromDB
from Routes.post_routes import router as post_router
from Routes.chat_routes import router as chat_router
from Config.logger import log_info, log_success, log_error

from Config.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi.middleware.cors import CORSMiddleware
# Load environment variables
load_dotenv()

DEVELOPMENT = os.getenv("DEVELOPMENT", "False").lower() == "true"
PORT = int(os.getenv("PORT", 8000))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    log_info("Connecting to MongoDB (Async)...")
    await ConnectToDB()
    yield
    # Shutdown
    log_info("Disconnecting from MongoDB (Async)...")
    await DisconnectFromDB()

app = FastAPI(lifespan=lifespan)

# rate-limiter to make 10 request per minute
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# handle cors error from different origin request
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
log_info("Registering routes...")
app.include_router(post_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
log_success("Routes registered successfully.")

# health check of api
@app.get("/")
def health_check():
    log_info("Health check endpoint called.")
    return {"message": "ThinkBack Backend is healthy!"}

def main():
    if DEVELOPMENT:
        log_success("Starting server in development mode...")
        uvicorn.run("app:app", host="localhost", port=PORT, reload=True, log_level="debug")
    else:
        # Standard uvicorn/fastapi logging for production
        uvicorn.run(app, host="0.0.0.0", port=PORT, reload=False, log_level="warning")

if __name__ == "__main__":
    main()
