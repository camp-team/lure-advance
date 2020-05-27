import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingEditorComponent } from './thing-editor.component';

describe('ThingEditorComponent', () => {
  let component: ThingEditorComponent;
  let fixture: ComponentFixture<ThingEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThingEditorComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
