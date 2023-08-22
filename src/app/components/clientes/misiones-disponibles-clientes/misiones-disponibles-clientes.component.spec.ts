import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisionesDisponiblesClientesComponent } from './misiones-disponibles-clientes.component';

describe('MisionesDisponiblesClientesComponent', () => {
  let component: MisionesDisponiblesClientesComponent;
  let fixture: ComponentFixture<MisionesDisponiblesClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisionesDisponiblesClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisionesDisponiblesClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
