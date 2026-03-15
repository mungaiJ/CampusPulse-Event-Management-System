#!/usr/bin/env python3
"""
Database initialization script for CampusPulse

This script:
1. Creates all database tables
2. Seeds the database with sample data
3. Creates a test admin user

Usage:
    python init-db.py
"""

import sys
import os

# Add server to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'server'))

from app import app, db
from models import User, Event, Registration
from werkzeug.security import generate_password_hash
from datetime import datetime, timedelta

def init_database():
    """Initialize the database with tables and sample data"""
    with app.app_context():
        print("[1/3] Creating database tables...")
        db.create_all()
        print("✓ Database tables created successfully")

        print("\n[2/3] Checking for existing admin user...")
        admin_exists = User.query.filter_by(email="admin@campuspulse.local").first()
        
        if not admin_exists:
            print("Creating test admin user...")
            admin = User(
                name="Admin User",
                email="admin@campuspulse.local",
                password_hash=generate_password_hash("Admin@12345"),
                role="admin"
            )
            db.session.add(admin)
            db.session.commit()
            print("✓ Admin user created: admin@campuspulse.local / Admin@12345")
        else:
            print("✓ Admin user already exists")

        print("\n[3/3] Creating sample data...")
        
        # Create sample test user
        test_user_exists = User.query.filter_by(email="student@campuspulse.local").first()
        if not test_user_exists:
            test_user = User(
                name="Test Student",
                email="student@campuspulse.local",
                password_hash=generate_password_hash("Student@12345"),
                role="student"
            )
            db.session.add(test_user)
            db.session.commit()
            print("✓ Test student created: student@campuspulse.local / Student@12345")
        else:
            print("✓ Test student already exists")

        # Create sample events
        events_count = Event.query.count()
        if events_count == 0:
            admin_user = User.query.filter_by(role="admin").first()
            
            sample_events = [
                Event(
                    title="Python Workshop",
                    description="Learn Python basics and advanced concepts",
                    location="Tech Lab A",
                    event_date=datetime.utcnow() + timedelta(days=7),
                    capacity=50,
                    type="Workshop",
                    created_by=admin_user.id
                ),
                Event(
                    title="AI & Machine Learning Seminar",
                    description="Introduction to AI and ML technologies",
                    location="Auditorium B",
                    event_date=datetime.utcnow() + timedelta(days=14),
                    capacity=100,
                    type="Seminar",
                    created_by=admin_user.id
                ),
                Event(
                    title="Web Development Conference",
                    description="Latest trends in web development",
                    location="Conference Hall C",
                    event_date=datetime.utcnow() + timedelta(days=21),
                    capacity=150,
                    type="Conference",
                    created_by=admin_user.id
                ),
            ]
            
            for event in sample_events:
                db.session.add(event)
            
            db.session.commit()
            print(f"✓ {len(sample_events)} sample events created")
        else:
            print(f"✓ Events already exist ({events_count} total)")

        print("\n" + "="*50)
        print("Database initialized successfully!")
        print("="*50)
        print("\nYou can now log in with:")
        print("  Email: admin@campuspulse.local")
        print("  Password: Admin@12345")
        print("\nOr test with:")
        print("  Email: student@campuspulse.local")
        print("  Password: Student@12345")

if __name__ == "__main__":
    try:
        init_database()
    except Exception as e:
        print(f"✗ Error initializing database: {str(e)}")
        sys.exit(1)
