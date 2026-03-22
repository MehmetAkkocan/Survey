import React from 'react';
import styled from 'styled-components';
import SurveyForm from '../components/SurveyForm';

const SurveyPageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #ebedee 100%);
`;

const Header = styled.header`
  padding: 2rem;
  text-align: center;
`;

const Logo = styled.h1`
  font-weight: 700;
  color: var(--color-secondary);
  font-size: 2rem;
`;

const SurveyPage: React.FC = () => {
  return (
    <SurveyPageContainer>
      <Header>
        <Logo>Survey App</Logo>
      </Header>
      <SurveyForm />
    </SurveyPageContainer>
  );
};

export default SurveyPage;