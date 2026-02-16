"""
Google Gemini API Model Verification Utility

This script serves as a diagnostic tool to ensure the Backend is correctly 
configured to communicate with the Google Gemini API. 

Key Features:
1. Environment Configuration: Loads the `GEMINI_API_KEY` from environment variables 
   using `python-dotenv`.
2. Robust Key Lookup: Includes a fallback mechanism to search for the `.env` file 
   at a specific absolute path, ensuring connectivity during local development.
3. API Validation: Configures the `google-generativeai` SDK and verifies the 
   authenticity of the provided API key.
4. Model Discovery: Queries and filters the available Google AI models to identify 
   those supporting the `generateContent` method, printing their unique IDs and 
   capabilities for reference in other parts of the application.

Usage:
Run this script to troubleshoot API connection issues or to verify which 
model versions (e.g., gemini-1.5-flash) are currently accessible to your account.
"""

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    # Try looking for it in his .env file absolute path
    dotenv_path = "/Users/bikash/Documents/Project/ThinkBack/Backend/.env"
    load_dotenv(dotenv_path)
    api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ Error: GEMINI_API_KEY not found in .env")
else:
    print(f"✅ Found API Key: {api_key[:5]}...{api_key[-5:]}")
    genai.configure(api_key=api_key)
    
    print("\n--- Listing Available Models ---")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"Model ID: {m.name}")
                print(f"  Description: {m.description}")
                print(f"  Supported Methods: {m.supported_generation_methods}")
                print("-" * 20)
    except Exception as e:
        print(f"❌ Error listing models: {e}")
