"""
app.py

Main entry point of the backend application.

Responsibilities:
- Creates the Flask application
- Enables CORS so the React frontend can communicate with the backend
- Registers all API routes (authentication, event, and user routes)
- Configures performance optimizations and middleware
- Starts the backend server
"""

from flask import Flask, after_this_request
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
from routes.user_routes import user_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS with specific allowed origins
    CORS(app, origins=[
        "https://univibez.netlify.app",
        "http://localhost:3000",
        "http://localhost:5173"  # Vite default
    ], supports_credentials=True)

    # Initialize db, migrations, JWT
    db.init_app(app)
    migrate = Migrate(app, db)
    jwt = JWTManager(app)

    # Performance middleware - add caching headers
    @app.after_request
    def set_response_headers(response):
        # Add security headers
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'SAMEORIGIN'
        
        # Add caching headers for GET requests
        if response.request.method == 'GET':
            response.headers['Cache-Control'] = 'public, max-age=300'  # 5 minutes
        else:
            response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
        
        return response

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(event_bp, url_prefix="/events")
    app.register_blueprint(user_bp, url_prefix="/users")

    @app.route("/")
    def home():
        return {"message": "CampusPulse API running"}

    @app.route("/health")
    def health():
        return {"status": "healthy"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(port=5555, debug=True)
