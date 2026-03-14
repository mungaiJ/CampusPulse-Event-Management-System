"""
auth_routes.py

Defines authentication API endpoints.
"""

from flask import Blueprint, request, jsonify
from services.auth_service import register_user, login_user

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    API endpoint for registering a new user.
    Allowed roles: student, lecturer, staff
    """
    data = request.get_json()

    allowed_roles = {"student", "lecturer", "staff"}
    role = data.get("role", "").strip().lower()

    if role not in allowed_roles:
        return jsonify({"error": "Invalid role. Must be student, lecturer, or staff."}), 400

    data["role"] = role  # normalize role

    response, status = register_user(data)
    return jsonify(response), status

@auth_bp.route("/login", methods=["POST"])
def login():
    """
    API endpoint for logging in a user.
    """
    data = request.get_json()
    response, status = login_user(data)
    return jsonify(response), status
