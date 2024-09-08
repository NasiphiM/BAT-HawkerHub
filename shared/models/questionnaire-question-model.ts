import { QuestionnaireQuestionAnswerOptionModel } from './questionnaire-question-answer-option-model';

export interface QuestionnaireQuestionModel {
  questionnaireQuestionID: number;
  question: string;
  questionTypeID: number;
  mandatoryInd: boolean;
  sortOrder: number;
  answers: QuestionnaireQuestionAnswerOptionModel[];
  inputAnswer: string;
  singleSelectedAnswer: QuestionnaireQuestionAnswerOptionModel;
  multipleSelectedAnswers: QuestionnaireQuestionAnswerOptionModel[];
}
