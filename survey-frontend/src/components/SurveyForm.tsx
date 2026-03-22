import React from "react";
import styled from "styled-components";
import Intro from "./Intro";
import Question from "./Question";
import ThankYou from "./ThankYou";
import { useSurvey } from "../context/SurveyContext";

const SurveyContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const SurveyForm: React.FC = () => {
  const { currentQuestion, isCompleted, setIsCompleted } = useSurvey();

  const handleComplete = () => {
    setIsCompleted(true);
  };

  const renderContent = () => {
    if (isCompleted) {
      return <ThankYou />;
    } else if (currentQuestion === 0) {
      return <Intro />;
    } else {
      return <Question onComplete={handleComplete} />;
    }
  };

  return <SurveyContainer>{renderContent()}</SurveyContainer>;
};

export default SurveyForm;
