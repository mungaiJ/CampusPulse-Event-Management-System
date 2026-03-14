"""
app.py

Main entry point of the backend application.

Responsibilities:
- Creates the Flask application
- Enables CORS so the React frontend can communicate with the backend
- Registers all API routes (authentication, event, and user routes)
- Starts the backend server
"""

from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

from config import Config
from db import db

# Import models so migrations can detect them
from models import User, Event, Registration

# Import route blueprints
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp
from routes.user_routes import user_bp   # ✅ new user routes

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS
    CORS(app, origins=["https://univibez.netlify.app"])

    # Initialize db, migrations, JWT
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(event_bp, url_prefix="/events")
    app.register_blueprint(user_bp, url_prefix="/users")  # ✅ register user routes

    @app.route("/")
    def home():
        return {"message": "CampusPulse API running"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5555, debug=True)
