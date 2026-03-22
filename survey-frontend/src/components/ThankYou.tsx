import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useSurvey } from '../context/SurveyContext';
import AnimatedPage from './AnimatedPage';
import { submitSurvey } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ThankYouContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 60vh;
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 1.5rem;
`;

const Message = styled(motion.p)`
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: var(--color-primary);
`;

const Button = styled(motion.button)`
  background-color: var(--color-secondary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 2rem;

  &:hover {
    background-color: #6a4fd0;
  }
`;

const ThankYou: React.FC = () => {
  const { survey, answers, setSurvey } = useSurvey();
  const navigate = useNavigate();

  useEffect(() => {
    const submitResults = async () => {
      if (survey?._id && !survey.completed) {
        try {
          const completedSurvey = await submitSurvey(survey._id, answers);
          setSurvey(completedSurvey);
        } catch (error) {
          console.error('Error submitting survey results:', error);
        }
      }
    };

    submitResults();
  }, []);

  const handleViewResults = () => {
    if (survey?._id) {
      navigate(`/results/${survey._id}`);
    }
  };

  return (
    <AnimatedPage>
      <ThankYouContainer>
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Thank You!
        </Title>
        
        <Message
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          We appreciate you taking the time to complete our survey. Your feedback is valuable to us and will help us improve our services.
        </Message>
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <svg width="120" height="120" viewBox="0 0 24 24">
            <motion.path
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
            <motion.path
              fill="none"
              stroke="var(--color-secondary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 4L12 14.01l-3-3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            />
          </svg>
        </motion.div>
        
        <Button
          onClick={handleViewResults}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.7 }}
        >
          View Results
        </Button>
      </ThankYouContainer>
    </AnimatedPage>
  );
};

export default ThankYou;