import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoLineaDashboardClientesComponent } from './grafico-linea-dashboard-clientes.component';

describe('GraficoLineaDashboardClientesComponent', () => {
  let component: GraficoLineaDashboardClientesComponent;
  let fixture: ComponentFixture<GraficoLineaDashboardClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoLineaDashboardClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoLineaDashboardClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
