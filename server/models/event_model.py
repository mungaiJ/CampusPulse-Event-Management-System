from db import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    location = db.Column(db.String(150), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False, index=True)
    capacity = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(50), nullable=False, default="Other")  # ✅ added type
    created_by = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    creator = db.relationship("User", back_populates="events_created")
    registrations = db.relationship("Registration", back_populates="event", cascade="all, delete-orphan")

    def to_dict(self):
        registrations_count = len(self.registrations)
        remaining_capacity = self.capacity - registrations_count

        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "event_date": self.event_date.isoformat() if self.event_date else None,
            "capacity": self.capacity,
            "type": self.type,
            "created_by": self.created_by,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "registrations_count": registrations_count,
            "remaining_capacity": remaining_capacity
        }