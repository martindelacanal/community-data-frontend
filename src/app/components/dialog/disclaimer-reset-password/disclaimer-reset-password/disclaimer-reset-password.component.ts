import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-reset-password',
  templateUrl: './disclaimer-reset-password.component.html',
  styleUrls: ['./disclaimer-reset-password.component.scss']
})
export class DisclaimerResetPasswordComponent {

  constructor(
    public dialogRef: MatDialogRef<DisclaimerResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) { }


  onClickAceptar() {
    this.dialogRef.close({ status: true });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false });
  }
}
