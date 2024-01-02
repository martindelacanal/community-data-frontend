import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsProductComponent } from './metrics-product.component';

describe('MetricsProductComponent', () => {
  let component: MetricsProductComponent;
  let fixture: ComponentFixture<MetricsProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
