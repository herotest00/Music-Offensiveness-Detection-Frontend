import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  isValidFormat(regex: RegExp) {
    return (control: AbstractControl) => {
      const isValid = regex.test(control.value);
      return isValid || control.value == '' ? null : { invalidFormat: { valid: false } };
    };
  }

}
