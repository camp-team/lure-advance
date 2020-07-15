import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelineNotificationCardComponent } from './timeline-notification-card.component';

describe('TimelineNotificationCardComponent', () => {
  let component: TimelineNotificationCardComponent;
  let fixture: ComponentFixture<TimelineNotificationCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineNotificationCardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineNotificationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
