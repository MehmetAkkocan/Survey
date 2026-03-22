import axios from "axios";
import { Survey, QuestionTiming } from "../types";
//@ts-ignore
const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Participant endpoints (public)
export const startSurvey = async (name: string, surname: string): Promise<Survey> => {
  const response = await api.post('/surveys', { name, surname });
  return response.data.data;
};

export const updateQuestionTiming = async (
  surveyId: string,
  timing: Omit<QuestionTiming, 'duration'> & { duration: number }
): Promise<Survey> => {
  const response = await api.put(`/surveys/${surveyId}/timing`, timing);
  return response.data.data;
};

export const submitSurvey = async (
  surveyId: string,
  answers: Record<string, string>
): Promise<Survey> => {
  const response = await api.put(`/surveys/${surveyId}/submit`, { answers });
  return response.data.data;
};

export const getSurveyResults = async (surveyId: string): Promise<Survey> => {
  const response = await api.get(`/surveys/${surveyId}`);
  return response.data.data;
};

// Admin auth
export const adminLogin = async (email: string, password: string) => {
  const res = await api.post('/auth/login', { email, password });
  return res.data.user as { email: string };
};

export const adminMe = async () => {
  const res = await api.get('/auth/me');
  return res.data.user as { email: string };
};

export const adminLogout = async () => {
  const res = await api.post('/auth/logout');
  return res.data.success as boolean;
};

// Admin-only data
export const adminGetAllSurveys = async (): Promise<Survey[]> => {
  const res = await api.get('/admin/surveys');
  return res.data.data;
};

export const adminGetSurveyById = async (id: string): Promise<Survey> => {
  const res = await api.get(`/admin/surveys/${id}`);
  return res.data.data;
};

export default api;