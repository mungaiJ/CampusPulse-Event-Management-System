# CampusPulse Project
**Flask**, **SQLAlchemy**, and **PostgreSQL**.

---
## This is about the .env file on creating it on your side
# Environment Variables

Copy the example environment file:

```bash
# Mac/Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env
```
## Edit .env and set your own PostgreSQL credentials:

DB_USER=postgres
DB_PASSWORD=your_password_here
DB_HOST=localhost
DB_NAME=campuspulse

Note: .env is ignored by Git. Do not push your real password.

# Database Setup

Open PostgreSQL or pgAdmin and create the database:

```sql
CREATE DATABASE campuspulse;
```
## Run migrations (if using Flask-Migrate):

```bash
    flask db upgrade
```

## Or create tables manually from Python:
```bash
from app import db

db.create_all()
```
