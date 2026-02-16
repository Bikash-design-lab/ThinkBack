"""
Verification script for OpenRouter API integration.

This script performs the following:
1. Loads environment variables from a .env file.
2. Validates the presence of the OPENROUTER_API_KEY.
3. Initializes an OpenAI-compatible client pointing to OpenRouter's infrastructure.
4. Executes a test chat completion request to verify connectivity and model response.
"""

import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENROUTER_API_KEY")
model = os.getenv("GEMINI_MODEL", "google/gemini-2.0-flash-001")

if not api_key:
    print("❌ Error: OPENROUTER_API_KEY not found")
    exit(1)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=api_key,
)

print(f"Testing OpenRouter with model: {model}")

# Test 1: Generate Content
print("\n--- Test 1: Generate Content (Summary) ---")
try:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Explain what 5G is in one sentence."},
        ],
    )
    print(f"Response: {response.choices[0].message.content}")
    print("✅ Test 1 Success")
except Exception as e:
    print(f"❌ Test 1 Failed: {e}")

# Test 2: Stream Content
print("\n--- Test 2: Stream Content (Chat) ---")
try:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Count from 1 to 5."},
        ],
        stream=True,
    )
    print("Stream: ", end="", flush=True)
    for chunk in response:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)
    print("\n✅ Test 2 Success")
except Exception as e:
    print(f"❌ Test 2 Failed: {e}")
