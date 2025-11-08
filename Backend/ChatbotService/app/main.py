from fastapi import FastAPI
from .routes import chat
from .core import config
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# 👇 Define lifespan first so it's available when creating FastAPI
@asynccontextmanager
async def lifespan(app: FastAPI):
    from .core.db import db  # Import inside to avoid circular import

    print("🚀 App starting up")
    try:
        # Test MongoDB connection
        await db.command("ping")
        print("✅ MongoDB connection successful")

        # Create unique index on username
        await db.users.create_index("username", unique=True)
        print("✅ Index created on username")
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        # Optional: raise exception if you want startup to fail
        # raise

    yield  # Application runs during this time

    print("🛑 App shutting down")


# ✅ Create app only once
app = FastAPI(title="CHATBOT", lifespan=lifespan)

# Add CORS middleware
origins = [
    "http://localhost:4200",  # Angular dev server
    # Add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat.router)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok"}

# Root endpoint
@app.get("/")
async def root():
    return {"msg": "Auth service running"}
