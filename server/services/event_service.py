from db import db
from models.event_model import Event
from models.registration_model import Registration
from datetime import datetime

def create_event(data, creator_id):
    try:
        event = Event(
            title=data["title"],
            description=data.get("description"),
            location=data["location"],
            event_date=datetime.strptime(data["event_date"], "%Y-%m-%d %H:%M:%S"),
            capacity=data["capacity"],
            created_by=creator_id
        )
        db.session.add(event)
        db.session.commit()
        return {"message": "Event created successfully", "event": event.to_dict()}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

def get_events():
    events = Event.query.all()
    return [event.to_dict() for event in events]

def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    return event.to_dict() if event else None

def update_event(event_id, data):
    event = Event.query.get(event_id)
    if not event:
        return {"error": "Event not found"}
    try:
        event.title = data.get("title", event.title)
        event.description = data.get("description", event.description)
        event.location = data.get("location", event.location)
        if data.get("event_date"):
            event.event_date = datetime.strptime(data["event_date"], "%Y-%m-%d %H:%M:%S")
        event.capacity = data.get("capacity", event.capacity)
        db.session.commit()
        return {"message": "Event updated successfully", "event": event.to_dict()}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return {"error": "Event not found"}
    try:
        db.session.delete(event)
        db.session.commit()
        return {"message": "Event deleted successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

def register_user_for_event(event_id, user_id):
    event = Event.query.get(event_id)
    if not event:
        return {"error": "Event not found"}
    if len(event.registrations) >= event.capacity:
        return {"error": "Event is full"}
    existing = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
    if existing:
        return {"error": "User already registered for this event"}
    try:
        registration = Registration(user_id=user_id, event_id=event_id, registered_at=datetime.utcnow())
        db.session.add(registration)
        db.session.commit()
        return {"message": "User registered successfully", "registration_id": registration.id}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}
