import { Question } from "../types";

export const surveyQuestions: Question[] = [
  {
    id: 0,
    text: "What is your age group?",
    type: "radio",
    options: ["18-24", "25-34", "35-44", "45-54", "55+"],
  },
  {
    id: 1,
    text: "How did you hear about us?",
    type: "radio",
    options: [
      "Social Media",
      "Friend/Family",
      "Search Engine",
      "Advertisement",
      "Other",
    ],
  },
  { id: 2, text: "What is your occupation?", type: "text" },
  {
    id: 3,
    text: "What are your main interests?",
    type: "checkbox",
    options: [
      "Technology",
      "Arts",
      "Sports",
      "Travel",
      "Reading",
      "Cooking",
      "Other",
    ],
  },
  {
    id: 4,
    text: "How satisfied are you with our service?",
    type: "radio",
    options: [
      "Very Satisfied",
      "Satisfied",
      "Neutral",
      "Dissatisfied",
      "Very Dissatisfied",
    ],
  },
  {
    id: 5,
    text: "What improvements would you suggest for our service?",
    type: "textarea",
  },
  {
    id: 6,
    text: "Would you recommend our service to others?",
    type: "radio",
    options: [
      "Definitely",
      "Probably",
      "Not Sure",
      "Probably Not",
      "Definitely Not",
    ],
  },
  {
    id: 7,
    text: "How often do you use our service?",
    type: "radio",
    options: ["Daily", "Weekly", "Monthly", "Rarely", "First Time"],
  },
  {
    id: 8,
    text: "What features do you find most valuable?",
    type: "textarea",
  },
  { id: 9, text: "Any additional comments or feedback?", type: "textarea" },
];
