import { updateQuestionTiming } from "../services/api";
import { useSurvey } from "../context/SurveyContext";
import { useState } from "react";

export const useTimer = () => {
  const { survey } = useSurvey();
  const [currentTiming, setCurrentTiming] = useState<{
    questionId: number;
    startTime: Date;
  }>();
  const startTracking = (questionId: number) => {
    setCurrentTiming({
      questionId,
      startTime: new Date(),
    });
  };

  const stopTracking = async () => {
    if (survey?._id && currentTiming) {
      const endTime = new Date();
      const duration = endTime.getTime() - currentTiming.startTime.getTime();

      try {
        await updateQuestionTiming(survey._id, {
          questionId: currentTiming.questionId,
          startTime: currentTiming.startTime,
          endTime,
          duration,
        });
      } catch (error) {
        console.error("Error updating question timing:", error);
      }
    }
  };

  return {
    startTracking,
    stopTracking,
  };
};
