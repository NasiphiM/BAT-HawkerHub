import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalesTemplatePageRoutingModule } from './sales-template-routing.module';

import { SalesTemplatePage } from './sales-template.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SalesTemplatePageRoutingModule
    ],
    exports: [
        SalesTemplatePage
    ],
    declarations: [SalesTemplatePage]
})
export class SalesTemplatePageModule {}
