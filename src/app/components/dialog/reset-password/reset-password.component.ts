import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  passwordForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.passwordForm = this.formBuilder.group({
      password: [null, Validators.required]
    });
  }

  onClickAceptar() {
    this.dialogRef.close({ status: true, password: this.passwordForm.value });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false, password: this.passwordForm.value });
  }
}

