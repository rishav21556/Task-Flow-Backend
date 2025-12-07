import express from 'express';
import AppDataSource from './src/db/dataSource';
import AuthController from './src/modules/auth/auth.controller';
import TaskController from './src/modules/tasks/tasks.controller';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 8000;

// CORS middleware - must be before routes
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/auth', AuthController);
app.use('/tasks', TaskController);

// Start server first, then connect to database
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialize database connection after server starts
  AppDataSource.initialize()
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((error) => {
      console.error('Error connecting to database:', error);
      // Don't exit - let the server keep running for health checks
    });
});