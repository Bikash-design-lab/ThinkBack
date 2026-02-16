"""
Logger Configuration Module

This module provides a centralized utility for conditional logging during development. 
It utilizes environment variables to toggle log visibility and formats output with 
distinctive emojis for improved readability in the console.

Functionality:
- Loads environment configuration via dotenv.
- Provides specialized wrappers for different log levels (Info, Success, Error, Warning).
- Ensures logs are only emitted when the 'DEVELOPMENT' environment variable is set to 'true'.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DEVELOPMENT = os.getenv("DEVELOPMENT", "False").lower() == "true"

def log_debug(emoji: str, message: str):
    """
    Prints a log message in the pattern: ------------->emoji message
    Only runs if DEVELOPMENT is True.
    """
    if DEVELOPMENT:
        print(f"------------->{emoji} {message}")

def log_info(message: str):
    log_debug("ℹ️", message)

def log_success(message: str):
    log_debug("✅", message)

def log_error(message: str):
    log_debug("❌", message)

def log_warning(message: str):
    log_debug("⚠️", message)
