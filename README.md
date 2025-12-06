# Task Manager Application

A three-tier Node.js application with Express.js backend, HTML/CSS/JS frontend, and SQLite database.

## Table of Contents
- [Project Overview](#project-overview)
- [Structure](#structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Development](#development)

## Project Overview
This is a full-stack task manager application featuring a clean user interface and RESTful API. The application enables users to create, view, update, and delete tasks. It implements a separation of concerns with a dedicated backend and frontend.

## Structure
```
├── backend/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── database/
    └── tasks.db
```

## Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd my-first-fullstack-app
   ```

2. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

3. (Optional) Create a `.env` file in the backend directory for environment variables:
   ```
   PORT=3000
   DB_PATH=../database/tasks.db
   ```

## Usage
1. Make sure you're in the backend directory
2. Start the server:
   ```bash
   npm start
   ```

   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the application

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Features

- Add new tasks with title and description
- View all tasks with creation date
- Mark tasks as completed/incomplete
- Delete tasks
- Responsive design
- RESTful API architecture
- SQLite database for data persistence

## Development

### Backend (Express.js)
- Navigate to `/backend` directory
- Run `npm run dev` for development mode with auto-restart
- Server runs by default on port 3000

### Frontend
- Static files located in `/frontend` directory
- HTML, CSS, and JavaScript files
- Communicates with backend via AJAX calls to the API endpoints

### Database
- SQLite database stored in `/database/tasks.db`
- Schema is automatically created if the database file doesn't exist