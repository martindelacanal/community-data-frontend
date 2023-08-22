import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticularClientesComponent } from './particular-clientes.component';

describe('ParticularClientesComponent', () => {
  let component: ParticularClientesComponent;
  let fixture: ComponentFixture<ParticularClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticularClientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticularClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
