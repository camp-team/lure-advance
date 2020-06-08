import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingCardSmComponent } from './thing-card-sm.component';

describe('ThingCardSmComponent', () => {
  let component: ThingCardSmComponent;
  let fixture: ComponentFixture<ThingCardSmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThingCardSmComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingCardSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
