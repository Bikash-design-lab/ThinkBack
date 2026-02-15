import os
import logging
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
client = None
db = None

# mongodb connected successfully
def ConnectToDB():
    global client, db
    try:
        client = MongoClient(MONGODB_URI)
        db = client.get_database("ThinkBack")
        # Send a ping to confirm a successful connection
        client.admin.command('ping')
        logging.info("-------->✅ MongoDB connected successfully.")
        return db
    except Exception as error:
        logging.error(f"------>❌ Failed to connect MongoDB: {error}")
        return None

# mongodb disconnected successfully
def DisconnectFromDB():
    global client
    try:
        if client:
            client.close()
            logging.info("--------->✅ MongoDB disconnected successfully.")
    except Exception as error:
        logging.error(f"----------->❌ Failed to disconnect MongoDB: {error}")

def get_db():
    return db



