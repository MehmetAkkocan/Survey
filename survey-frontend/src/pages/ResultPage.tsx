import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { getSurveyResults } from '../services/api';
import { Survey } from '../types';

const ResultContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled(Link)`
  background-color: var(--color-secondary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #6a4fd0;
  }
`;

const Title = styled.h1`
  font-weight: 700;
  color: var(--color-secondary);
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const UserInfo = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  h3 {
    color: var(--color-primary);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }
  p {
    font-weight: 600;
    font-size: 1.1rem;
  }
`;

const TimeData = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background-color: #e0e0e0;
  margin: 2rem 0;
`;

const QuestionItem = styled.div`
  margin-bottom: 2rem;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const QuestionTitle = styled.h3`
  font-weight: 600;
  color: var(--color-third);
`;

const TimeSpent = styled.span`
  font-size: 0.9rem;
  color: var(--color-primary);
`;

const Answer = styled.p`
  padding: 1rem;
  background-color: rgba(126, 94, 242, 0.05);
  border-radius: 8px;
  border-left: 3px solid var(--color-secondary);
  font-weight: 500;
`;

const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        if (id) {
          const data = await getSurveyResults(id);
          setSurvey(data);
        }
      } catch (err) {
        console.error('Error fetching survey results:', err);
        setError('Failed to load survey results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveyResults();
  }, [id]);
  
  if (loading) {
    return (
      <ResultContainer>
        <p>Loading survey results...</p>
      </ResultContainer>
    );
  }
  
  if (error || !survey) {
    return (
      <ResultContainer>
        <p>{error || 'Survey not found'}</p>
        <BackButton to="/">Back to Home</BackButton>
      </ResultContainer>
    );
  }
  
  const formatTime = (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };
  
  return (
    <ResultContainer>
      <Header>
        <Title>Survey Results</Title>
        <BackButton to="/">Back to Home</BackButton>
      </Header>
      
      <InfoCard>
        <UserInfo>
          <InfoItem>
            <h3>Name</h3>
            <p>{survey.name} {survey.surname}</p>
          </InfoItem>
          
          <InfoItem>
            <h3>Completed On</h3>
            <p>
              {survey.endTime ? new Date(survey.endTime).toLocaleDateString() : 'Not completed'}
            </p>
          </InfoItem>
        </UserInfo>
        
        <TimeData>
          <InfoItem>
            <h3>Total Time</h3>
            <p>{formatTime(survey.totalTime)}</p>
          </InfoItem>
        </TimeData>
      </InfoCard>
      
      <Divider />
      
      <h2>Answers & Time Spent</h2>
      
      {survey.questionTimings.map((timing, index) => {
        const questionId = timing.questionId;
        // Find corresponding question text - in a real app, you'd store question text in DB
        const questionText = `Question ${index + 1}`;
        
        return (
          <QuestionItem key={questionId}>
            <QuestionHeader>
              <QuestionTitle>{questionText}</QuestionTitle>
              <TimeSpent>Time spent: {formatTime(timing.duration)}</TimeSpent>
            </QuestionHeader>
            
            <Answer>
              {survey.answers[questionId] || 'No answer provided'}
            </Answer>
          </QuestionItem>
        );
      })}
    </ResultContainer>
  );
};

export default ResultPage;