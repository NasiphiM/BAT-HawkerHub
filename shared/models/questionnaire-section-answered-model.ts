import { QuestionnaireQuestionAnswerModel } from './questionnaire-question-answer-model';

export interface QuestionnaireSectionAnswerModel {
  // eventId: number;
  // source: string;
  // questionnaireID: number;
  questionnaireSectionID: number;
  // longitude?: number;
  // latitude?: number;
  // answerDateTime?: Date;
  answers: QuestionnaireQuestionAnswerModel[];
}


/*
*
* export interface QuestionnaireQuestionAnswerModel {
  questionnaireQuestionID: number;
  questionnaireQuestionAnswerOptionID: number | null;
  answer: string;
}

*
*
*
* */
