import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './utils/database';
import authRouter from './routes/auth.routes';
import clientRouter from './routes/client.routes';
import projectRouter from './routes/project.routes';
import reminderRouter from './routes/reminder.routes';
import dashboardRouter from './routes/dashboard.routes';
import { errorHandler } from './middlewares/error.middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/clients', clientRouter);
app.use('/api/projects', projectRouter);
app.use('/api/reminders', reminderRouter);
app.use('/api/dashboard', dashboardRouter);

// Error handling
app.use(errorHandler);

// Initialize database connection and start server
db.connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });