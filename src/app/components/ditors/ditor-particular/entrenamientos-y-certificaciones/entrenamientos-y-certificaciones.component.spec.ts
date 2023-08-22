import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenamientosYCertificacionesComponent } from './entrenamientos-y-certificaciones.component';

describe('EntrenamientosYCertificacionesComponent', () => {
  let component: EntrenamientosYCertificacionesComponent;
  let fixture: ComponentFixture<EntrenamientosYCertificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrenamientosYCertificacionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenamientosYCertificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
