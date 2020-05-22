import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComonCommentComponent } from './comon-comment.component';

describe('ComonCommentComponent', () => {
  let component: ComonCommentComponent;
  let fixture: ComponentFixture<ComonCommentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ComonCommentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComonCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
