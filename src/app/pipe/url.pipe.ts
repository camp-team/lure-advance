import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'url',
})
export class UrlPipe implements PipeTransform {
  transform(value: string): string {
    const urlReg = /https?:\/\/(www.?)?/;
    return value.replace(urlReg, '');
  }
}
