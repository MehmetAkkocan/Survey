import React, { useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useTimer } from "../hooks/useTimer";
import { useSurvey } from "../context/SurveyContext";
import AnimatedPage from "./AnimatedPage";
import ProgressBar from "./ProgressBar";

const QuestionContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const QuestionText = styled.h2`
  font-weight: 600;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  color: var(--color-third);
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--color-secondary);
  }

  input {
    margin-right: 1rem;
  }

  &.selected {
    border-color: var(--color-secondary);
    background-color: rgba(126, 94, 242, 0.05);
  }
`;

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--color-secondary);
  }

  input {
    margin-right: 1rem;
  }

  &.selected {
    border-color: var(--color-secondary);
    background-color: rgba(126, 94, 242, 0.05);
  }
`;

const TextInput = styled.input`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: border-color 0.3s;

  &:focus {
    border-color: var(--color-secondary);
    outline: none;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 3rem;
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

  &:hover {
    background-color: #6a4fd0;
  }

  &.back {
    background-color: transparent;
    color: var(--color-primary);
    border: 1px solid var(--color-primary);

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &:disabled {
    background-color: #b9b9b9;
    cursor: not-allowed;
  }
`;

interface QuestionComponentProps {
  onComplete: () => void;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  onComplete,
}) => {
  const {
    question,
    questions,
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswers,
  } = useSurvey();

  if (!question) return <div>Loading...</div>;
  const { startTracking, stopTracking } = useTimer();

  useEffect(() => {
    // Start timing when the question is displayed
    startTracking(question.id);
  }, [currentQuestion]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAnswers({
      ...answers,
      [question.id]: e.target.value,
    });
  };

  const handleCheckboxChange = (option: string) => {
    const currentAnswer = answers[question.id] || "";
    const optionsArray = currentAnswer ? currentAnswer.split(",") : [];

    if (optionsArray.includes(option)) {
      // Remove option
      const newOptions = optionsArray.filter((item) => item !== option);
      setAnswers({
        ...answers,
        [question.id]: newOptions.join(","),
      });
    } else {
      // Add option
      optionsArray.push(option);
      setAnswers({
        ...answers,
        [question.id]: optionsArray.join(","),
      });
    }
  };

  const handleRadioChange = (option: string) => {
    setAnswers({
      ...answers,
      [question.id]: option,
    });
  };

  const handleBack = () => {
    stopTracking();
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleNext = () => {
    stopTracking();

    if (currentQuestion < questions.length) {
      // Go to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Complete the survey
      onComplete();
    }
  };

  const isNextDisabled = !answers[question.id];

  const renderQuestionInput = () => {
    switch (question.type) {
      case "text":
        return (
          <TextInput
            type="text"
            value={answers[question.id] || ""}
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        );

      case "textarea":
        return (
          <TextArea
            value={answers[question.id] || ""}
            onChange={handleInputChange}
            placeholder="Type your answer here..."
          />
        );

      case "radio":
        return (
          <OptionsList>
            {question.options?.map((option, index) => (
              <RadioOption
                key={index}
                className={answers[question.id] === option ? "selected" : ""}
              >
                <input
                  type="radio"
                  name={question.id.toString()}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={() => handleRadioChange(option)}
                />
                {option}
              </RadioOption>
            ))}
          </OptionsList>
        );

      case "checkbox":
        const selectedOptions = answers[question.id]
          ? answers[question.id].split(",")
          : [];

        return (
          <OptionsList>
            {question.options?.map((option, index) => (
              <CheckboxOption
                key={index}
                className={selectedOptions.includes(option) ? "selected" : ""}
              >
                <input
                  type="checkbox"
                  name={question.id.toString()}
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleCheckboxChange(option)}
                />
                {option}
              </CheckboxOption>
            ))}
          </OptionsList>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatedPage>
      <QuestionContainer>
        <ProgressBar />

        <QuestionText>{question.text}</QuestionText>

        {renderQuestionInput()}

        <NavigationButtons>
          <Button
            className="back"
            onClick={handleBack}
            disabled={currentQuestion === 0}
            whileTap={{ scale: 0.98 }}
          >
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={isNextDisabled}
            whileTap={{ scale: 0.98 }}
          >
            {currentQuestion === questions.length ? "Submit" : "Next"}
          </Button>
        </NavigationButtons>
      </QuestionContainer>
    </AnimatedPage>
  );
};

export default QuestionComponent;
