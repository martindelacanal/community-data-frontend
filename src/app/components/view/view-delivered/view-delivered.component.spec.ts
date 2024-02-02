import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDeliveredComponent } from './view-delivered.component';

describe('ViewDeliveredComponent', () => {
  let component: ViewDeliveredComponent;
  let fixture: ComponentFixture<ViewDeliveredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewDeliveredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewDeliveredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
