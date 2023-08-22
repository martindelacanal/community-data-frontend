import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComerciosClienteComponent } from './comercios-cliente.component';

describe('ComerciosClienteComponent', () => {
  let component: ComerciosClienteComponent;
  let fixture: ComponentFixture<ComerciosClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComerciosClienteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComerciosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
