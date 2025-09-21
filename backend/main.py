# backend/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# These are our custom modules we built earlier
import models
import httpx # Add this import to the top of your file with the others
from database import SessionLocal, engine
N8N_WEBHOOK_URL = "https://iliken8n.app.n8n.cloud/webhook-test/ff435c23-1851-4491-8da3-f2cc4ee1070a" 
# This line ensures our tables are created when the app starts
models.Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas (Data Contracts) ---

class PlanUrlUpdate(BaseModel):
    url: str 

class TestBase(BaseModel):
    subject: str
    marks: float

class TestCreate(TestBase):
    studentName: str
    grade: int

class Test(TestBase):
    id: int
    student_id: int

    class Config:
        orm_mode = True

class Student(BaseModel):
    id: int
    name: str
    grade: int
    planUrl: str | None = None
    tests: List[Test] = []

    class Config:
        orm_mode = True

# --- FastAPI App Initialization ---
app = FastAPI()

# --- Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Dependency ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"status": "KlassenKompass Backend is Online", "database": "SQLAlchemy"}


@app.post("/test-result", response_model=Test)
def create_test_result(test: TestCreate, db: Session = Depends(get_db)):
    """
    Logs a new test result. If the student doesn't exist, they are created.
    """
    db_student = db.query(models.Student).filter(models.Student.name == test.studentName).first()

    if db_student is None:
        db_student = models.Student(name=test.studentName, grade=test.grade)
        db.add(db_student)
        db.commit()
        db.refresh(db_student)

    db_test = models.Test(subject=test.subject, marks=test.marks, student_id=db_student.id)
    db.add(db_test)
    db.commit()
    db.refresh(db_test)
    return db_test


@app.get("/dashboard-data", response_model=List[Student])
def get_dashboard_data(db: Session = Depends(get_db)):
    """
    Retrieves all students and their associated test results.
    """
    students = db.query(models.Student).all()
    return students

@app.post("/generate-plan/{student_id}")
def trigger_plan_generation(student_id: int, db: Session = Depends(get_db)):
    """
    Endpoint for the Frontend to trigger the n8n workflow.
    """
    # First, check if the student exists
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    # Trigger the n8n webhook in the background
    try:
        with httpx.Client() as client:
            client.post(N8N_WEBHOOK_URL, json={"student_id": student_id})
    except httpx.RequestError as e:
        # If n8n is down, we don't want to crash our whole app
        print(f"Error calling n8n webhook: {e}")
        raise HTTPException(status_code=500, detail="Failed to start plan generation workflow.")

    return {"status": "Plan generation workflow started successfully"}


@app.put("/student/{student_id}/plan-url", response_model=Student)
def update_plan_url(student_id: int, plan_update: PlanUrlUpdate, db: Session = Depends(get_db)):
    """
    Endpoint for n8n to send the final PDF URL back to us.
    """
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    db_student.planUrl = plan_update.url
    db.commit()
    db.refresh(db_student)
    return db_student