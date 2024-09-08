import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SurveyPage } from './survey.page';

const routes: Routes = [
  {
    path: '',
    component: SurveyPage
  },
  {
    path: 'sales-template',
    loadChildren: () => import('./sales-template/sales-template.module').then( m => m.SalesTemplatePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveyPageRoutingModule {}
