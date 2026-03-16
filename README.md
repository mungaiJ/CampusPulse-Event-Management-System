# CampusPulse – Event Management System

A full-stack campus event management platform that allows students to discover, register, and manage university events in one place.

![React](https://img.shields.io/badge/Frontend-React-blue)
![Vite](https://img.shields.io/badge/Build-Vite-purple)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Netlify](https://img.shields.io/badge/Frontend%20Hosting-Netlify-green)
![Render](https://img.shields.io/badge/Backend%20Hosting-Render-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

# Table of Contents

- Overview  
- Features  
- Live Application  
- Demo Account  
- System Architecture  
- Technologies Used  
- Project Structure  
- Installation Guide  
- Backend Setup  
- Database Setup  
- Run the Backend  
- Frontend Setup  
- API Endpoints  
- Deployment  
- Environment Variables  
- Future Improvements  
- Contributors  
- License  
---

# Overview

CampusPulse is a full-stack web application designed to help universities and campus communities organize, manage, and participate in events. The platform allows users to browse campus events, register for events, and manage their participation through a simple and intuitive interface.

The system consists of:

* A **frontend client** built with React and powered by Vite  
* A **backend API** built using Flask  
* A **database** managed with PostgreSQL  
* Deployment through Netlify for the frontend and Render for the backend  

CampusPulse helps students easily discover campus activities such as tech meetups, workshops, seminars, and social gatherings.

---

# Features

## User Authentication

* User registration  
* User login and authentication  
* Secure session handling  

## Event Management

* View available campus events  
* Event details display  
* Register for events  

## Event Participation

* Students can register for events  
* Backend tracks event registrations  

## Responsive Interface

* Modern and responsive UI built with React  
* Fast development using Vite  

---

# Live Application

Frontend  
https://univibez.netlify.app/

Backend API  
https://campuspulse-event-management-system.onrender.com

---

# Demo Account

For quick system testing and evaluation, use the demo credentials below to enter the Admin side.

| Field | Value |
|------|------|
| Email | josephmungai028@gmail.com |
| Password | 123456 |

Login through the frontend application:

https://univibez.netlify.app/

---

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

* Netlify (Frontend)  
* Render (Backend + Database)  

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
```

Activate the virtual environment:

Mac/Linux

```bash
source venv/bin/activate
```

Windows

```bash
venv\Scripts\activate
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

The API will run at:

```
http://127.0.0.1:5555
```

---

# Frontend Setup

Navigate to the frontend folder:

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

The frontend will run at:

```
http://localhost:5173
```

---

# API Endpoints

## Authentication

### Register User

```
POST /register
```

Request Body

```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

---

### Login User

```
POST /login
```

Example Response

```json
{
  "message": "Login successful",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "role": "admin"
  }
}
```

---

## Events

### Get All Events

```
GET /events
```

Example Response

```json
{
  "id": 2,
  "title": "Coding for Beginners Workshop",
  "type": "Workshop",
  "location": "Computer Lab A, Main Campus",
  "capacity": 50,
  "registrations_count": 1,
  "remaining_capacity": 49
}
```

---

### Register for an Event

```
POST /events/{eventId}/register
```

Example:

```
POST /events/1/register
```

---

# Deployment

## Backend Deployment (Render)

1. Push backend code to GitHub  
2. Create a Web Service on Render  
3. Set **root directory** to `server`

Build command:

```
pip install -r requirements.txt
```

Start command:

```
gunicorn wsgi:app
```

---

## Frontend Deployment (Netlify)

1. Connect GitHub repository  
2. Set build command:

```
pnpm run dev
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
* Email notifications for event registration  
* QR code event check-in system  

---

# Contributors

| Name |
|-----|
| Fridah Nzomo |
| Joseph Mungai |
| Mary Kimani |
| Kevin Owino |
| Brian Melita |

---
# License

This project is open-source and available under the MIT License.

---
