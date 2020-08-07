import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Thing } from '@interfaces/thing';
import { ThingReference } from '@interfaces/thing-reference';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { ThingReferenceService } from 'src/app/services/thing-reference.service';
import { ThingService } from 'src/app/services/thing.service';
import { UserService } from 'src/app/services/user.service';
import { StlViewerComponent } from 'src/app/stl-viewer/stl-viewer/stl-viewer.component';
@Component({
  selector: 'app-thing-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, AfterViewInit {
  @ViewChild(StlViewerComponent) stlViewr: StlViewerComponent;

  MAX_DESCRIPTION_LENGTH: number = 300;
  MAX_TITLE_LENGTH: number = 80;
  MAX_IMAGE_FILE_LENGTH: number = 4;
  MAX_STL_FILE_LENGTH: number = 1;
  MAX_TAGS_TEXT_LENGTH: number = 20;
  MAX_TAGS_NUM_LENGTH: number = 5;

  thing: Thing;
  private thing$: Observable<Thing> = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingService.getThingByID(thingId);
    }),
    tap((thing) => (this.thing = thing))
  );

  thingRef: ThingReference;
  private thingRef$: Observable<
    ThingReference
  > = this.route.parent.paramMap.pipe(
    switchMap((map) => {
      const thingId = map.get('thing');
      return this.thingRefService.getThingRefById(thingId);
    })
  );

  images: any[] = [];
  imageFiles: (File | string)[] = [];
  defaultImageLength: number;
  isVewing: boolean;

  stl: string | ArrayBuffer;
  stlFile: File;

  form: FormGroup = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.maxLength(this.MAX_TITLE_LENGTH)],
    ],
    description: ['', [Validators.maxLength(this.MAX_DESCRIPTION_LENGTH)]],
    tags: [''],
  });

  isCompleted: boolean;

  get titleControl(): FormControl {
    return this.form.get('title') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl;
  }
  get tagsContorol(): FormControl {
    return this.form.get('tags') as FormControl;
  }

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tags: string[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;

  selectFiles(event) {
    const files: File[] = Object.values(event.target.files);
    const hasEroor: boolean = this.selectFileValidator(files);
    if (hasEroor) {
      return;
    }
    files.forEach((file) => this.readFile(file));
  }

  selectStlFile(event) {
    const file: File = event.target.files[0];
    const fr = new FileReader();
    fr.onload = (e) => {
      this.stl = e.target.result as string;
      const stlUrl = e.target.result as string;
      this.stlFile = file;
      this.stlViewr.start(stlUrl);
    };
    fr.readAsDataURL(file);
    this.isVewing = true;
  }

  cancelFile() {
    this.isVewing = false;
    this.stl = null;
    this.stlViewr.clear();
  }

  private selectFileValidator(files: File[]): boolean {
    const stlFileLength: number = files.filter((file) => this.isStl(file))
      .length;
    const imageFilesLength = files.filter((file) => !this.isStl(file)).length;

    if (stlFileLength > this.MAX_STL_FILE_LENGTH) {
      this.snackBar.open(
        `You can't attach more than ${this.MAX_STL_FILE_LENGTH} stls.`
      );
      return true;
    }

    if (imageFilesLength + this.images.length > this.MAX_IMAGE_FILE_LENGTH) {
      this.snackBar.open(
        `You can't attach more than ${this.MAX_IMAGE_FILE_LENGTH} images.`
      );
      return true;
    }
    return false;
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  private readFile(file: File) {
    const fr: FileReader = new FileReader();
    fr.onload = (e) => {
      if (this.isStl(file)) {
        this.stl = e.target.result as string;
        const stlUrl = e.target.result as string;
        this.stlFile = file;
        this.stlViewr.start(stlUrl);
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
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  get tagTextLength(): number {
    const length: number = this.tags
      .map((tag) => tag.length)
      .reduce((accum, current) => accum + current, 0);
    const isOver: boolean = length > this.MAX_TAGS_TEXT_LENGTH;
    //TODO:issue エラー内容が上書きされる
    // this.tagsContorol.setErrors(isOver ? { maxTextLength: isOver } : null);
    return length;
  }

  get tagElementLength(): number {
    const error = this.tagsContorol.getError('maxTextLength');
    const isOver = this.tags.length > this.MAX_TAGS_NUM_LENGTH;
    // this.tagsContorol.setErrors(isOver ? { maxElementLength: isOver } : null);
    return this.tags.length;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private thingService: ThingService,
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private userService: UserService,
    private thingRefService: ThingReferenceService
  ) {
    this.thingRef$.pipe(take(1)).subscribe((ref) => {
      this.stl = ref?.downloadUrl;
      this.thingRef = ref;
      this.isVewing = Boolean(ref?.downloadUrl);
    });
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.thing$.pipe(take(1)).subscribe(async (thing) => {
      if (thing === undefined) {
        //+ボタン押下時
        return;
      }
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
    });
  }

  cancel() {
    const path: string = this.thing ? '/' + this.thing.id : '/';
    this.router.navigateByUrl(path);
  }

  async save() {
    const thingId: string = this.thing ? this.thing.id : this.db.createId();

    const result = await this.thingRefService.saveOnStorage(
      thingId,
      this.stlFile
    );

    const imageUrls: string[] = await this.thingService.saveOnStorage(
      thingId,
      this.imageFiles,
      this.defaultImageLength
    );

    const formValue = this.form.value;
    const newValue: Thing = {
      ...this.thing,
      imageUrls: imageUrls,
      title: formValue.title,
      description: formValue.description,
      tags: this.tags,
    };

    if (this.thing) {
      if (result) {
        const id: string = this.thingRef?.id
          ? this.thingRef.id
          : this.db.createId();
        const ref: Omit<ThingReference, 'updatedAt'> = {
          id: id,
          thingId: thingId,
          downloadCount: 0,
          downloadUrl: result.downloadUrl,
          fileName: result.fileName,
          fileSize: result.fileSize,
          createdAt: this.thing.createdAt,
        };
        await this.thingRefService.updateThingRef(thingId, ref);
      }
      this.thingService.updateThing(newValue).then(() => {
        this.snackBar.open('Updated.');
        this.isCompleted = true;
        this.router.navigateByUrl(`/${this.thing.id}`);
      });
    } else {
      const uid = this.userService.uid;
      await this.thingRefService.createThingRef(thingId, result);
      const thing: Omit<Thing, 'updateAt' | 'createdAt'> = {
        id: thingId,
        title: newValue.title,
        description: newValue.description,
        designerId: uid,
        imageUrls: imageUrls,
        commentCount: 0,
        likeCount: 0,
        viewCount: 0,
        tags: newValue.tags,
      };

      this.thingService.createThing(thing).then(() => {
        this.snackBar.open('Uploading is Successful');
        this.isCompleted = true;
        this.router.navigateByUrl(`/${thingId}`);
      });
    }
  }

  deleteImage(index: number) {
    this.images.splice(index, 1);
    this.imageFiles.splice(index, 1);
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = '作業中の内容が失われますがよろしいですか？';
    }
  }
}
