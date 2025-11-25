# TaskFlow - Task Management System

A modern, responsive task management system built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Secure login/logout system
- **Task Management**: Create, read, update, and delete tasks
- **Dashboard**: Overview with task statistics and analytics
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Clean Architecture**: Well-organized code structure with proper separation of concerns

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Notifications**: Sonner

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file with:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── api/           # API interfaces and types
├── app/           # Next.js app router pages
├── components/    # Reusable UI components
├── lib/           # Utilities, stores, and configurations
└── styles/        # Global styles
```

## Key Features

### Authentication
- Secure JWT-based authentication
- Persistent login state with Zustand
- Protected routes with middleware

### Task Management
- Create tasks with title, description, priority, and due date
- Update task status (pending, in-progress, completed)
- Set task priorities (low, medium, high)
- Delete tasks with confirmation

### Dashboard
- Task statistics overview
- Visual task cards with status indicators
- Responsive grid layout
- Quick task creation modal

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-friendly interface

## API Integration

The frontend is designed to work with a REST API backend. Expected endpoints:

- `POST /api/auth/login` - User authentication
- `GET /api/auth/verify` - Token verification
- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Development

- **Linting**: Uses Biome for code formatting and linting
- **Type Safety**: Full TypeScript coverage
- **Component Library**: Radix UI for accessible components
- **Styling**: Tailwind CSS with custom design system

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter
- `npm run lint:fix` - Fix linting issues