import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitorParticularComponent } from './ditor-particular.component';

describe('DitorParticularComponent', () => {
  let component: DitorParticularComponent;
  let fixture: ComponentFixture<DitorParticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DitorParticularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitorParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
