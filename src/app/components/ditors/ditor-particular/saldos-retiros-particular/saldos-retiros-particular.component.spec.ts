import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldosRetirosParticularComponent } from './saldos-retiros-particular.component';

describe('SaldosRetirosParticularComponent', () => {
  let component: SaldosRetirosParticularComponent;
  let fixture: ComponentFixture<SaldosRetirosParticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldosRetirosParticularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldosRetirosParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
