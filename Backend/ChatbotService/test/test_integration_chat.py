import pytest
from fastapi.testclient import TestClient
from fastapi.websockets import WebSocketDisconnect
from app.main import app

client = TestClient(app)

@pytest.mark.asyncio
async def test_websocket_chat(monkeypatch):
    """Integration test for /ws/chat endpoint"""

    class MockResponse:
        text = "Hello from Gemini!"

    class MockModel:
        def generate_content(self, *args, **kwargs):
            return MockResponse()

    monkeypatch.setattr("app.routes.chat.genai.GenerativeModel", lambda *a, **k: MockModel())

    with client.websocket_connect("/ws/chat") as websocket:
        # Send a message
        websocket.send_json({"type": "user_message", "text": "Hi Gemini"})
        ack = websocket.receive_json()
        assert ack["type"] == "ack"
        assert ack["status"] == "received"

        # Receive AI reply
        reply = websocket.receive_json()
        assert reply["type"] == "ai_reply"
        assert "Hello from Gemini" in reply["text"]

        # Receive completion message
        complete = websocket.receive_json()
        assert complete["type"] == "ai_complete"
