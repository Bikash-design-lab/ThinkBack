# AI Configuration
"""
AI Configuration and Handler Module

This module defines the AIHandler class, which serves as the primary interface for 
interacting with Large Language Models via the OpenRouter API. It is designed 
with resilience in mind, featuring:

1. Multi-Model Fallback: Automatically routes requests to alternative models 
   defined in AI_MODEL_LIST if the primary model fails.
2. Robust Error Handling: Implements configurable retry logic (AI_RETRIES) 
   to mitigate transient API errors and rate limits.
3. Flexible Response Types: Supports both standard content generation and 
   real-time streaming for interactive user experiences.
4. Environment-Based Config: Utilizes environment variables for API keys, 
   retry counts, and model prioritization.
"""
import os
import time
from openai import OpenAI
from Config.logger import log_info, log_error, log_warning, log_success

# Safely load retry count with a default value to prevent crash if ENV is missing
AI_RETRIES = os.getenv("AI_RETRIES", "2")

class AIHandler:
    def __init__(self):
        self.api_key = os.getenv("OPENROUTER_API_KEY")
        try:
            self.max_retries = int(AI_RETRIES)
        except (TypeError, ValueError):
            self.max_retries = 2  # Fallback to 2 if setting is invalid
        
        if not self.api_key:
            log_error("OPENROUTER_API_KEY not found in environment variables.")
            raise ValueError("OPENROUTER_API_KEY is required.")
            
        self.client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=self.api_key,
        )

    def _get_model_list(self, override_model: str = None):
        """Helper to get prioritized models from environment."""
        if override_model:
            return [override_model]
        
        env_list = os.getenv("AI_MODEL_LIST", "google/gemini-2.0-flash-001")
        return [m.strip() for m in env_list.split(",") if m.strip()]

    def generate_content(self, prompt: str, model: str = None, system_instruction: str = "You are an educational AI tutor."):
        """
        Robust content generation with multi-model fallback routing.
        """
        models = self._get_model_list(model)
        
        for target_model in models:
            for attempt in range(self.max_retries):
                try:
                    log_info(f"AI Attempt ({attempt + 1}/{self.max_retries}) using: {target_model}")
                    response = self.client.chat.completions.create(
                        model=target_model,
                        messages=[
                            {"role": "system", "content": system_instruction},
                            {"role": "user", "content": prompt},
                        ],
                    )
                    log_success(f"Success with model: {target_model}")
                    return response.choices[0].message.content
                except Exception as e:
                    log_warning(f"Model {target_model} failed (Attempt {attempt + 1}): {e}")
                    if attempt < self.max_retries - 1:
                        time.sleep(1)
            
            log_warning(f"Exhausted model {target_model}. Trying next fallback...")
            
        log_error("CRITICAL: All models in fallback list failed.")
        return "Thinking process failed after exhaustion of all available models. Please try again later."

    def stream_content(self, prompt: str, model: str = None, system_instruction: str = "You are an educational AI tutor."):
        """
        Streams content with multi-model fallback support.
        """
        models = self._get_model_list(model)
        
        for target_model in models:
            try:
                log_info(f"AI Stream Start: {target_model}")
                response = self.client.chat.completions.create(
                    model=target_model,
                    messages=[
                        {"role": "system", "content": system_instruction},
                        {"role": "user", "content": prompt},
                    ],
                    stream=True,
                )
                log_success(f"Streaming established with: {target_model}")
                return response
            except Exception as e:
                log_warning(f"Streaming failed for model {target_model}: {e}")
                log_info("Attempting next fallback for stream...")

        log_error("CRITICAL: Streaming failed on all models.")
        raise Exception("All chat models currently unavailable. Please try again.")

# Initialize a global instance
ai_handler = AIHandler()
