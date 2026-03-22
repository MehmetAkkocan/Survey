import express, { Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import surveyRoutes from './routes/surveyRoutes';
import adminRoutes from './routes/adminRoutes';
import authRoutes from './routes/authRoutes';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

// CORS with credentials
const origins = (process.env.FRONTEND_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: origins,
  credentials: true
}));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Auth routes
app.use('/api/auth', authRoutes);

// Admin-protected routes
app.use('/api/admin', adminRoutes);

// Public survey routes
app.use('/api/surveys', surveyRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`);
  process.exit(1);
});