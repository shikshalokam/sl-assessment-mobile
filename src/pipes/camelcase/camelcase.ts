import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CamelcasePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'camelcase',
})
export class CamelcasePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(camelCase: any): any {
    camelCase = camelCase.trim();
   
    if (camelCase == null || camelCase == "") {
      return camelCase;
    }

    var newText = "";
    for (var i = 0; i < camelCase.length; i++) {
      if (/[A-Z]/.test(camelCase[i])
          && i != 0
          && /[a-z]/.test(camelCase[i-1])) {
        newText += " ";
      }
      if (i == 0 && /[a-z]/.test(camelCase[i]))
      {
        newText += camelCase[i].toUpperCase();
      } else {
        newText += camelCase[i];
      }
    }

    return newText;
  }
}
