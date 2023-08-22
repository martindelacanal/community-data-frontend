import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPieChartCampaniasActivasComponent } from './grafico-pie-chart-campanias-activas.component';

describe('GraficoPieChartCampaniasActivasComponent', () => {
  let component: GraficoPieChartCampaniasActivasComponent;
  let fixture: ComponentFixture<GraficoPieChartCampaniasActivasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoPieChartCampaniasActivasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPieChartCampaniasActivasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
