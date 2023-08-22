import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoPieCampaniasPreparacionComponent } from './grafico-pie-campanias-preparacion.component';

describe('GraficoPieCampaniasPreparacionComponent', () => {
  let component: GraficoPieCampaniasPreparacionComponent;
  let fixture: ComponentFixture<GraficoPieCampaniasPreparacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoPieCampaniasPreparacionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoPieCampaniasPreparacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
