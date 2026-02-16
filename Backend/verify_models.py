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
