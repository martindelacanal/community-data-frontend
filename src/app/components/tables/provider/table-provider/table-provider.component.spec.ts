import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProviderComponent } from './table-provider.component';

describe('TableProviderComponent', () => {
  let component: TableProviderComponent;
  let fixture: ComponentFixture<TableProviderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableProviderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
