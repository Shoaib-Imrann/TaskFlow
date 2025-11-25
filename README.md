# TaskFlow - Task Management System

A modern, full-featured task management application with authentication, multiple view modes, and real-time statistics.

## Features

- **Authentication**: JWT-based login/signup with protected routes
- **Task Management**: Full CRUD operations with filtering, sorting, and search
- **Multiple Views**: Kanban board and list view with drag-and-drop
- **Task Categories**
- **Priority Levels**
- **Status Tracking**
- **Dashboard Stats**
- **Responsive Design**


## Tech Stack

- **Framework**: Next.js 16 
- **UI Library**: React 19, TypeScript
- **Styling**: Tailwind CSS 4, Radix UI primitives
- **State Management**: Zustand (auth & tasks stores)
- **HTTP Client**: Axios with interceptors
- **Form Handling**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit for Kanban board
- **Date Handling**: date-fns, react-day-picker
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React
- **Code Quality**: Biome (linting & formatting)

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Backend API running (see TaskFlow-api)

### Installation

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Set up environment variables**:
   Create a `.env` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Credentials
```
Email: admin@gmail.com
Password: admin123
```

## Project Structure

```
src/
├── api/
│   └── tasks.ts              # API client for task operations
├── app/
│   ├── admin/                # Admin panel page
│   ├── dashboard/            # Main dashboard page
│   ├── login/                # Login/signup page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Landing page
├── components/
│   ├── ui/                   # Radix UI components (button, dialog, etc.)
│   ├── dashboard-stats.tsx   # Statistics cards
│   ├── task-card.tsx         # Individual task card
│   ├── task-details-modal.tsx # Task view/edit modal
│   ├── task-form.tsx         # Task creation/edit form
│   ├── task-kanban-view.tsx  # Kanban board with drag-drop
│   ├── task-list-view.tsx    # List view with table
│   └── countdown-timer.tsx   # Due date countdown
├── lib/
│   ├── auth-store.ts         # Zustand auth state
│   ├── tasks-store.ts        # Zustand tasks state
│   ├── axios.ts              # Axios instance with auth
│   ├── validation.ts         # Zod schemas
│   └── utils.ts              # Helper functions
└── styles/
    └── globals.css           # Global styles
```

## API Integration

Integrates with FastAPI backend (TaskFlow-api). Endpoints:

### Auth
- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user info

### Tasks
- `GET /tasks` - List tasks (with pagination, search, filters)
- `GET /tasks/stats` - Get task statistics
- `POST /tasks` - Create new task
- `GET /tasks/{id}` - Get single task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Query Parameters
- `search` - Search in title/description
- `category` - Filter by category
- `priority` - Filter by priority
- `status` - Filter by status
- `sort_by` - Sort field (due_date, priority, created_at)
- `page` - Page number
- `limit` - Items per page

## Development

### Code Quality
- **Linting**: Biome for fast linting and formatting
- **Type Safety**: Full TypeScript with strict mode
- **Component Library**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS 4 with custom utilities

### State Management
- **Auth Store**: User state, token, login/logout
- **Tasks Store**: Tasks list, pagination, filters, CRUD operations
- **Persistence**: Auth token stored in localStorage

### Best Practices
- Server/client component separation
- Optimistic UI updates
- Error handling with toast notifications
- Loading states for better UX
- Responsive design patterns

## Scripts

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Lint + build for production
pnpm start            # Start production server
pnpm lint             # Run Biome linter
pnpm lint:fix         # Auto-fix linting issues
pnpm lint:fix-unsafe  # Fix with unsafe transformations
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

