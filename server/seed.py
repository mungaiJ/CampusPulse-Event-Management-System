from app import app, db
from models import User, Event, Registration
from datetime import datetime, timedelta
from faker import Faker
import random

fake = Faker()

def seed_data():
    with app.app_context():
        # Optional: clear existing data
        db.drop_all()
        db.create_all()

        # Create sample users
        users = []
        for i in range(3):  # 3 users
            user = User(
                name=fake.name(),
                email=fake.unique.email(),
                password_hash="hashedpw",  # placeholder
                role=random.choice(["student", "admin"])
            )
            users.append(user)
            db.session.add(user)

        db.session.commit()

        # Create 5 events
        events = []
        for i in range(5):
            creator = random.choice(users)
            event = Event(
                title=fake.catch_phrase(),
                description=fake.text(max_nb_chars=200),
                location=fake.city(),
                event_date=datetime.utcnow() + timedelta(days=random.randint(1, 30)),
                capacity=random.randint(50, 200),
                creator=creator
            )
            events.append(event)
            db.session.add(event)

        db.session.commit()

        # Create registrations (random users register for random events)
        for user in users:
            event = random.choice(events)
            registration = Registration(user=user, event=event)
            db.session.add(registration)

        db.session.commit()

        print("Database seeded successfully with users, events, and registrations!")

if __name__ == "__main__":
    seed_data()
