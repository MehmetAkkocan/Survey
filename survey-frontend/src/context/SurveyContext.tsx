import React, { createContext, useContext, useState, ReactNode } from "react";
import { Survey, Question } from "../types";
import { surveyQuestions } from "../datas/Questions";

interface SurveyContextType {
  survey: Survey | null;
  setSurvey: React.Dispatch<React.SetStateAction<Survey | null>>;
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  question: Question | null;
  questions: Question[];
  isCompleted: boolean;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  return (
    <SurveyContext.Provider
      value={{
        survey,
        setSurvey,
        currentQuestion,
        setCurrentQuestion,
        answers,
        setAnswers,
        question: surveyQuestions[currentQuestion - 1],
        questions: surveyQuestions,
        isCompleted,
        setIsCompleted,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error("useSurvey must be used within a SurveyProvider");
  }
  return context;
};
