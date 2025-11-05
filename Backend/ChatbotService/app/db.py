from typing import Optional
import ssl
from motor.motor_asyncio import AsyncIOMotorClient
from .core.config import settings

_mongo_client: Optional[AsyncIOMotorClient] = None

def get_client() -> AsyncIOMotorClient:
    global _mongo_client
    if _mongo_client is None:
        # OpenSSL 3.x fix: Create context with reduced security level
        ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        ssl_context.minimum_version = ssl.TLSVersion.TLSv1_2
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        
        # Set security level to 0 (permissive) for OpenSSL 3.x
        try:
            ssl_context.set_ciphers('DEFAULT@SECLEVEL=0')
        except:
            pass
        
        _mongo_client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            tls=True,
        )

    return _mongo_client

def get_db():
    client = get_client()
    return client[settings.MONGODB_DB_NAME]