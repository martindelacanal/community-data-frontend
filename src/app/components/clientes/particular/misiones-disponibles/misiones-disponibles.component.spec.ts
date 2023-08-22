import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisionesDisponiblesComponent } from './misiones-disponibles.component';

describe('MisionesDisponiblesComponent', () => {
  let component: MisionesDisponiblesComponent;
  let fixture: ComponentFixture<MisionesDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisionesDisponiblesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisionesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
