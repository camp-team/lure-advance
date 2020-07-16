import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineCommentsCardComponent } from './timeline-comments-card.component';

describe('TimelineCommentsCardComponent', () => {
  let component: TimelineCommentsCardComponent;
  let fixture: ComponentFixture<TimelineCommentsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineCommentsCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineCommentsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
