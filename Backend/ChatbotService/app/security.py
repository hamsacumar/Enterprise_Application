from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
import bcrypt
from .core.config import settings

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload["sub"]
    except Exception:
        return None