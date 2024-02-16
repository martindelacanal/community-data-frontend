import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductTypeComponent } from './new-product-type.component';

describe('NewProductTypeComponent', () => {
  let component: NewProductTypeComponent;
  let fixture: ComponentFixture<NewProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProductTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
