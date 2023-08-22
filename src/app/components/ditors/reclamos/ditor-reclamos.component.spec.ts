import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DitorReclamosComponent } from './ditor-reclamos.component';

describe('ReclamosComponent', () => {
  let component: DitorReclamosComponent;
  let fixture: ComponentFixture<DitorReclamosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DitorReclamosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DitorReclamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
