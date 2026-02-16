"""
MongoDB Connection Management Module

This module handles the lifecycle of the MongoDB connection for the ThinkBack application.
It provides utilities to establish a connection using environment-configured URIs,
verify connectivity via administrative pings, and gracefully close connections.

Functions:
    ConnectToDB: Initializes the MongoClient and selects the target database.
    DisconnectFromDB: Closes the active MongoDB client connection.
    get_db: Returns the current database instance for use in other modules.
"""

import os
from Config.logger import log_success, log_error
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = None
db = None

# mongodb connected successfully
async def ConnectToDB():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        db = client.get_database("ThinkBack")
        # Send a ping to confirm a successful connection
        await client.admin.command('ping')
        log_success("Asynchronous MongoDB connected successfully.")
        return db
    except Exception as error:
        log_error(f"Failed to connect MongoDB: {error}")
        return None

# mongodb disconnected successfully
async def DisconnectFromDB():
    global client
    try:
        if client:
            client.close()
            log_success("Asynchronous MongoDB disconnected successfully.")
    except Exception as error:
        log_error(f"Failed to disconnect MongoDB: {error}")

def get_db():
    return db
