# Backend for ThinkBack, a flashcard app for Posting and gaining lowledge on a topic, exploring the indepth chats with AI.

from fastapi import FastAPI
from pydantic import BaseModel
import typing
import uvicorn 

import os
from dotenv import load_dotenv
DEVELOPMENT = os.getenv("DEVELOPMENT") # True if in development environment, False if in production, if true show logs and use hot reload, if false hide logs and disable hot reload
port=os.getenv("PORT")

app = FastAPI()
import logging

def main():
    logging.basicConfig(level=logging.INFO)
    if DEVELOPMENT:
        logging.info("✅Starting server in development mode...")
        uvicorn.run(app, host="localhost", port=3000, reload=True, log_level="debug")
    else:
        logging.info("↗️Starting server in production mode...")
        uvicorn.run(app, host="0.0.0.0", port=8000, reload=False, log_level="warning")

def create_app():
    @app.get("/healthy")  # Corrected the route definition
    def health_check():
        return {"message": "ThinkBack Backend is healthy!"}
    return app  # Return the app instance