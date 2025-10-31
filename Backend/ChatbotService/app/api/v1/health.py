from fastapi import APIRouter

router = APIRouter()

@router.get("/", summary="Health check")
async def health_check():
    return {"status": "ok", "message": "FastAPI is running 🚀"}
