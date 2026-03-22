import express from 'express';
import {
  startSurvey,
  updateQuestionTiming,
  submitSurvey,
  getSurveyResults,
} from '../controllers/surveyController';

const router = express.Router();

// Public endpoints for survey participant
router.post('/', startSurvey);
router.put('/:surveyId/timing', updateQuestionTiming);
router.put('/:surveyId/submit', submitSurvey);
// Public: allow viewing a single survey by id (e.g., thank you/results page)
router.get('/:surveyId', getSurveyResults);

// IMPORTANT: The public list endpoint is intentionally removed to prevent exposure of all responses.
// Admin-only listing is available under /api/admin/surveys.

export default router;