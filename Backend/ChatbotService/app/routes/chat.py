from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import asyncio, json
from ..core.db import get_db
from ..core.config import settings
from ..security import decode_token
import google.generativeai as genai
from google.generativeai.types import GenerationConfig

# Configure Gemini API key
genai.configure(api_key=settings.GOOGLE_API_KEY)
MODEL_NAME = "models/gemini-pro-latest"

router = APIRouter(prefix="/ws", tags=["chat"])


@router.websocket("/chat")
async def chat_websocket(websocket: WebSocket, db=Depends(get_db)):
    """
    WebSocket endpoint for Gemini chatbot.
    Sends full AI reply at once (no streaming).
    """
    await websocket.accept()
    print("✅ Client connected")

    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "user_message":
                user_text = message.get("text")
                await websocket.send_json({"type": "ack", "status": "received"})

                # Generate AI response in background
                asyncio.create_task(handle_ai_response(websocket, "username", user_text, db))

    except WebSocketDisconnect:
        print("🔴 username disconnected")
    except Exception as e:
        print("⚠️ WebSocket error:", e)
        await websocket.close()


async def handle_ai_response(websocket: WebSocket, username: str, user_text: str, db):
    """
    Generate Gemini AI reply and send once over WebSocket.
    """
    chats_collection = db["chats"]
    try:
        model = genai.GenerativeModel(MODEL_NAME)

        # Generate full reply (blocking call)
        response = await asyncio.to_thread(
            lambda: model.generate_content(
                user_text,
                generation_config=GenerationConfig(
                    temperature=0.7,
                    top_p=0.95
                )
            )
        )

        reply_text = response.text

        # Send full reply once
        await websocket.send_json({"type": "ai_reply", "text": reply_text})
        await websocket.send_json({"type": "ai_complete"})

        # Save chat to MongoDB
        await chats_collection.insert_one({
            "username": username,
            "message": user_text,
            "reply": reply_text
        })

    except Exception as e:
        print("⚠️ Gemini API error:", e)
        await websocket.send_json({"type": "error", "message": str(e)})
