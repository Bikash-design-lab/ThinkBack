import os
import os
from Config.logger import log_success, log_error
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
        log_success("MongoDB connected successfully.")
        return db
    except Exception as error:
        log_error(f"Failed to connect MongoDB: {error}")
        return None

# mongodb disconnected successfully
def DisconnectFromDB():
    global client
    try:
        if client:
            client.close()
            log_success("MongoDB disconnected successfully.")
    except Exception as error:
        log_error(f"Failed to disconnect MongoDB: {error}")

def get_db():
    return db



