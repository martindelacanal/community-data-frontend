import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-register-location',
  templateUrl: './disclaimer-register-location.component.html',
  styleUrls: ['./disclaimer-register-location.component.scss']
})
export class DisclaimerRegisterLocationComponent {

  organization = '';
  address = '';

  constructor(
    public dialogRef: MatDialogRef<DisclaimerRegisterLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public message: any,
  ) {
    this.organization = message.organization;
    this.address = message.address;
   }

  onClickAceptar() {
    this.dialogRef.close({ status: true });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false });
  }
}
