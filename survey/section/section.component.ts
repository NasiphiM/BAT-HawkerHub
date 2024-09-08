import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionnaireSectionModel} from "../../shared/models/questionnaire-section-model";
import {QuestionnaireSectionAnswerModel} from "../../shared/models/questionnaire-section-answered-model";
import {QuestionnaireQuestionAnswerModel} from "../../shared/models/questionnaire-question-answer-model";
import {NgModel} from "@angular/forms";

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit {
  @Input() questionnaireId: number;
  @Input() shiftId: number;
  @Input() section: QuestionnaireSectionModel;
  @Input() touched: boolean;
  @Input() nonListCtrls: NgModel[];
  @Input() listCtrls: NgModel[] ;
  @Input() listCtrlPercents: NgModel[];
  @Output() isValid = new EventEmitter<boolean>();
  @Output() sectionAnswers = new EventEmitter<QuestionnaireSectionAnswerModel>();
  _sectionAnswers: QuestionnaireSectionAnswerModel;
  _questionAnswers: QuestionnaireQuestionAnswerModel[][] = [];
  validCheck: boolean[];
@Input() surveySaved : boolean;

  constructor() {
  }

  ngOnInit() {
    this.updateSection(this.section);
  }

  onValidChange(i: number, valid: boolean) {
    this.validCheck[i] = valid;
    const isValid = this.validCheck.findIndex(v => v !== true) < 0;
    this.isValid.emit(isValid);
  }

  onAnswered(i: number, answers: QuestionnaireQuestionAnswerModel[]) {
    this._questionAnswers[i] = answers;
    this.setSectionAnswers();
    this.sectionAnswers.emit(this._sectionAnswers);
  }

  setSectionAnswers() {
    const answers: QuestionnaireQuestionAnswerModel[] = [];
    this._questionAnswers.forEach((qa) => {
        answers.push(...qa);
    });

    this._sectionAnswers.answers = answers;
  }

  updateSection(currentSection: QuestionnaireSectionModel) {
    this.validCheck = [];
    this._questionAnswers = [];
    this.section = currentSection;
    this.section.questions.forEach(q => {
      this._questionAnswers.push([]);
      this.validCheck.push(!q.mandatoryInd);
    });
  }
}
