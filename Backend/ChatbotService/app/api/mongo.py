from fastapi import APIRouter
from app.db import db

router = APIRouter()

def serialize_doc(doc):
    """Convert MongoDB document into JSON serializable dict"""
    return {
        "_id": str(doc["_id"]),
        "value": doc["value"]
    }

@router.get("/get-all")
def get_all_values():
    """Fetch all documents from MongoDB"""
    docs = db.get_collection("test").find()
    return [serialize_doc(doc) for doc in docs]
