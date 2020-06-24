import { Pipe, PipeTransform } from '@angular/core';
import { NotificationWithUserAndThing } from '@interfaces/notification';

@Pipe({
  name: 'notifymsg',
})
export class NotifymsgPipe implements PipeTransform {
  transform(value: NotificationWithUserAndThing): string {
    const type = value.type;
    const comment = this.sliceComment(value.comment);
    const fromName = value.user.name;
    switch (type) {
      case 'like':
        return `${fromName}さんがあなたの投稿にいいねをしました。`;
      case 'follow':
        return `${fromName}さんからフォローされました。`;
      case 'reply':
        return `${fromName}さんからコメントをいただきました。:\n「${comment}」`;
      default:
        throw new Error('想定してないパラメーター:' + type);
    }
  }
  private sliceComment(comment: string): string {
    return comment.length > 50 ? `${comment.slice(0, 50)}...` : comment;
  }
}
