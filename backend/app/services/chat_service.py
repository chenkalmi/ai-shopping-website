import os
from fastapi import HTTPException
from openai import OpenAI, RateLimitError, OpenAIError
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def get_chat_response(user_message: str, products_context: str) -> str:
    try:
        response = client.responses.create(
            model="gpt-4.1-mini",
            input=f"""
You are a shopping assistant for an online store.

You can answer questions only based on the store products listed below.
Mention whether products are available or out of stock when relevant.

Store products:
{products_context}

User question:
{user_message}
"""
        )

        return response.output_text

    except RateLimitError:
        raise HTTPException(
            status_code=402,
            detail="OpenAI quota exceeded. Please add credits to the OpenAI account."
        )

    except OpenAIError:
        raise HTTPException(
            status_code=500,
            detail="OpenAI service error."
        )