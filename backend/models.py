# backend/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = "students"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    grade = Column(Integer)
    planUrl = Column(String, nullable=True)
    tests = relationship("Test", back_populates="student")

class Test(Base):
    __tablename__ = "tests"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String)
    marks = Column(Float)
    student_id = Column(Integer, ForeignKey("students.id"))
    student = relationship("Student", back_populates="tests")