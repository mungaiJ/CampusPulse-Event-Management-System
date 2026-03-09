"""
event_model.py

Represents the Events table in the database.

Fields include:
- id
- title
- description
- event_date
- location
- capacity

This model stores all campus events created in the system.
"""
from db import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(150))
    event_date = db.Column(db.DateTime, nullable=False)
    capacity = db.Column(db.Integer)
    created_by = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    creator = db.relationship("User", back_populates="events_created")
    registrations = db.relationship(
        "Registration", back_populates="event", cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "event_date": self.event_date,
            "capacity": self.capacity,
            "created_by": self.created_by,
            "created_at": self.created_at,
        }
