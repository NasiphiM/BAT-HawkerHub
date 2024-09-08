import { QuestionnaireType } from '../Enums/questionnaire-type';
import { QuestionnaireSectionModel } from './questionnaire-section-model';

export interface QuestionnaireModel {
  questionnaireID: number;
  questionnaire: string;
  questionnaireType: QuestionnaireType;
  sections: QuestionnaireSectionModel[];
}
