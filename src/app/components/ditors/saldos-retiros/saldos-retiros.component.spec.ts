import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldosRetirosComponent } from './saldos-retiros.component';

describe('SaldosRetirosComponent', () => {
  let component: SaldosRetirosComponent;
  let fixture: ComponentFixture<SaldosRetirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaldosRetirosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldosRetirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
