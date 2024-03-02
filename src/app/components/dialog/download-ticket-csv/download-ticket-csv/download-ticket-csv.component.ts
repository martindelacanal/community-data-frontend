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
  ) {
    this.dateForm = this.formBuilder.group({
      from_date: [null, Validators.required],
      to_date: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // Intenta recuperar el valor de 'filters' del localStorage
    const filters = JSON.parse(localStorage.getItem('filters'));

    // Si existe, asigna el valor al formulario, si no, guarda el formulario vacío en el localStorage
    if (filters) {
      // Convierte las fechas a objetos Date y luego las formatea en el formato deseado
      if (filters.from_date) {
        const date = new Date(filters.from_date + 'T00:00');
        filters.from_date = date;
      }
      if (filters.to_date) {
        const date2 = new Date(filters.to_date + 'T00:00');
        filters.to_date = date2;
      }

      this.dateForm.patchValue(filters);
    } else {
      const currentFilters = JSON.parse(localStorage.getItem('filters')) || {};
      const updatedFilters = { ...currentFilters, ...this.dateForm.value };
      localStorage.setItem('filters', JSON.stringify(updatedFilters));
    }

    // Suscríbete a los cambios del formulario y actualiza el valor en el localStorage cada vez que haya un cambio
    this.dateForm.valueChanges.subscribe(val => {
      const currentFilters = JSON.parse(localStorage.getItem('filters')) || {};
      const updatedFilters = { ...currentFilters, ...val };
      localStorage.setItem('filters', JSON.stringify(updatedFilters));
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
