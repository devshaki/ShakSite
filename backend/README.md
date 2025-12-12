# ShakSite Backend

NestJS backend for the ShakSite schedule application.

## Features

- **Quotes API**: Manage daily quotes (GET, POST, DELETE)
- **Exams API**: Manage exam dates (GET, POST, PUT, DELETE)
- **Tasks API**: Manage tasks (GET, POST, PUT, DELETE)
- **Memes API**: Upload and manage memes with file storage (GET, POST with file upload, DELETE)

## Setup

### Installation

```bash
cd backend
npm install
```

### Run Development Server

```bash
npm run start:dev
```

The backend will run on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Quotes

- `GET /api/quotes` - Get all quotes
- `POST /api/quotes` - Create a new quote
  ```json
  {
    "text": "Quote text",
    "author": "Author name (optional)",
    "addedDate": "2025-12-12T00:00:00.000Z"
  }
  ```
- `DELETE /api/quotes/:id` - Delete a quote

### Exams

- `GET /api/exams` - Get all exams
- `POST /api/exams` - Create a new exam
  ```json
  {
    "subject": "Subject name",
    "date": "2025-01-15",
    "time": "09:00",
    "room": "Room 101",
    "notes": "Additional notes"
  }
  ```
- `PUT /api/exams/:id` - Update an exam
- `DELETE /api/exams/:id` - Delete an exam

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title",
    "description": "Task description",
    "dueDate": "2025-12-20",
    "subject": "Subject name",
    "completed": false,
    "priority": "high"
  }
  ```
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Memes

- `GET /api/memes` - Get all memes metadata
- `POST /api/memes/upload` - Upload a new meme (multipart/form-data)
  - `file`: Image file (required)
  - `caption`: Caption text (optional)
  - `uploadedBy`: Uploader name (optional)
- `DELETE /api/memes/:id` - Delete a meme
- `GET /uploads/memes/:filename` - Access uploaded meme images

## Data Storage

- Data is stored in JSON files in `backend/data/`
- Uploaded memes are stored in `backend/uploads/memes/`
- These directories are automatically created on first run

## CORS

CORS is enabled for `http://localhost:4200` (Angular dev server)

## File Upload Limits

- Max file size: 10MB
- Allowed formats: JPG, JPEG, PNG, GIF, WEBP
