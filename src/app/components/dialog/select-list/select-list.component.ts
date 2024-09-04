import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.scss']
})
export class SelectListComponent {

  tabla: any[] = [];
  selectedId: number | null = null;
  displayedColumns: string[] = ['firstname', 'lastname', 'creation_date'];

  constructor(
    public dialogRef: MatDialogRef<SelectListComponent>,
    @Inject(MAT_DIALOG_DATA) public message: any,
  ) {
    if (this.message.origin) {
      this.tabla = this.message.origin;
    }
  }

  onClickAceptar() {
    this.dialogRef.close({ status: true, id: this.selectedId });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false });
  }

  onRowClick(row: any) {
    this.selectedId = row.id;
  }

  isSelected(row: any): boolean {
    return this.selectedId === row.id;
  }
}
