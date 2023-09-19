import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-register',
  templateUrl: './disclaimer-register.component.html',
  styleUrls: ['./disclaimer-register.component.scss']
})
export class DisclaimerRegisterComponent {

  constructor(
    public dialogRef: MatDialogRef<DisclaimerRegisterComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) { }


  onClickAceptar() {
    this.dialogRef.close({ status: true });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false });
  }
}
