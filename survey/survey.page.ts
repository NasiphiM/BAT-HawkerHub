import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ShiftService} from "../shared/services/shift.service";
import {QuestionnaireService} from "../shared/services/questionnaire.service";
import {QuestionnaireType} from "../shared/Enums/questionnaire-type";
import { switchMap} from "rxjs/operators";
import {QuestionnaireModel} from "../shared/models/questionnaire-model";
import {AlertController, LoadingController} from "@ionic/angular";
import {QuestionnaireSectionAnswerModel} from "../shared/models/questionnaire-section-answered-model";
import {Constants} from "../shared/constants";
import {Router} from "@angular/router";
import {QuestionnaireSectionModel} from "../shared/models/questionnaire-section-model";
import {combineLatest} from "rxjs";
import {SectionComponent} from "./section/section.component";
import {NgForm, NgModel} from "@angular/forms";
import {QuestionnaireSavingModel} from "../shared/models/questionnaire-saving-model";
import {QuestionTypes} from "../shared/Enums/question-types";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
})
export class SurveyPage implements OnInit {
  questionnaire: QuestionnaireModel;
  _sectionAnswers: QuestionnaireSectionAnswerModel[] = [];
  @ViewChild('sectionComponent', {static: false}) sectionComponent: SectionComponent
  submitted = false;
  valid = false;
  validCheck: boolean[];
  shiftId: number;
  currentSectionIndex: number;
  currentSection: QuestionnaireSectionModel;
  nonListCtrls: NgModel[] = [];
  listCtrls: NgModel[] = [];
  listCtrlPercents: NgModel[] = [];

  constructor(
    private shiftService: ShiftService,
    private qService: QuestionnaireService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private datepipe: DatePipe) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.submitted = false;
    this.valid = false;
    this.validCheck = [];
    this._sectionAnswers = [];
    this.questionnaire = null;
    this.validCheck = [];
    this.currentSectionIndex = 0;
    this.currentSection = null;

    combineLatest([this.shiftService
      .getCurrentShift()])
      .pipe(
        switchMap(sub => {
            this.shiftId = sub[0].eventID;
            return this.qService.getQuestionnaire(sub[0].campaignID, QuestionnaireType.surveys);
          }
        )
      )
      .subscribe(q => {
        this.questionnaire = q;
        this.validCheck = [];
        this.currentSectionIndex = 0;
        this.currentSection = this.questionnaire.sections[this.currentSectionIndex];
      });
  }

  onSave(form: NgForm) {
    if (!this.valid) {
      const allControls = this.listCtrls.concat(this.listCtrlPercents, this.nonListCtrls);
      Constants.showInvalidControls(this.alertCtrl, allControls);
      return;
    } else {
      this.submitted = true;
      this.loadingCtrl
        .create({keyboardClose: true, message: 'Saving...'})
        .then(async (el) => {
          el.present();
          const model: QuestionnaireSavingModel = {
            questionnaireID: this.questionnaire.questionnaireID,
            questionnaireType: this.questionnaire.questionnaireType,
            questionnaireSections: [],

          };
          this.questionnaire.sections.forEach((section) => {
            const sectionModel: QuestionnaireSectionAnswerModel = {
              questionnaireSectionID: section.questionnaireSectionID,
              answers: [],
            };

            section.questions.forEach((question) => {

              switch (question.questionTypeID) {

                case QuestionTypes.dropdown:
                case QuestionTypes.radioButton: {
                  if (question.singleSelectedAnswer) {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID:
                      question.singleSelectedAnswer
                        .questionnaireQuestionAnswerOptionID,
                      answer: 'answer',
                    });
                  }
                  break;
                }
                case QuestionTypes.checkBox: {
                  if (question.inputAnswer) {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID: null,
                      answer: question.inputAnswer.toString(),
                    });
                  } else {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID: null,
                      answer: 'false',
                    });
                  }
                  break;
                }
                case QuestionTypes.textList:
                case QuestionTypes.numberList:
                case QuestionTypes.percentList: {
                  question.answers.forEach((a) => {
                    if (a.inputAnswer) {
                      sectionModel.answers.push({
                        questionnaireQuestionID: question.questionnaireQuestionID,
                        questionnaireQuestionAnswerOptionID:
                        a.questionnaireQuestionAnswerOptionID,
                        answer: a.inputAnswer.toString(),
                      });
                    }
                  });
                  break;
                }
                case QuestionTypes.checkBoxList: {
                  question.answers.forEach((a) => {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID:
                      a.questionnaireQuestionAnswerOptionID,
                      answer:
                        question.multipleSelectedAnswers &&
                        question.multipleSelectedAnswers?.indexOf(a) !== -1
                          ? true.toString()
                          : false.toString(),
                    });
                  });
                  break;
                }
                case QuestionTypes.date: {
                  if (question.inputAnswer) {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID: null,
                      //TODO Create a helper service to always convert date to this format
                      answer: this.datepipe.transform(
                        question.inputAnswer,
                        'yyyy-MM-dd'
                      ),
                    });
                  }
                  break;
                }
                case QuestionTypes.time: {
                  if (question.inputAnswer) {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID: null,
                      //TODO Create a helper service to always convert time to this format
                      answer: this.datepipe.transform(question.inputAnswer, 'HH:mm'),
                    });
                  }
                  break;
                }
                default: {
                  if (question.question.startsWith('!')) {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID: -1,
                      answer: null
                    });
                  } else if (question.inputAnswer) {
                    sectionModel.answers.push({
                      questionnaireQuestionID: question.questionnaireQuestionID,
                      questionnaireQuestionAnswerOptionID: null,
                      answer: question.inputAnswer.toString(),
                    });
                  }
                  break;
                }
              }
            });
            model.questionnaireSections.push(sectionModel);
          });

          this.qService.saveQuestionnaire(this.shiftId, model).subscribe({
            next: () => {
              el.dismiss();
              this.router.navigate(['/shift']);
            },
            error: () =>{
              alert('an error occured while saving your answers');
            }
          });

        });
    }

  }

  onIsValidChange(i: number, valid: boolean) {
    this.validCheck[i] = valid;
    this.valid = this.validCheck.findIndex(v => v !== true) < 0;
  }

  onSectionAnswered(i: number, answer: QuestionnaireSectionAnswerModel) {
    this._sectionAnswers[i] = answer;
  }
  nextSection() {
    if (this.validCheck[this.currentSectionIndex]) {
      this.currentSectionIndex++;
      this.currentSection = this.questionnaire.sections[this.currentSectionIndex];
    }else {
      alert('This section is not complete');
    }
  }

  previousSection() {
      this.currentSectionIndex--;
      this.currentSection = this.questionnaire.sections[this.currentSectionIndex];
      this.sectionComponent.updateSection(this.currentSection);
  }
}
