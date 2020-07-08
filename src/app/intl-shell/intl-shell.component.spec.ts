import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntlShellComponent } from './intl-shell.component';

describe('IntlShellComponent', () => {
  let component: IntlShellComponent;
  let fixture: ComponentFixture<IntlShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntlShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntlShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
