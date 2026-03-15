from flask import Blueprint, request, jsonify
from services import event_service
from models.registration_model import Registration
from models.user_model import User
from models.event_model import Event

event_bp = Blueprint("event_bp", __name__)

@event_bp.route("", methods=["POST"])
def create_event():
    data = request.json
    creator_id = data.get("created_by")
    result = event_service.create_event(data, creator_id)
    return jsonify(result), (201 if "event" in result else 400)

@event_bp.route("", methods=["GET"])
def get_events():
    events = event_service.get_events()
    return jsonify(events), 200

@event_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = event_service.get_event_by_id(event_id)
    if event:
        return jsonify(event), 200
    return jsonify({"error": "Event not found"}), 404

@event_bp.route("/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    data = request.json
    result = event_service.update_event(event_id, data)
    return jsonify(result), (200 if "event" in result else 404)

@event_bp.route("/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    result = event_service.delete_event(event_id)
    return jsonify(result), (200 if "message" in result else 404)

@event_bp.route("/<int:event_id>/register", methods=["POST"])
def register_user(event_id):
    data = request.json
    user_id = data.get("user_id")
    result = event_service.register_user_for_event(event_id, user_id)
    return jsonify(result), (201 if "registration_id" in result else 400)

@event_bp.route("/<int:event_id>/register", methods=["DELETE"])
def unregister_user(event_id):
    data = request.json
    user_id = data.get("user_id")
    result = event_service.unregister_user_from_event(event_id, user_id)
    return jsonify(result), (200 if "message" in result else 400)

@event_bp.route("/registrations/all", methods=["GET"])
def get_all_registrations():
    """Get all registrations with user and event details for admin dashboard"""
    registrations = Registration.query.all()
    result = []
    for reg in registrations:
        result.append({
            "id": reg.id,
            "user_id": reg.user_id,
            "event_id": reg.event_id,
            "user_name": reg.user.name if reg.user else "Unknown",
            "event_title": reg.event.title if reg.event else "Unknown",
            "registered_at": reg.registered_at.isoformat() if reg.registered_at else None,
        })
    return jsonify(result), 200

@event_bp.route("/search", methods=["GET"])
def search_events():
    """Search and filter events by title, type, location, and date range"""
    query = request.args.get("q", "").lower()
    event_type = request.args.get("type", "").lower()
    location = request.args.get("location", "").lower()
    
    events = Event.query.all()
    
    # Apply filters
    filtered_events = []
    for event in events:
        # Search by title or description
        if query and query not in event.title.lower() and query not in (event.description or "").lower():
            continue
        
        # Filter by type
        if event_type and event.type.lower() != event_type:
            continue
        
        # Filter by location
        if location and location not in event.location.lower():
            continue
        
        filtered_events.append(event.to_dict())
    
    return jsonify(filtered_events), 200

@event_bp.route("/filter", methods=["GET"])
def filter_events():
    """Advanced filtering with capacity and registration status"""
    event_type = request.args.get("type", "").lower()
    location = request.args.get("location", "").lower()
    has_capacity = request.args.get("has_capacity", "").lower() == "true"
    
    events = Event.query.all()
    
    filtered_events = []
    for event in events:
        event_dict = event.to_dict()
        
        # Filter by type
        if event_type and event.type.lower() != event_type:
            continue
        
        # Filter by location
        if location and location not in event.location.lower():
            continue
        
        # Filter by capacity
        if has_capacity and event_dict.get("remaining_capacity", 0) <= 0:
            continue
        
        filtered_events.append(event_dict)
    
    return jsonify(filtered_events), 200

@event_bp.route("/export/csv", methods=["GET"])
def export_events_csv():
    """Export all events as CSV"""
    import csv
    from io import StringIO
    from flask import make_response
    
    events = Event.query.all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Event ID", "Title", "Description", "Location", "Date", "Time",
        "Capacity", "Registrations", "Available Slots", "Type", "Created By"
    ])
    
    # Write data
    for event in events:
        writer.writerow([
            event.id,
            event.title,
            event.description or "",
            event.location,
            event.event_date.strftime("%Y-%m-%d") if event.event_date else "",
            event.event_date.strftime("%H:%M") if event.event_date else "",
            event.capacity,
            len(event.registrations),
            event.capacity - len(event.registrations),
            event.type,
            event.creator.name if event.creator else "Unknown"
        ])
    
    # Create response
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=events_export.csv"
    response.headers["Content-Type"] = "text/csv"
    
    return response, 200

@event_bp.route("/export/registrations/csv", methods=["GET"])
def export_registrations_csv():
    """Export all registrations as CSV"""
    import csv
    from io import StringIO
    from flask import make_response
    
    registrations = Registration.query.all()
    
    # Create CSV
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Registration ID", "User Name", "User Email", "Event Title",
        "Event Date", "Event Location", "Registration Date"
    ])
    
    # Write data
    for reg in registrations:
        writer.writerow([
            reg.id,
            reg.user.name if reg.user else "Unknown",
            reg.user.email if reg.user else "Unknown",
            reg.event.title if reg.event else "Unknown",
            reg.event.event_date.strftime("%Y-%m-%d") if reg.event and reg.event.event_date else "",
            reg.event.location if reg.event else "Unknown",
            reg.registered_at.strftime("%Y-%m-%d %H:%M") if reg.registered_at else ""
        ])
    
    # Create response
    output.seek(0)
    response = make_response(output.getvalue())
    response.headers["Content-Disposition"] = "attachment; filename=registrations_export.csv"
    response.headers["Content-Type"] = "text/csv"
    
    return response, 200

@event_bp.route("/stats", methods=["GET"])
def get_event_stats():
    """Get event statistics for reporting"""
    events = Event.query.all()
    registrations = Registration.query.all()
    users = User.query.all()
    
    # Calculate statistics
    total_capacity = sum(e.capacity for e in events)
    total_registered = len(registrations)
    event_types = {}
    
    for event in events:
        event_type = event.type
        if event_type not in event_types:
            event_types[event_type] = {"count": 0, "registrations": 0}
        event_types[event_type]["count"] += 1
        event_types[event_type]["registrations"] += len(event.registrations)
    
    return jsonify({
        "total_events": len(events),
        "total_registrations": total_registered,
        "total_users": len(users),
        "total_capacity": total_capacity,
        "utilization_rate": round((total_registered / total_capacity * 100) if total_capacity > 0 else 0, 2),
        "by_type": event_types,
        "average_registrations_per_event": round(total_registered / len(events), 2) if events else 0
    }), 200
