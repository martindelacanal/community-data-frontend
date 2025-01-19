import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVolunteerComponent } from './view-volunteer.component';

describe('ViewVolunteerComponent', () => {
  let component: ViewVolunteerComponent;
  let fixture: ComponentFixture<ViewVolunteerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVolunteerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVolunteerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
