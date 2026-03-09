"""
config.py

Stores configuration settings for the application.

Responsibilities:
- Database credentials
- Secret keys
- Environment configuration

Keeping settings here makes the application easier to manage and update.
"""

class Config:

    # postgreSQL connection string
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:5212112@localhost/campuspulse"

    # disables modification tracking
    SQLALCHEMY_TRACK_MODIFICATIONS = False