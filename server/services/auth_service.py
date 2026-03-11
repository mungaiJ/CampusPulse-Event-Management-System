"""
auth_service.py

Handles authentication logic such as registering users
and logging users in.
"""

from models.user_model import User
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token


def register_user(data):
    """
    Registers a new user in the system.
    """

    name = data.get("name")
    email = data.get("email").lower().strip()
    password = data.get("password")
    role = data.get("role", "student")

    if not name or not email or not password:
        return {"error": "Name, email, and password are required"}, 400

    existing_user = User.query.filter_by(email=email).first()

    if existing_user:
        return {"error": "User already exists"}, 400

    password_hash = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password_hash=password_hash,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return {"message": "User registered successfully"}, 201


def login_user(data):
    """
    Logs a user in and returns a JWT token.
    """

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"error": "Email and password are required"}, 400

    user = User.query.filter_by(email=email).first()

    if not user:
        return {"error": "User not found"}, 404

    if not check_password_hash(user.password_hash, password):
        return {"error": "Invalid credentials"}, 401

    token = create_access_token(identity=user.id)

    return {
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }, 200