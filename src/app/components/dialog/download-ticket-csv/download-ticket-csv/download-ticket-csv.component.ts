import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-download-ticket-csv',
  templateUrl: './download-ticket-csv.component.html',
  styleUrls: ['./download-ticket-csv.component.scss']
})
export class DownloadTicketCsvComponent implements OnInit {

  dateForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DownloadTicketCsvComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.dateForm = this.formBuilder.group({
      from_date: [null, Validators.required],
      to_date: [null, Validators.required],
    });
  }

  onClickAceptar() {
    // Obtener la fecha del formulario
    const date = new Date(this.dateForm.value.from_date);
    // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
    const dateString = date.toISOString().slice(0, 10);
    // Asignar la fecha al campo de fecha en el formulario
    this.dateForm.get('from_date').setValue(dateString);
    // Obtener la fecha del formulario
    const date2 = new Date(this.dateForm.value.to_date);
    // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
    const dateString2 = date2.toISOString().slice(0, 10);
    // Asignar la fecha al campo de fecha en el formulario
    this.dateForm.get('to_date').setValue(dateString2);
    this.dialogRef.close({ status: true, date: this.dateForm.value });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false, date: this.dateForm.value });
  }

  formatDate(event) {
    let input = event.target.value;
    input = input.replace(/[^0-9]/g, ''); // Elimina cualquier caracter que no sea un número
    let formattedInput = '';

    for (let i = 0; i < input.length; i++) {
      if (i == 2 || i == 4) {
        formattedInput += '/';
      }
      formattedInput += input[i];
    }

    event.target.value = formattedInput;
  }
}
