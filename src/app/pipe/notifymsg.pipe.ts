import { Pipe, PipeTransform } from '@angular/core';
import { Notification } from '../interfaces/notification';

@Pipe({
  name: 'notifymsg',
})
export class NotifymsgPipe implements PipeTransform {
  transform(value: Notification): string {
    const type = value.type;
    const comment = this.sliceComment(value.comment);
    const fromName = value.name;
    if (type === 'like') {
      return `${fromName}さんがあなたの投稿にいいねをしました。`;
    } else if (type === 'follow') {
      return `${fromName}さんからフォローされました。`;
    } else if (type === 'reply') {
      return `${fromName}さんからコメントをいただきました。:\n「${comment}」`;
    } else {
      throw new Error('想定していないパラメーター:' + type);
    }
  }
  private sliceComment(comment: string): string {
    return comment.length > 50 ? `${comment.slice(0, 50)}...` : comment;
  }
}
