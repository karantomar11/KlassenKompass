# **Teacherboard 🧭 \- Your AI-Powered Classroom Compass**

**KlassenKompass** is an intelligent dashboard built for educators, designed to transform raw student test data into actionable, personalized learning plans. Created during the Buildathon Berlin, this project tackles the critical challenge of providing individualized attention in a classroom setting, empowering teachers to become more effective and students to learn more efficiently.

## **🚀 The Problem**

In a typical classroom of 20+ students, it's impossible for a teacher to manually track the specific conceptual weaknesses of every individual. High-achievers get bored, struggling students are left behind, and the "teaching to the middle" approach prevails. KlassenKompass solves this by acting as an AI teaching assistant, automating the analysis and planning stages of personalized education.

## **✨ Features**

* **Teacher Dashboard:** A clean, intuitive interface displaying the current roster of students for a selected class.  
* **Data-Driven Insights:** Teachers can input student test scores via a simple API, which are then displayed on the dashboard.  
* **AI-Powered Personalization:** With a single click, the teacher can trigger an automated workflow that:  
  1. Analyzes a student's performance.  
  2. Uses the **Hack Club AI** to generate a bespoke, pedagogically sound study plan.  
  3. Delivers this plan as a clean, downloadable **PDF document**.  
* **Asynchronous Workflow:** Plan generation is handled by an n8n automation pipeline, ensuring the UI remains responsive and the teacher is not blocked waiting for the AI.

## **🛠️ Tech Stack & Architecture**

We chose a modern, robust, and scalable three-part architecture to build KlassenKompass, making a strategic pivot during the hackathon to ensure stability and performance.

* **Frontend:** A dynamic and responsive user interface built with **Next.js (React)** and **TypeScript**, styled with **Tailwind CSS**.  
* **Backend:** A powerful and efficient synchronous core built with **Python** and **FastAPI**. It serves data via a REST API and acts as the central hub of the system.  
* **Database:** A local **SQLite** database, professionally managed and architected using **SQLAlchemy** and **Alembic** for migrations. This choice was a pivot from Prisma to resolve system-specific CLI tool failures.  
* **Automation:** An asynchronous workflow orchestrated in **n8n** that handles the "heavy lifting" of AI prompting and PDF generation, triggered by a secure webhook from the backend.

## **⚙️ Running the Project Locally**

### **Prerequisites**

* **Backend:** Python 3.10+, Pip  
* **Frontend:** Node.js, npm  
* **Automation:** An n8n instance (cloud or local)

### **Backend Setup**

1. Navigate to the backend directory: cd backend  
2. Create and activate a virtual environment:  
   python3 \-m venv venv  
   source venv/bin/activate

3. Install dependencies: pip install \-r requirements.txt (Note: you would need to create a requirements.txt file via pip freeze \> requirements.txt)  
4. Run the database migrations: alembic upgrade head  
5. Run the server: uvicorn main:app \--reload  
   * The backend will be live at http://127.0.0.1:8000.

### **Frontend Setup**

1. Navigate to the frontend directory: cd frontend  
2. Install dependencies: npm install  
3. Create a .env.local file and add your backend URL:  
   NEXT\_PUBLIC\_API\_BASE\_URL=\[http://127.0.0.1:8000\](http://127.0.0.1:8000)

4. Run the development server: npm run dev  
   * The frontend will be live at http://localhost:3000.

## **🏆 Buildathon Berlin**

This project was conceived and built during the **Buildathon Berlin** event. It adheres to the theme of **Language, Culture & Education**, with a specific focus on innovating for schools and self-learning by providing a tangible solution to a real-world problem faced by educators in our local communities.