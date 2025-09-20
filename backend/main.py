# backend/main.py

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# These are our custom modules we built earlier
import models
from database import SessionLocal, engine

# This line ensures our tables are created when the app starts
models.Base.metadata.create_all(bind=engine)

# --- Pydantic Schemas (Data Contracts) ---

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