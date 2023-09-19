import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLocationComponent } from './table-location.component';

describe('TableLocationComponent', () => {
  let component: TableLocationComponent;
  let fixture: ComponentFixture<TableLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
