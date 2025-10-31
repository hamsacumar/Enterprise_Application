from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import health
from app.core.config import settings
from app.api import mongo

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# include mongo routes
app.include_router(mongo.router, prefix="/mongo", tags=["MongoDB"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api/v1/health", tags=["Health"])
