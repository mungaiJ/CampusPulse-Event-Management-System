"""
app.py

Main entry point of the backend application.

Responsibilities:
- Creates the Flask application
- Enables CORS so the React frontend can communicate with the backend
- Registers all API routes (authentication and event routes)
- Starts the backend server

This file connects the whole backend together.
"""

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from config import Config
from db import db

from models import User, Event, Registration

# Import route blueprints
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# Initialize db
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(event_bp, url_prefix="")

if __name__ == "__main__":
    app.run(debug=True)
