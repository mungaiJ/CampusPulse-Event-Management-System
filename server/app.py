"""
app.py

Main entry point of the backend application.

Responsibilities:
- Creates the Flask application
- Enables CORS so the React frontend can communicate with the backend
- Registers all API routes (authentication and event routes)
- Starts the backend server

This file connects the whole backend together.
"""

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return {"message": "CampusPulse API running"}

if __name__ == "__main__":
    app.run(debug=True)