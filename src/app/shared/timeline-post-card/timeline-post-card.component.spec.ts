import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelinePostCardComponent } from './timeline-post-card.component';

describe('TimelineCardComponent', () => {
  let component: TimelinePostCardComponent;
  let fixture: ComponentFixture<TimelinePostCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelinePostCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelinePostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
