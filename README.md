# Freelancer Mini-CRM Backend

A robust backend API for managing freelance work, built with Node.js, Express, TypeScript, and PostgreSQL with Prisma ORM.

## Features

- 👤 User Authentication (JWT)
- 👥 Client Management
- 📊 Project Management
- ⏰ Reminder System
- 📈 Dashboard Analytics
- 🔒 Role-based Access Control

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Zod Validation

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone <https://github.com/Plabss/crm_backend.git>
   cd crm-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
   JWT_SECRET="your-jwt-secret"
   JWT_EXPIRES_IN="7d"
   PORT=5000
   ```

4. Set up the database:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

## Running the Application

- Development mode:
  ```bash
  npm run dev
  ```

- Production build:
  ```bash
  npm run build
  npm start
  ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create a new client
- `GET /api/clients/:client_id` - Get client details
- `PATCH /api/clients/:client_id` - Update client
- `DELETE /api/clients/:client_id` - Delete client

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create a new project
- `GET /api/projects/:project_id` - Get project details
- `PATCH /api/projects/:project_id` - Update project
- `DELETE /api/projects/:project_id` - Delete project
- `GET /api/projects/client/:client_id` - Get client's projects

### Reminders
- `GET /api/reminders` - Get all reminders
- `POST /api/reminders` - Create a new reminder
- `GET /api/reminders/due` - Get due reminders
- `GET /api/reminders/:reminder_id` - Get reminder details
- `PATCH /api/reminders/:reminder_id` - Update reminder
- `POST /api/reminders/toggle/:reminder_id` - Toggle reminder completion
- `DELETE /api/reminders/:reminder_id` - Delete reminder

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed the database
- `npm run db:reset` - Reset the database
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── migrations/         # Database migrations
├── src/
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── routes/            # API routes
│   ├── schemas/           # Validation schemas
│   ├── utils/            # Utility functions
│   └── index.ts          # App entry point
├── package.json
└── tsconfig.json
```
