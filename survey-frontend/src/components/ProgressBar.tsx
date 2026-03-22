import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useSurvey } from "../context/SurveyContext";

const ProgressContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 2rem 0;
  overflow: hidden;
`;

const ProgressIndicator = styled(motion.div)`
  height: 100%;
  background-color: var(--color-secondary);
  border-radius: 4px;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: var(--color-primary);
  margin-top: 0.5rem;
`;

const ProgressBar: React.FC = () => {
  const { currentQuestion, questions } = useSurvey();

  // Calculate progress percentage
  const progress = (currentQuestion / questions.length) * 100;

  return (
    <div>
      <ProgressContainer>
        <ProgressIndicator
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </ProgressContainer>

      <ProgressText>
        <span>
          Question {currentQuestion} of {questions.length}
        </span>
        <span>{Math.round(progress)}% Complete</span>
      </ProgressText>
    </div>
  );
};

export default ProgressBar;
