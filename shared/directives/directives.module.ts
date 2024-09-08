import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HundredPercentDirective } from './hundred-percent.directive';
import { NotEmptyValidatorDirective } from './not-empty.directive';

@NgModule({
  declarations: [
    HundredPercentDirective,
    NotEmptyValidatorDirective,
  ],
  imports: [CommonModule],
  exports: [
    HundredPercentDirective,
    NotEmptyValidatorDirective,
  ],
})
export class DirectivesModule {}
