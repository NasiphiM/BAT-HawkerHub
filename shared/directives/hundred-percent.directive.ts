import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
} from '@angular/forms';

@Directive({
  selector: '[appHundredPercent][ngModelGroup]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: HundredPercentDirective,
      multi: true,
    },
  ],
})
export class HundredPercentDirective implements Validator {
  constructor() {}

  validate(control: AbstractControl): ValidationErrors | null {
    const formGroup = control as UntypedFormGroup;

    let total = 0;
    for (const field in formGroup.controls) {
      if (Object.prototype.hasOwnProperty.call(formGroup.controls, field)) {
        const c = formGroup.get(field);
        total += isNaN(c.value) ? 0 : +c.value;
      }
    }

    //The duplicate for loop is kind of stupid, but can refactor at some point
    for (const field in formGroup.controls) {
      if (Object.prototype.hasOwnProperty.call(formGroup.controls, field)) {
        const c = formGroup.get(field);
        if (total !== 100) {
          if (!c.errors) {
            c.setErrors({ hundredPercent: 'Values need to add up to 100' });
          }
        } else {
          if (c.hasError('hundredPercent')) {
            c.setErrors(null);
          }
        }
      }
    }

    if (total !== 100) {
      return { hundredPercent: 'Values need to add up to 100' };
    }
    return null;
  }
}
