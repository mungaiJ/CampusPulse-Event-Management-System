# CampusPulse Setup Guide

## Prerequisites

- Node.js & npm (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL database (Neon or local)

## Environment Setup

### 1. Backend Environment Variables

Create `server/.env` file with your database credentials:

```env
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=your_db_host.neon.tech
DB_PORT=5432
DB_NAME=your_db_name
JWT_SECRET_KEY=your_secret_key_here
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
pip install -r requirements.txt
```

**Frontend:**
```bash
cd client
npm install
# or
pnpm install
```

## Database Initialization

### Option A: Using the Init Script (Recommended)

```bash
cd scripts
python init-db.py
```

This will:
- Create all database tables
- Add a test admin user (admin@campuspulse.local)
- Add a test student user (student@campuspulse.local)
- Create 3 sample events

### Option B: Using Flask Migrations

```bash
cd server
python -m flask db upgrade
```

### Option C: Using Seed Script

```bash
cd server
python seed.py
```

## Running the Application

### Backend (Terminal 1)

```bash
cd server
python app.py
```

The backend will run on `http://localhost:5555`

### Frontend (Terminal 2)

```bash
cd client
npm run dev
# or
pnpm dev
```

The frontend will run on `http://localhost:5173` or `http://localhost:3000`

## Testing Login

### Test Credentials

After running the init script, use these credentials:

**Admin Account:**
- Email: `admin@campuspulse.local`
- Password: `Admin@12345`

**Student Account:**
- Email: `student@campuspulse.local`
- Password: `Student@12345`

### Login Flow

1. Go to the Login page
2. Enter email and password
3. Click Login
4. You'll be redirected to:
   - `/admin` if you're an admin
   - `/my-events` if you're a student

## Troubleshooting

### Database Connection Error

**Error:** `can't connect to server: Connection refused`

**Solution:**
1. Check your database credentials in `.env`
2. Ensure your database is running
3. Verify the host, port, and database name are correct

### API Connection Error

**Error:** `Failed to load events` or `Network error`

**Solution:**
1. Ensure backend is running on port 5555
2. Check if CORS is enabled in `server/app.py`
3. Check browser console for specific error messages

### Table Not Found Error

**Error:** `ProgrammingError: relation "users" does not exist`

**Solution:**
1. Run the database initialization script: `python scripts/init-db.py`
2. Or run migrations: `python -m flask db upgrade`

### Port Already in Use

If port 5555 or 5173 is already in use:

```bash
# Change backend port in app.py
python app.py --port 5556

# Change frontend port
npm run dev -- --port 5174
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Events
- `GET /events` - Get all events
- `POST /events` - Create event (admin)
- `PUT /events/<id>` - Update event (admin)
- `DELETE /events/<id>` - Delete event (admin)
- `POST /events/<id>/register` - Register for event
- `DELETE /events/<id>/register` - Unregister from event

### Users
- `GET /users/all` - Get all users (admin)
- `DELETE /users/<id>` - Delete user (admin)

## Project Structure

```
CampusPulse/
├── client/              # React frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable components
│   │   └── services/   # API service calls
│   └── package.json
├── server/             # Flask backend
│   ├── models/         # Database models
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   ├── app.py          # Main app
│   └── requirements.txt
├── scripts/            # Utility scripts
└── README.md
```

## Next Steps

- Create more test events
- Invite users to register
- Test admin dashboard features
- Customize event categories and settings

For more help, check the main README.md file.
