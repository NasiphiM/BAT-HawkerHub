import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SurveyPageRoutingModule } from './survey-routing.module';

import { SurveyPage } from './survey.page';
import {LoginPageModule} from "../login/login.module";
import {SectionComponent} from "./section/section.component";
import {QuestionComponent} from "./question/question.component";
import {DirectivesModule} from "../shared/directives/directives.module";
import {ComponentsModule} from "../shared/components/components.module";
import {SalesTemplatePageModule} from "./sales-template/sales-template.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SurveyPageRoutingModule,
    LoginPageModule,
    DirectivesModule,
    ComponentsModule,
    SalesTemplatePageModule,
  ],
  exports: [
    QuestionComponent
  ],
  declarations: [SurveyPage, SectionComponent, QuestionComponent]
})
export class SurveyPageModule {}
