from db import db
from models.event_model import Event
from models.registration_model import Registration
from datetime import datetime

# Create a new event
def create_event(data, creator_id):
    try:
        event_date_str = data["event_date"]
        try:
            event_date = datetime.strptime(event_date_str, "%Y-%m-%dT%H:%M")
        except ValueError:
            event_date = datetime.strptime(event_date_str, "%Y-%m-%d %H:%M:%S")

        event = Event(
            title=data["title"],
            description=data.get("description"),
            location=data["location"],
            event_date=event_date,
            capacity=int(data["capacity"]),
            type=data.get("type", "Other"), 
            created_by=creator_id
        )
        db.session.add(event)
        db.session.commit()
        return {"message": "Event created successfully", "event": event.to_dict()}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

# Get all events
def get_events():
    events = Event.query.all()
    return [event.to_dict() for event in events]

# Get a single event by ID
def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    return event.to_dict() if event else None

# Update an event
def update_event(event_id, data):
    event = Event.query.get(event_id)
    if not event:
        return {"error": "Event not found"}
    try:
        # Update event details
        event.title = data.get("title", event.title)
        event.description = data.get("description", event.description)
        event.location = data.get("location", event.location)

        if data.get("event_date"):
            try:
                event.event_date = datetime.strptime(data["event_date"], "%Y-%m-%dT%H:%M")
            except ValueError:
                event.event_date = datetime.strptime(data["event_date"], "%Y-%m-%d %H:%M:%S")

        event.capacity = int(data.get("capacity", event.capacity))
        event.type = data.get("type", event.type)  # ✅ Update the 'type' field if provided
        db.session.commit()
        return {"message": "Event updated successfully", "event": event.to_dict()}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}

# Delete an event
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

# Register a user for an event
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

# Unregister a user from an event
def unregister_user_from_event(event_id, user_id):
    registration = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
    if not registration:
        return {"error": "User not registered for this event"}
    try:
        db.session.delete(registration)
        db.session.commit()
        return {"message": "User unregistered successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": str(e)}