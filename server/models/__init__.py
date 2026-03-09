"""
models package

Contains data models that represent database tables.

Each model corresponds to a table in the PostgreSQL database.

Examples:
- User model -> users table
- Event model -> events table
- Registration model -> registrations table
"""

from .user_model import User
from .event_model import Event
from .registration_model import Registration

# This ensures that when you import models, all three classes are registered
__all__ = ["User", "Event", "Registration"]
