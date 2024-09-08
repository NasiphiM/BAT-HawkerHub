import { QuestionnaireQuestionModel } from './questionnaire-question-model';

export interface QuestionnaireSectionModel {
  questionnaireSectionID: number;
  questionnaireSection: string;
  completed: boolean;
  questions: QuestionnaireQuestionModel[];
}
