import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThingService } from 'src/app/services/thing.service';
import { Observable } from 'rxjs';
import { Thing } from '@interfaces/thing';
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
import { ThingRef } from '@interfaces/thing-ref';
import { DetailComponentService } from 'src/app/services/ui/detail-component.service';

@Component({
  selector: 'app-thing-editor',
  templateUrl: './thing-editor.component.html',
  styleUrls: ['./thing-editor.component.scss'],
})
export class ThingEditorComponent implements OnInit {
  MAX_FILE_LENGTH = 5;
  thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingService.getThingByID(thingId);
    })
  );

  images: any[] = [];
  imageFiles: (File | string)[] = [];
  defaultImageLength: number;

  stls: (string | ArrayBuffer)[] = [];
  stlFiles: (File | ThingRef)[] = [];
  defaultStlLength: number;

  form: FormGroup = this.componentService.form;

  titleControl = this.componentService.titleControl;
  descriptionControl = this.componentService.descriptionControl;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  selectFiles(event) {
    const files: File[] = Object.values(event.target.files);
    if (files.length + this.images.length > this.MAX_FILE_LENGTH) {
      this.snackBar.open('最大ファイル数は5つです');
      return;
    }
    files.forEach((file) => this.readFile(file));
    console.log(this.stls);
  }

  add(event: MatChipInputEvent): void {
    this.componentService.addTag(event, this.tags);
  }

  private readFile(file: File) {
    const fr: FileReader = new FileReader();
    fr.onload = (e) => {
      if (this.isStl(file)) {
        this.stlFiles.push(file);
        this.stls.push(e.target.result);
      } else {
        this.images.push(e.target.result);
        this.imageFiles.push(file);
      }
    };
    fr.readAsDataURL(file);
  }

  private isStl(file: File) {
    const fileName = file.name.toLocaleLowerCase();
    return fileName.endsWith('.stl');
  }

  remove(tag: string): void {
    this.componentService.remove(tag, this.tags);
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private componentService: DetailComponentService
  ) {}

  ngOnInit(): void {
    this.thing$.subscribe((thing) => {
      this.tags = thing.tags;
      this.form.patchValue({
        ...thing,
        tags: null,
      });

      this.images = [];
      this.imageFiles = [];
      this.images.push(...thing.imageUrls);
      this.imageFiles.push(...thing.imageUrls);
      this.defaultImageLength = thing.imageUrls.length;

      this.stls = [];
      this.stls.push(...thing.stlRef.map((ref) => ref.downloadUrl));
      this.stlFiles.push(...thing.stlRef);
      this.defaultStlLength = thing.stlRef.length;
    });
  }

  cancel(thing: Thing) {
    this.router.navigateByUrl('/' + thing.id);
  }

  async save(thing: Thing) {
    const res = await this.thingService.saveThings(
      thing.id,
      this.stlFiles,
      this.imageFiles,
      this.defaultImageLength,
      this.defaultStlLength
    );
    const formValue = this.form.value;
    const newValue: Thing = {
      ...thing,
      stlRef: res.stlRef,
      imageUrls: res.imageUrls,
      title: formValue.title,
      description: formValue.description,
      tags: this.tags,
    };
    this.thingService.updateThing(newValue).then(() => {
      this.snackBar.open('保存しました。');
      this.router.navigateByUrl(`/${thing.id}`);
    });
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  deleteStl(index: number) {
    this.stls.splice(index, 1);
    this.stlFiles.splice(index, 1);
  }
}
