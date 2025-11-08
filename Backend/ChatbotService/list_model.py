# list_models.py
import requests
from app.core.config import settings  # or wherever your settings.py is

url = "https://generativelanguage.googleapis.com/v1/models"

headers = {
    "Authorization": f"Bearer {settings.GOOGLE_API_KEY}",
}

response = requests.get(url, headers=headers)
print(response.status_code)
print(response.json())
