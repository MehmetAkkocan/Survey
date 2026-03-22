import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { startSurvey } from '../services/api';
import { useSurvey } from '../context/SurveyContext';
import AnimatedPage from './AnimatedPage';

const IntroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: var(--color-secondary);
`;

const Form = styled.form`
  width: 100%;
  max-width: 500px;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: left;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--color-secondary);
    outline: none;
  }
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
  transition: transform 0.2s, background-color 0.3s;

  &:hover {
    background-color: #6a4fd0;
  }

  &:disabled {
    background-color: #b9b9b9;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 1rem 0;
  text-align: left;
`;

const Intro: React.FC = () => {
  const { setSurvey, setCurrentQuestion } = useSurvey();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !surname.trim()) {
      setError('Please enter both name and surname');
      return;
    }

    setIsLoading(true);

    try {
      const surveyData = await startSurvey(name.trim(), surname.trim());
      setSurvey(surveyData);
      setCurrentQuestion(1); // Move to the first question
    } catch (err) {
      console.error('Error starting survey:', err);
      setError('Failed to start the survey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <IntroContainer>
        <Title>Welcome to Our Survey</Title>
        <p className="mb5">
          Please provide your name and surname to get started with our survey.
          The survey contains 10 questions and will take approximately 5 minutes to complete.
        </p>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your first name"
              autoComplete="given-name"
              disabled={isLoading}
            />
          </InputGroup>

          <InputGroup>
            <Label htmlFor="surname">Surname</Label>
            <Input
              id="surname"
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Enter your last name"
              autoComplete="family-name"
              disabled={isLoading}
            />
          </InputGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button
            type="submit"
            disabled={isLoading}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Starting...' : 'Start Survey'}
          </Button>
        </Form>
      </IntroContainer>
    </AnimatedPage>
  );
};

export default Intro;