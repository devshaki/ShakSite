# ShakSite - Class Schedule Application

A comprehensive class schedule management system with exam tracking, task management, daily quotes, and meme gallery.

## Project Structure

```
ShakSite/
├── frontend/          # Angular application
├── backend/           # NestJS API server
├── SETUP.md          # Detailed setup instructions
└── README.md         # This file
```

## Quick Start

### Backend Setup

1. Navigate to backend and install dependencies:
```bash
cd backend
npm install
```

2. Start the backend server:
```bash
npm run start:dev
```
Backend runs on http://localhost:3000

### Frontend Setup

1. Navigate to frontend and install dependencies:
```bash
cd frontend
npm install
```

2. Start the Angular dev server:
```bash
npm start
```
Frontend runs on http://localhost:4200

## Features

- 📅 **Class Schedule** - View weekly timetable with groups A/B
- ⏰ **Live Timer** - Current period indicator with countdown
- 📝 **Exam Tracking** - Manage upcoming exams with dates and locations
- ✅ **Task Management** - Create and track homework/assignments
- 💬 **Daily Quotes** - Custom rotating quotes system
- 😂 **Meme Gallery** - Upload and share class memes
- 🎨 **Catppuccin Themes** - Four beautiful theme variants
- 🌐 **RTL Support** - Full Hebrew language support

## Tech Stack

- **Frontend**: Angular 21 with standalone components and signals
- **Backend**: NestJS with file-based storage
- **Styling**: SCSS with Catppuccin color scheme
- **File Upload**: Multer for meme storage

## Admin Panel

Access at http://localhost:4200/admin

- Manage exams and tasks
- Add custom daily quotes
- Upload and manage memes

## Documentation

See [SETUP.md](SETUP.md) for detailed setup instructions and API documentation.

## Development

Frontend built with [Angular CLI](https://github.com/angular/angular-cli) version 21.0.2.
Backend built with [NestJS](https://nestjs.com/) version 10.3.0.

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
