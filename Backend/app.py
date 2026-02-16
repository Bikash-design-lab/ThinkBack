# Backend for ThinkBack, a flashcard app for Posting and gaining knowledge on a topic, exploring the indepth chats with AI.

import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

from Config.db import ConnectToDB, DisconnectFromDB
from Routes.post_routes import router as post_router
from Routes.chat_routes import router as chat_router
from Config.logger import log_info, log_success, log_error

# Load environment variables
load_dotenv()

DEVELOPMENT = os.getenv("DEVELOPMENT", "False").lower() == "true"
PORT = int(os.getenv("PORT", 8000))

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    log_info("Connecting to MongoDB...")
    ConnectToDB()
    yield
    # Shutdown
    log_info("Disconnecting from MongoDB...")
    DisconnectFromDB()

app = FastAPI(lifespan=lifespan)

# Include routes
log_info("Registering routes...")
app.include_router(post_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
log_success("Routes registered successfully.")

# health check of api
@app.get("/healthy")
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
