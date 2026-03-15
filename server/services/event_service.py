from db import db
from models.event_model import Event
from models.registration_model import Registration
from models.user_model import User
from datetime import datetime
from sqlalchemy import func

# Create a new event
def create_event(data, creator_id):
    try:
        # Validate required fields
        if not all(k in data for k in ["title", "location", "event_date", "capacity"]):
            return {"error": "Missing required fields"}

        event_date_str = data["event_date"]
        try:
            event_date = datetime.strptime(event_date_str, "%Y-%m-%dT%H:%M")
        except ValueError:
            event_date = datetime.strptime(event_date_str, "%Y-%m-%d %H:%M:%S")

        event = Event(
            title=data["title"].strip(),
            description=data.get("description", "").strip(),
            location=data["location"].strip(),
            event_date=event_date,
            capacity=int(data["capacity"]),
            type=data.get("type", "Other").strip(),
            created_by=creator_id
        )
        db.session.add(event)
        db.session.commit()
        return {"message": "Event created successfully", "event": event.to_dict()}
    except ValueError as e:
        db.session.rollback()
        return {"error": f"Invalid input: {str(e)}"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Server error: {str(e)}"}

# Get all events (optimized with pagination support)
def get_events(page=1, per_page=50):
    try:
        events = Event.query.order_by(Event.event_date).limit(per_page).offset((page - 1) * per_page).all()
        return [event.to_dict() for event in events]
    except Exception as e:
        return {"error": f"Failed to fetch events: {str(e)}"}

# Get a single event by ID
def get_event_by_id(event_id):
    try:
        event = Event.query.get(event_id)
        return event.to_dict() if event else None
    except Exception as e:
        return {"error": f"Failed to fetch event: {str(e)}"}

# Update an event
def update_event(event_id, data):
    try:
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}

        # Update only provided fields
        if "title" in data:
            event.title = data["title"].strip()
        if "description" in data:
            event.description = data["description"].strip()
        if "location" in data:
            event.location = data["location"].strip()
        if "capacity" in data:
            event.capacity = int(data["capacity"])
        if "type" in data:
            event.type = data["type"].strip()

        if "event_date" in data:
            try:
                event.event_date = datetime.strptime(data["event_date"], "%Y-%m-%dT%H:%M")
            except ValueError:
                event.event_date = datetime.strptime(data["event_date"], "%Y-%m-%d %H:%M:%S")

        db.session.commit()
        return {"message": "Event updated successfully", "event": event.to_dict()}
    except ValueError as e:
        db.session.rollback()
        return {"error": f"Invalid input: {str(e)}"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Server error: {str(e)}"}

# Delete an event
def delete_event(event_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}

        db.session.delete(event)
        db.session.commit()
        return {"message": "Event deleted successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to delete event: {str(e)}"}

# Register a user for an event
def register_user_for_event(event_id, user_id):
    try:
        event = Event.query.get(event_id)
        if not event:
            return {"error": "Event not found"}

        # Check if user exists
        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}

        # Check capacity
        registration_count = Registration.query.filter_by(event_id=event_id).count()
        if registration_count >= event.capacity:
            return {"error": "Event is full"}

        # Check if already registered
        existing = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
        if existing:
            return {"error": "User already registered for this event"}

        registration = Registration(user_id=user_id, event_id=event_id, registered_at=datetime.utcnow())
        db.session.add(registration)
        db.session.commit()
        return {"message": "User registered successfully", "registration_id": registration.id}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to register: {str(e)}"}

# Unregister a user from an event
def unregister_user_from_event(event_id, user_id):
    try:
        registration = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
        if not registration:
            return {"error": "User not registered for this event"}

        db.session.delete(registration)
        db.session.commit()
        return {"message": "User unregistered successfully"}
    except Exception as e:
        db.session.rollback()
        return {"error": f"Failed to unregister: {str(e)}"}
