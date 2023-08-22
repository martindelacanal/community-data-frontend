import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacidadMisionesComponent } from './capacidad-misiones.component';

describe('CapacidadMisionesComponent', () => {
  let component: CapacidadMisionesComponent;
  let fixture: ComponentFixture<CapacidadMisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapacidadMisionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapacidadMisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
