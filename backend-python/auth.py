import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Header, HTTPException
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin SDK once at module load
# firebase-creds.json is the service account key downloaded from Firebase Console
if not firebase_admin._apps:
    creds_json = os.getenv("FIREBASE_CREDS_JSON")
    if creds_json:
        import json
        cred = credentials.Certificate(json.loads(creds_json))
    else:
        cred = credentials.Certificate(os.getenv("FIREBASE_CREDS", "firebase-creds.json"))
    firebase_admin.initialize_app(cred)


async def verify_token(authorization: str = Header(...)) -> str:
    """
    FastAPI dependency. Extracts the Bearer token from the Authorization header,
    verifies it with Firebase, and returns the user's UID.

    Usage:  uid: str = Depends(verify_token)
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split(" ")[1]

    try:
        decoded = auth.verify_id_token(token)
        return decoded["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
