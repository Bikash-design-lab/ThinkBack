# Backend for ThinkBack, a flashcard app for Posting and gaining knowledge on a topic, exploring the indepth chats with AI.

import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
import uvicorn

from Config.db import ConnectToDB, DisconnectFromDB
from Routes.post_routes import router as post_router
from Routes.chat_routes import router as chat_router

# Load environment variables
load_dotenv()

DEVELOPMENT = os.getenv("DEVELOPMENT") == "True"
PORT = int(os.getenv("PORT", 8000))

# Setup logging
def setup_logging():
    is_cloud = os.getenv("VERCEL") is not None
    if is_cloud:
        logging.basicConfig(level=logging.CRITICAL)
    else:
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )

setup_logging()
logger = logging.getLogger("api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    ConnectToDB()
    yield
    # Shutdown
    DisconnectFromDB()

app = FastAPI(lifespan=lifespan)

# Include routes
app.include_router(post_router, prefix="/api")
app.include_router(chat_router, prefix="/api")

# health check of api
@app.get("/healthy")
def health_check():
    return {"message": "ThinkBack Backend is healthy!"}

def main():
    if DEVELOPMENT:
        logger.info("✅ Starting server in development mode...")
        uvicorn.run("app:app", host="localhost", port=PORT, reload=True, log_level="debug")
    else:
        logger.info("↗️ Starting server in production mode...")
        uvicorn.run(app, host="0.0.0.0", port=PORT, reload=False, log_level="warning")

if __name__ == "__main__":
    main()
