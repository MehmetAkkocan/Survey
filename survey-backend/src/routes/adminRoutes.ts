import express from 'express';
import { requireAdmin } from '../middleware/auth';
import { getAllSurveys, getSurveyResults } from '../controllers/surveyController';

const router = express.Router();

// All admin routes require admin auth
router.use(requireAdmin);

// List all surveys (admin only)
router.get('/surveys', getAllSurveys);

// Get single survey by id (admin only)
router.get('/surveys/:surveyId', getSurveyResults);

export default router;