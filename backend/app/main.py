from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from celery.result import AsyncResult
import requests

from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet

from app.scanner.cve_lookup import lookup_cves
from app.report_generator import generate_report
from app.scanner.cms_detect import detect_cms
from app.scanner.ports import scan_ports
from app.scanner.ssl_check import check_ssl
from app.pdf.report import generate_pdf
from app.database import conn, cursor
from app.auth import hash_password, verify_password, create_access_token
from app.workers.tasks import run_scan
from app.workers.celery_worker import celery

app = FastAPI()

# ==========================================
# CORS MIDDLEWARE SECURE CONFIGURATION
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://your-vercel-app.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# PYDANTIC MODEL SCHEMAS
# ==========================================
class UserAuth(BaseModel):
    username: str
    password: str

class ScanRequest(BaseModel):
    url: str

# ==========================================
# ROUTE ENDPOINTS
# ==========================================

@app.get("/")
def home():
    return {"message": "VulnScan Lite Running"}

@app.post("/scan")
def scan(data: ScanRequest):
    task = run_scan.delay(data.url)
    return {
        "task_id": task.id,
        "status": "Processing"
    }

@app.get("/scan/status/{task_id}")
def get_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery)
    return {
        "task_id": task_id,
        "status": task_result.status,
        "result": task_result.result
    }

@app.get("/history")
def get_history():
    cursor.execute(
        """
        SELECT id, url, score
        FROM scans
        ORDER BY id DESC
        """
    )
    rows = cursor.fetchall()
    history = []
    for row in rows:
        history.append({
            "id": row[0],
            "url": row[1],
            "score": row[2]
        })
    return history

# --- FIXED PDF REPORT GENERATOR ENDPOINT ---
@app.post("/download-report")
async def download_report(request: Request):
    try:
        # Accepts raw dictionary data sent via JSON body body safely
        data = await request.json()
        filename = "security_report.pdf"

        # Generate the document pipeline mapping
        generate_pdf(data, filename)

        return FileResponse(
            path=filename,
            media_type='application/pdf',
            filename=filename
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF engine compile crash error: {str(e)}")

@app.post("/register")
def register(data: dict):
    username = data["username"]
    password = data["password"]

    cursor.execute(
        "SELECT * FROM users WHERE username=?",
        (username,)
    )
    existing_user = cursor.fetchone()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    hashed = hash_password(password)
    cursor.execute(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        (username, hashed)
    )
    conn.commit()

    token = create_access_token({"sub": username})
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.post("/login")
def login(data: dict):
    username = data["username"]
    password = data["password"]

    cursor.execute(
        "SELECT * FROM users WHERE username=?",
        (username,)
    )
    user = cursor.fetchone()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid username"
        )

    stored_password = user[2]
    valid = verify_password(password, stored_password)

    if not valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid password"
        )

    token = create_access_token({"sub": username})
    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.get("/scans")
def get_scans():
    cursor.execute("SELECT * FROM scans ORDER BY id DESC")
    rows = cursor.fetchall()
    scans = []
    for row in rows:
        scans.append({
            "id": row[0],
            "url": row[1],
            "score": row[2],
        })
    return scans

@app.get("/scan/{scan_id}")
def get_scan(scan_id: int):
    cursor.execute(
        "SELECT * FROM scans WHERE id=?",
        (scan_id,)
    )
    scan = cursor.fetchone()
    if not scan:
        raise HTTPException(status_code=404, detail="Not found")
    return {
        "id": scan[0],
        "url": scan[1],
        "score": scan[2]
    }

@app.get("/report/{scan_id}")
def generate_historic_report(scan_id: int):
    cursor.execute(
        "SELECT * FROM scans WHERE id=?",
        (scan_id,)
    )
    scan = cursor.fetchone()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")

    filename = f"report_{scan_id}.pdf"
    doc = SimpleDocTemplate(filename)
    styles = getSampleStyleSheet()
    elements = []

    elements.append(Paragraph("VulnScan Lite Security Report", styles["Title"]))
    elements.append(Spacer(1, 20))
    elements.append(Paragraph(f"Target URL: {scan[1]}", styles["BodyText"]))
    elements.append(Paragraph(f"Security Score: {scan[2]}", styles["BodyText"]))
    
    doc.build(elements)
    return FileResponse(
        filename,
        media_type="application/pdf",
        filename=filename
    )
