from flask import Blueprint, request, jsonify
from services import event_service

# Blueprint with no extra prefix here — app.py already adds /events
event_bp = Blueprint("event_bp", __name__)

# POST /events
@event_bp.route("", methods=["POST"])
def create_event():
    data = request.json
    creator_id = data.get("created_by")
    result = event_service.create_event(data, creator_id)
    return jsonify(result), (201 if "event" in result else 400)

# GET /events
@event_bp.route("", methods=["GET"])
def get_events():
    events = event_service.get_events()
    return jsonify(events), 200

# GET /events/<id>
@event_bp.route("/<int:event_id>", methods=["GET"])
def get_event(event_id):
    event = event_service.get_event_by_id(event_id)
    if event:
        return jsonify(event), 200
    return jsonify({"error": "Event not found"}), 404

# PUT /events/<id>
@event_bp.route("/<int:event_id>", methods=["PUT"])
def update_event(event_id):
    data = request.json
    result = event_service.update_event(event_id, data)
    return jsonify(result), (200 if "event" in result else 404)

# DELETE /events/<id>
@event_bp.route("/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    result = event_service.delete_event(event_id)
    return jsonify(result), (200 if "message" in result else 404)

# POST /events/<id>/register
@event_bp.route("/<int:event_id>/register", methods=["POST"])
def register_user(event_id):
    data = request.json
    user_id = data.get("user_id")
    result = event_service.register_user_for_event(event_id, user_id)
    return jsonify(result), (201 if "registration_id" in result else 400)
