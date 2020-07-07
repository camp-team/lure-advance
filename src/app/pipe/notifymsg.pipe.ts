import { Pipe, PipeTransform } from '@angular/core';
import { NotificationWithUserAndThing } from '@interfaces/notification';

@Pipe({
  name: 'notifymsg',
})
export class NotifymsgPipe implements PipeTransform {
  transform(value: NotificationWithUserAndThing): string {
    const type = value.type;
    const fromName: string = value.user.name;
    switch (type) {
      case 'like':
        return `${fromName} liked`;
      case 'follow':
        return `${fromName} followed`;
      case 'reply':
        const comment = this.sliceComment(value.commentBody);
        return `${fromName} replied:\n「${comment}」`;
      default:
        throw new Error('想定してないパラメーター:' + type);
    }
  }
  private sliceComment(comment: string): string {
    return comment?.length > 30 ? `${comment.slice(0, 30)}...` : comment;
  }
}
