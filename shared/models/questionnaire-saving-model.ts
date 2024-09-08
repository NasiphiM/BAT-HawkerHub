import { QuestionnaireSectionAnswerModel } from './questionnaire-section-answered-model';
import {QuestionnaireType} from "../Enums/questionnaire-type";
export interface QuestionnaireSavingModel {
  questionnaireID: number;
  questionnaireType: QuestionnaireType;
  questionnaireSections: QuestionnaireSectionAnswerModel[];
/*  latitude: number | null;
  longitude: number | null;*/
}
