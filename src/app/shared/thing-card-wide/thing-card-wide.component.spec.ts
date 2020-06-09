import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThingCardWideComponent } from './thing-card-wide.component';

describe('ThingCardWideComponent', () => {
  let component: ThingCardWideComponent;
  let fixture: ComponentFixture<ThingCardWideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThingCardWideComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThingCardWideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
