import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { Thing } from 'src/app/interfaces/thing';
import { switchMap } from 'rxjs/operators';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-thing-editor',
  templateUrl: './thing-editor.component.html',
  styleUrls: ['./thing-editor.component.scss'],
})
export class ThingEditorComponent implements OnInit {
  thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingService.getThingByID(thingId);
    })
  );

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(5000)]],
    tags: [],
  });

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private thingService: ThingService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.thing$.subscribe((thing) => {
      this.tags = thing.tags;
      this.form.patchValue({
        ...thing,
        tags: null,
      });
    });
  }

  cancel(thing: Thing) {
    this.router.navigateByUrl('/' + thing.id);
  }

  save(thing: Thing) {
    const formValue = this.form.value;
    const newValue: Thing = {
      ...thing,
      title: formValue.title,
      description: formValue.description,
      tags: this.tags,
    };
    this.thingService
      .updateThing(newValue)
      .then(() => this.snackBar.open('保存しました。'));
  }
}
