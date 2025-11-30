# TaskFlow Backend API

A TypeScript-based REST API for the TaskFlow to-do application, built with Express.js, TypeORM, and PostgreSQL.

## 🚀 Features

- **Authentication**: JWT-based authentication with secure HTTP-only cookies
- **Task Management**: Full CRUD operations for tasks with priority levels and deadlines
- **Database**: PostgreSQL with TypeORM for type-safe database operations
- **Security**: Password hashing with bcrypt, CORS protection, and secure cookie handling
- **Docker Support**: Containerized application with Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- PostgreSQL (if running without Docker)

## 🛠️ Technology Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Development**: nodemon, ts-node

## 🐳 Docker Setup (Recommended)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Environment Variables

Create a `.env` file in the backend directory (optional, docker-compose has defaults):

```env
DB_TYPE=postgres
DB_HOST=db
DB_PORT=5432
DB_USER=rishav
DB_PASSWORD=rishav
DB_NAME=todo_app
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

### 3. Build and Run with Docker Compose

```bash
# Start all services (PostgreSQL + Backend)
docker compose up

# Or run in detached mode
docker compose up -d

# Build and start (if Dockerfile changed)
docker compose up --build

# Watch mode (auto-reload on file changes)
docker compose up --watch
```

### 4. Stop Services

```bash
# Stop containers
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v
```

### 5. Access the Application

- **API**: http://localhost:8000
- **Database**: localhost:5432
- **pgAdmin** (if configured): http://localhost:8888

## 💻 Local Development Setup (Without Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL

Make sure PostgreSQL is running and create a database:

```sql
CREATE DATABASE todo_app;
```

### 3. Configure Environment Variables

Create a `.env` file:

```env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=todo_app
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
PORT=8000
```

### 4. Run the Application

```bash
# Development mode (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.ts                 # Application entry point
│   └── src/
│       ├── db/
│       │   ├── dataSource.ts           # DataSource configuration
│       │   ├── dataSourceLocal.ts      # Local development config
│       │   └── dataSourceProd.ts       # Production config
│       ├── entity/
│       │   └── users.entity.ts         # User entity
│       └── modules/
│           ├── auth/
│           │   ├── auth.controller.ts  # Auth routes
│           │   └── auth.service.ts     # Auth business logic
│           └── tasks/
│               ├── tasks.controller.ts # Task routes
│               └── tasks.service.ts    # Task business logic
├── dist/                       # Compiled JavaScript (generated)
├── docker-compose.yaml         # Docker Compose configuration
├── Dockerfile                  # Docker image definition
├── package.json
├── tsconfig.json               # TypeScript configuration
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /auth/` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/auth-verify` - Verify authentication
- `POST /auth/logout` - Logout user

### Tasks

- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Docker commands
docker compose up              # Start services
docker compose down            # Stop services
docker compose logs            # View logs
docker compose ps              # List containers
docker compose exec app sh     # Access app container shell
```

## 🗄️ Database Management

### Access PostgreSQL Container

```bash
docker compose exec db psql -U rishav -d todo_app
```

### View Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs app
docker compose logs db

# Follow logs
docker compose logs -f
```

## 🔐 Security Features

- JWT tokens stored in HTTP-only cookies
- Password hashing with bcrypt
- CORS protection with credentials support
- Secure cookie settings (sameSite, secure flags)
- Input validation on all endpoints

## 🧪 Testing

```bash
# Add test commands when implemented
npm test
```

## 🚀 Deployment

### Production Build

```bash
# Build Docker image
docker build -t taskflow-backend:latest .

# Run production container
docker run -p 8000:8000 \
  -e DB_HOST=your_db_host \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_secret \
  taskflow-backend:latest
```

### Environment Variables for Production

- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production database credentials
- Enable HTTPS and set appropriate CORS origins

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if database is running
docker compose ps

# Restart database
docker compose restart db

# Check database logs
docker compose logs db
```

### Port Already in Use

```bash
# Change port in docker-compose.yaml or .env
PORT=8001

# Or kill process using port 8000
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Cookie Not Working

- Ensure frontend and backend are on same domain or configure CORS properly
- Check `sameSite` and `secure` cookie settings
- Verify `credentials: 'include'` is set in frontend requests

## 👥 Contributors

Rishav Raj

## 📞 Support

For issues and questions, please open an issue in the repository.
