import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProductTypeComponent } from './table-product-type.component';

describe('TableProductTypeComponent', () => {
  let component: TableProductTypeComponent;
  let fixture: ComponentFixture<TableProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableProductTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
