"""
auth_service.py

Handles authentication logic such as registering users
and logging users in with improved error handling and validation.
"""

from models.user_model import User
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
import re


def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password(password):
    """Validate password strength"""
    if len(password) < 8:
        return False, "Password must be at least 8 characters"
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit"
    return True, "Password is valid"


def register_user(data):
    """
    Registers a new user in the system with validation.
    """
    try:
        name = data.get("name", "").strip()
        email = data.get("email", "").lower().strip()
        password = data.get("password", "")
        role = data.get("role", "student").lower().strip()

        # Validate inputs
        if not name:
            return {"error": "Name is required"}, 400
        if not email:
            return {"error": "Email is required"}, 400
        if not password:
            return {"error": "Password is required"}, 400

        # Validate email format
        if not validate_email(email):
            return {"error": "Invalid email format"}, 400

        # Validate password strength
        is_valid, message = validate_password(password)
        if not is_valid:
            return {"error": message}, 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return {"error": "Email already registered. Please log in or use a different email."}, 400

        # Validate role
        valid_roles = ["student", "lecturer", "staff", "admin"]
        if role not in valid_roles:
            role = "student"

        # Create new user
        password_hash = generate_password_hash(password)
        new_user = User(
            name=name,
            email=email,
            password_hash=password_hash,
            role=role
        )

        db.session.add(new_user)
        db.session.commit()

        return {
            "message": "User registered successfully",
            "user": new_user.to_dict()
        }, 201

    except Exception as e:
        db.session.rollback()
        return {"error": f"Registration failed: {str(e)}"}, 500


def login_user(data):
    """
    Logs a user in and returns a JWT token with improved error handling.
    """
    try:
        email = data.get("email", "").lower().strip()
        password = data.get("password", "")

        if not email:
            return {"error": "Email is required"}, 400
        if not password:
            return {"error": "Password is required"}, 400

        user = User.query.filter_by(email=email).first()

        if not user:
            return {"error": "Invalid email or password"}, 401

        if not check_password_hash(user.password_hash, password):
            return {"error": "Invalid email or password"}, 401

        token = create_access_token(identity=user.id)

        return {
            "message": "Login successful",
            "token": token,
            "user": user.to_dict()
        }, 200

    except Exception as e:
        return {"error": f"Login failed: {str(e)}"}, 500
