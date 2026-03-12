from flask import Blueprint, jsonify
from models.user_model import User

user_bp = Blueprint("user", __name__, url_prefix="/users")

@user_bp.route("/<int:user_id>/events", methods=["GET"])
def get_user_events(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Use the relationship: user.registrations
    events = [reg.event.to_dict() for reg in user.registrations]
    return jsonify(events), 200
