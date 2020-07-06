import { Injectable } from '@angular/core';
import { CanDeactivate, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EditorComponent } from '../editor/editor/editor.component';

@Injectable({
  providedIn: 'root',
})
export class EditorGuard implements CanDeactivate<EditorComponent> {
  canDeactivate(
    component: EditorComponent
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component.form.pristine || component.isCompleted) {
      return true;
    }

    const confirmation = window.confirm(
      '作業中の内容が失われますがよろしいですか？'
    );

    return of(confirmation);
  }
}
