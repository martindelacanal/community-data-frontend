import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPerfilCompletoComponent } from './ver-perfil-completo.component';

describe('VerPerfilCompletoComponent', () => {
  let component: VerPerfilCompletoComponent;
  let fixture: ComponentFixture<VerPerfilCompletoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPerfilCompletoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerPerfilCompletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
