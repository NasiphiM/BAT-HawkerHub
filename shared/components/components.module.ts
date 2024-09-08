import { DirectivesModule } from 'src/app/shared/directives/directives.module';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    DirectivesModule
  ],
  declarations: [
    ShowHidePasswordComponent,
  ],
  exports: [
    ShowHidePasswordComponent,
  ],
})
export class ComponentsModule {}
