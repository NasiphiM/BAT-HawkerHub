import { Directive, Input } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of } from 'rxjs';

@Directive({
  selector: '[appNotEmptyValidator]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: NotEmptyValidatorDirective,
      multi: true,
    },
  ],
})
export class NotEmptyValidatorDirective implements AsyncValidator {
  @Input() appNotEmptyValidator: boolean;

  constructor() {}

  validate(
    control: AbstractControl
  ):
    | Observable<ValidationErrors | null>
    | Promise<ValidationErrors | null>
    | null {
    if (
      this.appNotEmptyValidator &&
      (control.value === null ||
        control.value === undefined ||
        control.value.toString().trim().length === 0)
    ) {
      return of({ isEmpty: true });
    }
    return of(null);
  }
}
