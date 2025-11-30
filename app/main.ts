import express from 'express';
import AppDataSource from './src/db/dataSource';
import AuthController from './src/modules/auth/auth.controller';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use('/auth', AuthController);

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