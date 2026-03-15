from flask import Blueprint, jsonify
from models.user_model import User
from models.registration_model import Registration
from db import db

user_bp = Blueprint("user", __name__, url_prefix="/users")

@user_bp.route("/<int:user_id>/events", methods=["GET"])
def get_user_events(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Use the relationship: user.registrations
    events = [reg.event.to_dict() for reg in user.registrations]
    return jsonify(events), 200

@user_bp.route("/all", methods=["GET"])
def get_all_users():
    """Get all users for admin dashboard"""
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    """Delete a user and cascade delete their registrations and events"""
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
