# CampusPulse – Event Management System

## Overview

CampusPulse is a full-stack web application designed to help universities and campus communities organize, manage, and participate in events. The platform allows users to browse campus events, register for events, and manage their participation through a simple and intuitive interface.

The system consists of:

* A **frontend client** built with React and powered by Vite.
* A **backend API** built using Flask.
* A **database** managed with PostgreSQL.
* Deployment through Netlify for the frontend and Render for the backend.

CampusPulse helps students easily discover campus activities such as tech meetups, workshops, seminars, and social gatherings.

---

# Features

### User Authentication

* User registration
* User login and authentication
* Secure session handling

### Event Management

* View available campus events
* Event details display
* Register for events

### Event Participation

* Students can register for events
* Backend tracks event registrations

### Responsive Interface

* Modern and responsive UI built with React
* Fast development using Vite

---

### Live Application

Frontend:
https://univibez.netlify.app/

Backend API:
https://campuspulse-event-management-system.onrender.com

# System Architecture

The project follows a **full-stack architecture**:

Frontend → Backend API → Database

```
User Browser
      │
      ▼
Frontend (React + Vite)
      │
      ▼
Backend API (Flask)
      │
      ▼
Database (PostgreSQL)
```

---

# Technologies Used

## Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

## Backend

* Flask
* SQLAlchemy
* Flask-CORS
* Gunicorn

## Database

* PostgreSQL

## Deployment

* Netlify(Frontend)
* Render(Backend + Database)

## Version Control

* Git
* GitHub

---

# Project Structure

```
CampusPulse-Event-Management-System
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   │
│   └── package.json
│
└── server
    ├── app.py
    ├── models.py
    ├── routes
    ├── config.py
    └── requirements.txt
```

---

# Installation Guide

## 1. Clone the Repository

```bash
git clone https://github.com/mungaiJ/CampusPulse-Event-Management-System.git
cd CampusPulse-Event-Management-System
```

---

# Backend Setup

Navigate to the backend folder:

```bash
cd server
```

Create a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# Database Setup

Start PostgreSQL:

```bash
sudo service postgresql start
```

Create the database:

```sql
CREATE DATABASE campuspulse;
```

Set the database environment variable:

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/campuspulse
```

---

# Run the Backend

Start the Flask server:

```bash
python app.py
```

The API will run on:

```
http://127.0.0.1:5555
```

---

# Frontend Setup

Navigate to the client folder:

```bash
cd client
```

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm run dev
```

The frontend will run on:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

### Register User

```
POST /register

Request Body

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}

```

### Login User

```
POST /login

Request Body

{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc3MzYwMTkxNywianRpIjoiMDhhOTYyNmUtNDMyYy00N2FjLTliNWItN2E0NWEzMThhYmY2IiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzczNjAxOTE3LCJjc3JmIjoiOWU2OGRhMzktNmJlNi00NWIyLTg5NDAtNWMyOTc3Nzc1MjU4IiwiZXhwIjoxNzczNjAyODE3fQ.BVL1wEjAn1Y_6neTn7X5ENvH7oT5FjI8SARbFWZLC3k",
    "user": {
        "created_at": "Sat, 14 Mar 2026 00:58:28 GMT",
        "email": "test@example.com",
        "id": 1,
        "name": "Test User",
        "role": "admin"
    }
}

```

---

## Events

### Get All Events

```
GET /events/id

Response

{
    "capacity": 50,
    "created_at": "2026-03-14T11:27:38.729250",
    "created_by": 2,
    "description": "This hands-on workshop is designed for students who are new to programming. Participants will learn the fundamentals of Python, including basic syntax, data types, and simple projects. No prior experience is required, and attendees will have the chance to ask questions and practice coding in real time.",
    "event_date": "2026-03-25T10:00:00",
    "id": 2,
    "location": "Computer Lab A, Main Campus",
    "registrations_count": 1,
    "remaining_capacity": 49,
    "title": "Coding for Beginners Workshop",
    "type": "Workshop"
}
```

### Register for an Event

```
POST /events/{eventId}/register
```
Example:

POST /events/1/register

---

# Deployment

## Backend Deployment (Render)

1. Push backend code to GitHub
2. Create a Web Service on Render
3. Set root directory to `server`
4. Add build command:

```
pip install -r requirements.txt
```

5. Start command:

```
gunicorn app:app
```

---

## Frontend Deployment (Netlify)

1. Connect GitHub repository
2. Set build command:

```
npm run build
```

3. Publish directory:

```
dist
```

---

# Environment Variables

Backend environment variables:

```
DATABASE_URL
SECRET_KEY
JWT_SECRET
```

---

# Future Improvements

* Event search and filtering enhancement
* Event categories
* Admin dashboard
* Event creation and management
* Email notifications for event registration and for upcoming events.
* QR code event check-in system

---

# Contributors

* Project developed by the CampusPulse team.

---

# License

This project is open-source and available under the MIT License.

---

# Acknowledgements

Special thanks to the open-source community and documentation resources that supported the development of this project.
