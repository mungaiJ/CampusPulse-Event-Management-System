"""
user_model.py

Represents the Users table in the database.

Fields include:
- id
- name
- email
- password
- role

This model is used for authentication and user management.
"""
from db import db
from datetime import datetime

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="student")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    events_created = db.relationship(
        "Event", back_populates="creator", cascade="all, delete-orphan"
    )
    registrations = db.relationship(
        "Registration", back_populates="user", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at,
        }
