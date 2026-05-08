# Team Task Manager

A full-stack Team Task Manager application with User Authentication, Role-Based Access Control (RBAC), and a Task Analytics Dashboard.

## Tech Stack

- **Frontend**: React 19 (Vite), Tailwind CSS, Redux Toolkit, Recharts, Framer Motion, @dnd-kit
- **Backend**: Spring Boot 3.2.5, Spring Security (JWT), Spring Data MongoDB
- **Database**: MongoDB
- **Deployment**: Netlify

## Features

- **JWT Authentication**: Secure login and registration with role selection (Admin/Member)
- **Role-Based Access Control**:
  - **Admins**: Create projects, add/remove members, create/edit/delete tasks
  - **Members**: View assigned projects, update status of assigned tasks only
- **Analytics Dashboard**: Live task counts by status, overdue tasks, per-user distribution charts
- **Kanban Board**: Drag-and-drop task management with real-time status updates
- **Project Management**: Create projects, manage team members, view project boards

## Running Locally

### Prerequisites

- Java 17+
- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Backend

```bash
cd backend
# On Windows:
mvnw.cmd spring-boot:run
# On Mac/Linux:
./mvnw spring-boot:run
```

The backend runs on `http://localhost:8080`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to the backend.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_URI` | `mongodb://localhost:27017/taskmanager` | MongoDB connection string |
| `JWT_SECRET` | (built-in default) | Secret key for JWT signing |
| `JWT_EXPIRATION` | `86400000` (24h) | JWT token expiration in ms |
| `VITE_API_URL` | `http://localhost:8080/api` | Backend API URL for frontend |

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Projects
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/projects` | List user's projects |
| POST | `/api/projects` | Create project (Admin) |
| GET | `/api/projects/:id` | Get project by ID |
| DELETE | `/api/projects/:id` | Delete project (Admin) |
| POST | `/api/projects/:id/members` | Add member (Admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (Admin) |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tasks/project/:projectId` | List tasks by project |
| GET | `/api/tasks/my` | Get current user's tasks |
| POST | `/api/tasks` | Create task (Admin) |
| PUT | `/api/tasks/:id` | Update task (RBAC) |
| DELETE | `/api/tasks/:id` | Delete task (Admin) |

### Analytics
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/analytics` | Get aggregated analytics |

### Users
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users/me` | Get current user profile |

## Database Schema

### Users
`id`, `name`, `email` (unique), `password` (BCrypt hashed), `role` (ADMIN/MEMBER), `createdAt`

### Projects
`id`, `name`, `description`, `adminId` (ref → User), `memberIds` (list of User IDs), `createdAt`

### Tasks
`id`, `projectId` (ref → Project), `assignedTo` (ref → User), `title`, `description`, `dueDate`, `priority` (LOW/MEDIUM/HIGH), `status` (TODO/IN_PROGRESS/DONE), `createdAt`
