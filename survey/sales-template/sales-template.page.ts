import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {QuestionnaireSectionModel} from "../../shared/models/questionnaire-section-model";
import {NgModel} from "@angular/forms";
import {QuestionnaireSectionAnswerModel} from "../../shared/models/questionnaire-section-answered-model";
import {QuestionnaireQuestionAnswerModel} from "../../shared/models/questionnaire-question-answer-model";
import {QuestionnaireQuestionModel} from "../../shared/models/questionnaire-question-model";

@Component({
  selector: 'app-sales-template',
  templateUrl: './sales-template.page.html',
  styleUrls: ['./sales-template.page.scss'],
})
export class SalesTemplatePage implements OnInit, AfterViewInit {
  @Input() questionnaireId: number;
  @Input() shiftId: number;
  @Input() section: QuestionnaireSectionModel;
  @Input() touched: boolean;
  @Input() nonListCtrls: NgModel[];
  @Input() listCtrls: NgModel[];
  @Input() listCtrlPercents: NgModel[];
  @Output() isValid = new EventEmitter<boolean>();
  @Output() sectionAnswers = new EventEmitter<QuestionnaireSectionAnswerModel>();
  _sectionAnswers: QuestionnaireSectionAnswerModel;
  _questionAnswers: QuestionnaireQuestionAnswerModel[][] = [];
  validCheck: boolean[];
  index: number = 0;
  isValidValue: boolean;

  @Input() surveySaved: boolean;
  orderItems: QuestionnaireQuestionModel[] = [];
  selectedQuestion: QuestionnaireQuestionModel;
  isAdded: boolean = false;
  quantity: number;

  constructor() {
  }

  ngOnInit() {
    this.orderItems = this.section.questions.filter(x => x.inputAnswer != null);
    this.updateSection(this.section);
  }

  ngAfterViewInit() {
    //Always true because the if items not selected it will be zero
    this.isValid.emit(true);
  }

  updateSection(currentSection: QuestionnaireSectionModel) {
    this.validCheck = [];
    this._questionAnswers = [];
    this.section = currentSection;
    if (this.section == null) {
      return;
    }

    this.section.questions.forEach(q => {
      this._questionAnswers.push([]);
      this.validCheck.push(!q.mandatoryInd);
    });


  }

  onAddClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();

    if (this.orderItems.length > 0) {
      for (let x = 0; x < this.orderItems.length; x++) {
        if (this.orderItems[x] === this.selectedQuestion) {
          alert("This item has already been added. Cannot create duplicates");
          return;
        }
      }
    }
    this.selectedQuestion.inputAnswer = this.quantity.toString();
    this.orderItems.push(this.selectedQuestion);

    this.quantity = null;
    this.selectedQuestion = null;
  }

  removeItem(ind) {
    if (this.orderItems.length > 0) {
      this.orderItems = this.orderItems.filter(x => x.questionnaireQuestionID != this.orderItems[ind].questionnaireQuestionID);
    }
  }


}
