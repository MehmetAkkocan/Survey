import { Request, Response } from "express";
import Survey from "../models/Survey";

// Start a new survey
export const startSurvey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, surname } = req.body;

    if (!name || !surname) {
      res
        .status(400)
        .json({ success: false, message: "Please provide name and surname" });
      return;
    }

    const survey = await Survey.create({
      name,
      surname,
      startTime: new Date(),
    });

    res.status(201).json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update question timing
export const updateQuestionTiming = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { surveyId } = req.params;
    const { questionId, startTime, endTime, duration } = req.body;

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      res.status(404).json({ success: false, message: "Survey not found" });
      return;
    }

    // Check if an entry with the same questionId already exists
    const existingIndex = survey.questionTimings.findIndex(
      (timing) => timing.questionId === questionId
    );

    if (existingIndex !== -1) {
      // Update the existing entry
      survey.questionTimings[questionId] = {
        questionId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: survey.questionTimings[questionId].duration + duration,
      };
    } else {
      // Add new entry if it doesn't exist
      survey.questionTimings.push({
        questionId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration,
      });
    }

    await survey.save();

    res.status(200).json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Submit survey answers
export const submitSurvey = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { surveyId } = req.params;
    const { answers } = req.body;

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      res.status(404).json({ success: false, message: "Survey not found" });
      return;
    }

    const endTime = new Date();
    const totalTime = endTime.getTime() - survey.startTime.getTime();

    survey.answers = answers;
    survey.endTime = endTime;
    survey.totalTime = totalTime;
    survey.completed = true;

    await survey.save();

    res.status(200).json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get survey results
export const getSurveyResults = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { surveyId } = req.params;

    const survey = await Survey.findById(surveyId);

    if (!survey) {
      res.status(404).json({ success: false, message: "Survey not found" });
      return;
    }

    res.status(200).json({
      success: true,
      data: survey,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Get all surveys
export const getAllSurveys = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const surveys = await Survey.find();

    res.status(200).json({
      success: true,
      count: surveys.length,
      data: surveys,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
