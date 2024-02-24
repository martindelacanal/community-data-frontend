import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-disclaimer-enable-disable-element',
  templateUrl: './disclaimer-enable-disable-element.component.html',
  styleUrls: ['./disclaimer-enable-disable-element.component.scss']
})
export class DisclaimerEnableDisableElementComponent {

  enabled: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DisclaimerEnableDisableElementComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
  ) {
    if (message == 'Y') {
      this.enabled = true;
    }
  }


  onClickAceptar() {
    this.dialogRef.close({ status: true });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false });
  }
}
