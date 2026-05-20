from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from cv_parser import extract_cv_text
from ai_parser import parse_cv_with_ai

import os
from sqlalchemy import text
from database import engine

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def root():
    return {"message": "API działa"}

@app.post("/upload-cv")
async def upload_cv(file: UploadFile = File(...)):
    try:
        file_path = f"{UPLOAD_DIR}/{file.filename}"

        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        text = extract_cv_text(file_path)
        profile = parse_cv_with_ai(text)

        return {
            "filename": file.filename,
            "status": "uploaded",
            "profile": profile,
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
        }
        
        
@app.get("/jobs/search")
def search_jobs(q: str = ""):
    search = f"%{q}%"

    with engine.connect() as connection:
        result = connection.execute(
            text("""
                SELECT id, title, company, location, url, description, created_at
                FROM jobs
                WHERE
                    title LIKE :search
                    OR company LIKE :search
                    OR location LIKE :search
                    OR description LIKE :search
                ORDER BY created_at DESC
            """),
            {"search": search},
        )

        jobs = []

        for row in result.mappings():
            job = dict(row)
            job["created_at"] = str(job["created_at"])
            jobs.append(job)

        return jobs