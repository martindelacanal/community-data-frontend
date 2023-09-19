import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableTicketComponent } from './table-ticket.component';

describe('TableTicketComponent', () => {
  let component: TableTicketComponent;
  let fixture: ComponentFixture<TableTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableTicketComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
