# Setup Instructions

## Backend Setup

1. Navigate to backend directory:

```powershell
cd backend
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server:

```powershell
npm run start:dev
```

Backend will run on http://localhost:3000

## Frontend Setup

1. Navigate to frontend directory:

```powershell
cd frontend
```

2. Install dependencies:

```powershell
npm install
```

3. Start the Angular dev server:

```powershell
npm start
```

Frontend will run on http://localhost:4200

## Features Added

### 1. **Custom Quotes Management**

- Add/delete custom daily quotes through admin panel
- Quotes rotate daily based on day of year
- Backend API: `GET/POST/DELETE /api/quotes`

### 2. **Exam Dates Management**

- Add/edit/delete exam dates with times and locations
- Upcoming exams shown in schedule view (next 30 days)
- Backend API: `GET/POST/PUT/DELETE /api/exams`

### 3. **Tasks Management**

- Create tasks with due dates, priority levels, and subjects
- Mark tasks as complete/incomplete
- Incomplete tasks shown in schedule view (sorted by priority)
- Backend API: `GET/POST/PUT/DELETE /api/tasks`

### 4. **Meme Gallery**

- Upload memes with captions and uploader names
- View all memes in grid layout
- Delete memes
- Files stored in `backend/uploads/memes/`
- Backend API: `GET/POST/DELETE /api/memes`

## Admin Panel Access

Navigate to http://localhost:4200/admin or click the ⚙️ button in the schedule view.

### Tabs:

- **מבחנים ומטלות** (Exams & Tasks) - Manage exams and homework
- **ציטוטים יומיים** (Daily Quotes) - Add custom quotes
- **גלריית ממים** (Meme Gallery) - Upload and view memes

## Notes

- All data is currently stored in JSON files in `backend/data/`
- For production, consider migrating to a proper database (PostgreSQL, MongoDB, etc.)
- Update CORS settings in `backend/src/main.ts` for production deployment
- Update API URLs in Angular components when deploying (currently hardcoded to localhost:3000)
