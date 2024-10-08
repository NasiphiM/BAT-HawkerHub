import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalesTemplatePage } from './sales-template.page';

const routes: Routes = [
  {
    path: '',
    component: SalesTemplatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesTemplatePageRoutingModule {}
