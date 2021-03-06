import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'; 

@Pipe({
  name: 'unique',
  pure: false
})

export class UniquePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let uniqueArray = value.filter(function (el, index, array) { 
      return array.indexOf (el) == index;
    });

    return uniqueArray;
  }
}