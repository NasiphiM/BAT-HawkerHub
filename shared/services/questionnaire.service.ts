import { Injectable } from '@angular/core';
import {QuestionnaireType} from "../Enums/questionnaire-type";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {mergeMap, tap} from "rxjs/operators";
import {QuestionnaireModel} from "../models/questionnaire-model";
import {HttpClient} from "@angular/common/http";
import {LoginService} from "./login.service";
import {QuestionnaireSavingModel} from "../models/questionnaire-saving-model";

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  private privateQuestionnaire = new BehaviorSubject<QuestionnaireModel>(null);
  private storedQuestionnaire: QuestionnaireSavingModel;
  private storedShiftId: number;
  constructor(private http:HttpClient,
              private loginService: LoginService) { }

  getQuestionnaire(
    campaignId: number,
    questionnaireType: QuestionnaireType
  ): Observable<QuestionnaireModel> {
    return this.http
      .get<QuestionnaireModel>(
        `${environment.apiUrl}/Questionnaire/${campaignId}/${questionnaireType}`
      )
      .pipe(
        tap((quest) => {
          this.privateQuestionnaire.next(quest);
        })
      );
  }

  saveQuestionnaire(eventId: number, model: QuestionnaireSavingModel) {
    return this.loginService.user.pipe(
      mergeMap((user) =>
        this.http.post(`${environment.apiUrl}/Questionnaire/${eventId}`, model)
      )
    );
  }

  storePartialQuestionnaire(shiftId: number, model: QuestionnaireSavingModel){
    this.storedQuestionnaire = model;
    this.storedShiftId = shiftId;
  }

  getPartialQuestionnaire(): QuestionnaireSavingModel{
    return this.storedQuestionnaire;
  }

  getShiftId(): number{
    return this.storedShiftId;
  }

}
