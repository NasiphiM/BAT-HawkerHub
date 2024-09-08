import {
  AfterViewInit,
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList, ViewChild,
  ViewChildren
} from '@angular/core';
import {QuestionnaireQuestionModel} from "../../shared/models/questionnaire-question-model";
import {QuestionTypes} from "../../shared/Enums/question-types";
import {QuestionnaireQuestionAnswerModel} from "../../shared/models/questionnaire-question-answer-model";
import {DatePipe} from "@angular/common";
import {NgModel} from "@angular/forms";
import {LoadingController} from "@ionic/angular";
import jsQR from "jsqr-es6";

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @ViewChildren('listCtrl') viewListCtrls: QueryList<NgModel>;
  @ViewChildren('listCtrlPercent') viewListCtrlPercents: QueryList<NgModel>;
  @ViewChildren('nonListCtrl') viewNonListCtrls: QueryList<NgModel>;
  @ViewChild('video', {static: false}) video: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  videoElement: any;
  canvasElement: any;
  canvasContext: any;
  loading: HTMLIonLoadingElement;
  @Input() question: QuestionnaireQuestionModel;
  @Input() touched: boolean;
  @Output() isValid = new EventEmitter<boolean>();
  @Output() answers = new EventEmitter<QuestionnaireQuestionAnswerModel[]>();
  @Input() nonListCtrls: NgModel[];
  @Input() listCtrls: NgModel[];
  @Input() listCtrlPercents: NgModel[];
  _answers: QuestionnaireQuestionAnswerModel[] = [];
  questionTypes = QuestionTypes;
  isList: boolean;
  scanResult = null;
  scanActive: boolean = false;
  stream: MediaStream;
  videoDevices: MediaDeviceInfo[];
  currentDeviceIndex: number = 0;
  private scanningQuestion: QuestionnaireQuestionModel;

  constructor(private datePipe: DatePipe,
              private cd: ChangeDetectorRef,
              private loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    this.isList =
      this.question.questionTypeID === QuestionTypes.textList ||
      this.question.questionTypeID === QuestionTypes.numberList ||
      this.question.questionTypeID === QuestionTypes.percentList;


    if (this.isList) {
      this._answers = new Array(this.question.answers.length);
    }
    if (this.question.mandatoryInd) {
      this.isValid.emit(false);
    } else {
      this.isValid.emit(true);
    }

    switch (this.question.questionTypeID) {
      case QuestionTypes.dropdown:
      case QuestionTypes.radioButton:
      case QuestionTypes.checkBox:
        this.question.answers.forEach((a) => {
          this._answers.push({
            questionnaireQuestionID: this.question.questionnaireQuestionID,
            questionnaireQuestionAnswerOptionID: null,
            answer: null,
          });
        })
        break;

      case this.questionTypes.textList:
      case this.questionTypes.numberList:
      case this.questionTypes.percentList:
        this.question.answers.forEach((a) => {
          this._answers.push({
            questionnaireQuestionID: this.question.questionnaireQuestionID,
            questionnaireQuestionAnswerOptionID: a.questionnaireQuestionAnswerOptionID,
            answer: null,
          });
        });
        break;

      case this.questionTypes.checkBoxList:
        this._answers = [];
        this.question.answers.forEach((a) => {
          this._answers.push({
            questionnaireQuestionID: this.question.questionnaireQuestionID,
            questionnaireQuestionAnswerOptionID: a.questionnaireQuestionAnswerOptionID,
            answer: null
          });
        });
        break;

      case this.questionTypes.date:
        this._answers.push({
          questionnaireQuestionID: this.question.questionnaireQuestionID,
          questionnaireQuestionAnswerOptionID: null,
          answer: null
        });
        break;
      case this.questionTypes.time:
        this._answers.push({
          questionnaireQuestionID: this.question.questionnaireQuestionID,
          questionnaireQuestionAnswerOptionID: null,
          answer: null
        });
        break;
      default:
        this._answers.push({
          questionnaireQuestionID: this.question.questionnaireQuestionID,
          questionnaireQuestionAnswerOptionID: null,
          answer: null
        });
        break;

    }
    this.cd.detectChanges();
    this.viewListCtrls?.forEach((x) => {
      this.listCtrls.push(x);
    });
    this.viewNonListCtrls?.forEach((x) => {
      this.nonListCtrls.push(x);
    });
    this.viewListCtrlPercents?.forEach((x) => {
      this.listCtrlPercents.push(x);
    });
  }

  ngAfterViewInit() {
    this.videoElement = this.video?.nativeElement;
    this.canvasElement = this.canvas?.nativeElement;
    this.canvasContext = this.canvasElement?.getContext('2d');
  }

  findNgModel(name: string) {
    let model = this.nonListCtrls?.find((x) => x.name === name);
    if (!model) {
      model = this.listCtrls?.find((x) => x.name === name);
      if (!model) {
        model = this.listCtrlPercents?.find((x) => x.name === name);
      }
    }
    return model;
  }

  setAnswer() {
    switch (this.question.questionTypeID) {
      case QuestionTypes.dropdown:
      case QuestionTypes.radioButton:
      case QuestionTypes.checkBox:
        this._answers[0].answer = this._answers[0].questionnaireQuestionAnswerOptionID ? 'answer' : 'null';
        break;

      case this.questionTypes.textList:
      case this.questionTypes.numberList:
      case this.questionTypes.percentList:
        // nothing to set - the values are handled in the component
        break;

      case this.questionTypes.checkBoxList:
        // possibly loop through the answers and set them all to true/false as needed?
        break;
      case this.questionTypes.date:
        this._answers[0].answer = this.datePipe.transform(this._answers[0].answer, 'yyyy-MM-dd');
        break;
      case this.questionTypes.time:
        this._answers[0].answer = this.datePipe.transform(this._answers[0].answer, 'HH:mm');
        break;
      default:
        this._answers[0].answer = this._answers[0].answer?.toString();
        break;

    }
  }


  checkValidity(e) {
    let valid = true;

    if (this.question.mandatoryInd) {
      switch (this.question.questionTypeID) {
        case QuestionTypes.numberList:
        case QuestionTypes.textList:
        case QuestionTypes.percentList:
          this.question?.answers.forEach(a => {
            if (a.inputAnswer == null || typeof (a.inputAnswer) == "undefined" || a.inputAnswer.toString().trim() === '') {
              valid = false;
            }
          });
          break;

        case QuestionTypes.dropdown:
        case QuestionTypes.radioButton:
          if (typeof (this.question.singleSelectedAnswer.questionnaireQuestionAnswerOptionID) == "undefined" || this.question.singleSelectedAnswer.questionnaireQuestionAnswerOptionID.toString().trim() === '') {
            valid = false;
          }
          break;
        case QuestionTypes.checkBoxList:
          this.question?.multipleSelectedAnswers.forEach((a) => {
            if (a.questionnaireQuestionAnswerOptionID == null || typeof (a.questionnaireQuestionAnswerOptionID) == "undefined" || a.questionnaireQuestionAnswerOptionID.toString().trim() === '') {
              valid = false;
            }
          });
          break;

        default:
          if (this.question.inputAnswer == null || typeof (this.question.inputAnswer) == "undefined" || this.question.inputAnswer.toString().trim() === '') {
            valid = false;
          }
          break;
      }
    }
    if (this.question.questionTypeID === QuestionTypes.percentList) {
      if (!this.question.answers) {
        valid = false;
      } else {
        let total: number = 0;
        this.question.answers.forEach(a => total += parseInt(a.inputAnswer));
        if (total != 100) {
          valid = false;
        }
      }
    }
    this.isValid.emit(valid);
  }

  async startScan(question: QuestionnaireQuestionModel) {
    this.scanningQuestion = question;
    this.videoElement = this.video?.nativeElement;
    this.canvasElement = this.canvas?.nativeElement;
    this.canvasContext = this.canvasElement?.getContext('2d', {willReadFrequently: true});
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        // Use the rear camera. To use the front facing camera , use facingMode: 'user'
        facingMode: 'environment',
      }
    });
    this.videoElement.srcObject = this.stream;
    this.videoElement.setAttribute('playsinline', true);
    this.videoElement.play();

    this.loading = await this.loadingCtrl.create({});
    this.scanActive = true;
    await this.loading.present();

    requestAnimationFrame(this.tryReadQRCode.bind(this));
  }

  async tryReadQRCode() {
    if (this.videoElement.readyState === this.videoElement.HAVE_ENOUGH_DATA) {
      if (this.loading) {
        this.canvasElement.height = this.videoElement.videoHeight;
        this.canvasElement.width = this.videoElement.videoWidth;
        await this.loading.dismiss();
        this.loading = null;
      }

      this.canvasContext.drawImage(
        this.videoElement,
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const imageData = this.canvasContext.getImageData(
        0,
        0,
        this.canvasElement.width,
        this.canvasElement.height
      );

      const code = imageData ? jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert"
      }) : null;

      if (code) {
        this.scanResult = code.data;
        this.scanningQuestion.inputAnswer = code.data;
        this.stopScan();
      }
    }

    if (this.scanActive) {
      requestAnimationFrame(this.tryReadQRCode.bind(this));
    }
  }

  reset() {
    this.scanResult = null;
  }

  stopScan() {
    this.scanActive = false;
    this.stream.getTracks().forEach(function (track) {
      track.stop();
    });
  }
}
