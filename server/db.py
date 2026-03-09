"""
db.py

Handles the connection between the Flask backend and the PostgreSQL database.

Responsibilities:
- Establishes a connection to the campuspulse_db database
- Creates a cursor for executing SQL queries
- Allows other files (routes and services) to interact with the database
"""

from flask_sqlalchemy import SQLAlchemy

#initialize SQLAlchemy db instance
db = SQLAlchemy()