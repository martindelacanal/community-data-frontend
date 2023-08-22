import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaniasActivasComponent } from './campanias-activas.component';

describe('CampaniasActivasComponent', () => {
  let component: CampaniasActivasComponent;
  let fixture: ComponentFixture<CampaniasActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaniasActivasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaniasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
