import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisionesParticularComponent } from './misiones-particular.component';

describe('MisionesParticularComponent', () => {
  let component: MisionesParticularComponent;
  let fixture: ComponentFixture<MisionesParticularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisionesParticularComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisionesParticularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
