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
  origin: 'http://localhost:3000', // your frontend URL
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

app.use('/auth', AuthController);
app.use('/tasks', TaskController);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });