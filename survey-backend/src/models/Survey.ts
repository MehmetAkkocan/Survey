import mongoose, { Document, Schema } from 'mongoose';

export interface QuestionTiming {
  questionId: number;
  startTime: Date;
  endTime: Date;
  duration: number; // in milliseconds
}

export interface ISurvey extends Document {
  name: string;
  surname: string;
  totalTime: number; // total survey time in milliseconds
  startTime: Date;
  endTime: Date;
  questionTimings: QuestionTiming[];
  answers: {
    [key: string]: string;
  };
  completed: boolean;
  createdAt: Date;
}

const SurveySchema = new Schema<ISurvey>(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    surname: {
      type: String,
      required: [true, 'Please add a surname'],
    },
    totalTime: {
      type: Number,
      default: 0,
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    questionTimings: [
      {
        questionId: Number,
        startTime: Date,
        endTime: Date,
        duration: Number,
      },
    ],
    answers: {
      type: Map,
      of: String,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISurvey>('Survey', SurveySchema);