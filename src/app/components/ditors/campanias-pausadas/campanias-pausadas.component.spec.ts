import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaniasPausadasComponent } from './campanias-pausadas.component';

describe('CampaniasPausadasComponent', () => {
  let component: CampaniasPausadasComponent;
  let fixture: ComponentFixture<CampaniasPausadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CampaniasPausadasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampaniasPausadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
