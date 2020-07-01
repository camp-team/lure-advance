import { Pipe, PipeTransform } from '@angular/core';
import { firestore } from 'firebase';
import * as moment from 'moment';

@Pipe({
  name: 'relativetime',
})
export class RelativetimePipe implements PipeTransform {
  transform(value: Date | firestore.Timestamp): string {
    return moment(value).fromNow();
  }
}
