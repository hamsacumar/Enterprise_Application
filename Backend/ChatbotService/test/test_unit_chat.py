import pytest
import asyncio
from unittest.mock import AsyncMock, patch
from app.routes.chat import handle_ai_response


@pytest.mark.asyncio
async def test_handle_ai_response_success():
    # Mock WebSocket and MongoDB
    websocket = AsyncMock()
    db = {"chats": AsyncMock()}
    db["chats"].insert_one = AsyncMock()

    # Mock Gemini model
    mock_response = AsyncMock()
    mock_response.text = "Hello! I'm Gemini."
    with patch("app.routes.chat.genai.GenerativeModel") as MockModel:
        instance = MockModel.return_value
        instance.generate_content.return_value = mock_response

        # Call the function
        await handle_ai_response(websocket, "testuser", "Hi", db)

        # Assertions
        websocket.send_json.assert_any_call({"type": "ai_reply", "text": "Hello! I'm Gemini."})
        websocket.send_json.assert_any_call({"type": "ai_complete"})
        db["chats"].insert_one.assert_awaited_once()


@pytest.mark.asyncio
async def test_handle_ai_response_error():
    websocket = AsyncMock()
    db = {"chats": AsyncMock()}

    with patch("app.routes.chat.genai.GenerativeModel") as MockModel:
        instance = MockModel.return_value
        instance.generate_content.side_effect = Exception("Gemini failed")

        await handle_ai_response(websocket, "testuser", "Hi", db)

        websocket.send_json.assert_any_call({"type": "error", "message": "Gemini failed"})
