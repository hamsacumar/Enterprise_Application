from fastapi import FastAPI
from .routes import chat
from .core import config
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CHATBOT")

# Add CORS
origins = [
    "http://localhost:4200",  # Angular dev server
    # you can add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(chat.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.on_event("startup")
async def startup_event():
    from .db import get_db
    db = get_db()
    
    try:
        # Test connection first
        await db.command('ping')
        print("✅ MongoDB connection successful")
        
        # Create unique index on username (not email, since you're using username)
        await db.users.create_index("username", unique=True)
        print("✅ Index created on username")
    except Exception as e:
        print(f"❌ MongoDB connection error: {e}")
        # Don't raise - allow app to start even if DB connection fails
        # You can uncomment the line below if you want the app to fail on DB errors
        # raise

@app.get("/")
async def root():
    return {"msg": "Auth service running"}