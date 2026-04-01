import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime

from models import NoteCreate, NoteUpdate
from db import get_collection
from auth import verify_token

app = FastAPI(title="DevNotes API — Python/FastAPI")

# Allow the React dev server to call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGIN", "http://localhost:8095").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------------------------------- #
# Health check — no auth required. Useful for quickly checking if the server  #
# is up and which backend you're talking to.                                   #
# --------------------------------------------------------------------------- #
@app.get("/health")
def health():
    return {"status": "ok", "backend": "python"}


# --------------------------------------------------------------------------- #
# GET /notes — return all notes belonging to the logged-in user                #
# --------------------------------------------------------------------------- #
@app.get("/notes")
async def get_notes(uid: str = Depends(verify_token)):
    collection = get_collection()
    notes = list(collection.find({"uid": uid}).sort("created_at", -1))
    for note in notes:
        note["_id"] = str(note["_id"])   # ObjectId is not JSON-serialisable
    return notes


# --------------------------------------------------------------------------- #
# POST /notes — create a new note                                               #
# --------------------------------------------------------------------------- #
@app.post("/notes", status_code=201)
async def create_note(note: NoteCreate, uid: str = Depends(verify_token)):
    collection = get_collection()
    doc = {
        "uid": uid,
        "title": note.title,
        "content": note.content,
        "tag": note.tag,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = collection.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc


# --------------------------------------------------------------------------- #
# PUT /notes/{id} — update an existing note (only if it belongs to the user)  #
# --------------------------------------------------------------------------- #
@app.put("/notes/{note_id}")
async def update_note(note_id: str, note: NoteUpdate, uid: str = Depends(verify_token)):
    collection = get_collection()
    updates = {k: v for k, v in note.model_dump(exclude_unset=True).items()}
    updates["updated_at"] = datetime.utcnow()

    result = collection.find_one_and_update(
        {"_id": ObjectId(note_id), "uid": uid},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail="Note not found")

    result["_id"] = str(result["_id"])
    return result


# --------------------------------------------------------------------------- #
# DELETE /notes/{id} — delete a note (only if it belongs to the user)          #
# --------------------------------------------------------------------------- #
@app.delete("/notes/{note_id}", status_code=204)
async def delete_note(note_id: str, uid: str = Depends(verify_token)):
    collection = get_collection()
    result = collection.delete_one({"_id": ObjectId(note_id), "uid": uid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Note not found")
