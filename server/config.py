"""
config.py

Stores configuration settings for the application.

Responsibilities:
- Database credentials
- Secret keys
- Environment configuration

Keeping settings here makes the application easier to manage and update.
"""
import os
class Config:

    # postgreSQL connection string
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://postgres:5212112@localhost/campuspulse")

    # disables modification tracking
    SQLALCHEMY_TRACK_MODIFICATIONS = False

        # JWT secret key
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "super-secret-key")