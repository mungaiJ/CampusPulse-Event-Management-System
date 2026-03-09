"""
registration_model.py

Represents the Registrations table in the database.

This table connects users and events.

Fields include:
- id
- user_id
- event_id
- registration_date

It records which users registered for which events.
"""
from db import db
from datetime import datetime

class Registration(db.Model):
    __tablename__ = "registrations"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", back_populates="registrations")
    event = db.relationship("Event", back_populates="registrations")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "event_id": self.event_id,
            "registered_at": self.registered_at,
        }
