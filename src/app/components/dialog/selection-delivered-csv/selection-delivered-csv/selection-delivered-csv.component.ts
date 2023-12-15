import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-selection-delivered-csv',
  templateUrl: './selection-delivered-csv.component.html',
  styleUrls: ['./selection-delivered-csv.component.scss']
})
export class SelectionDeliveredCsvComponent {

  constructor(
    public dialogRef: MatDialogRef<SelectionDeliveredCsvComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) { }

  ngOnInit(): void {

  }

  onClick(option: number) {
    this.dialogRef.close({ option: option });
  }

}
