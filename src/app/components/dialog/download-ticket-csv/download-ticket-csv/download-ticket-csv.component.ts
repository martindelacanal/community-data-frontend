import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FilterChip } from 'src/app/models/metrics/filter-chip';

@Component({
  selector: 'app-download-ticket-csv',
  templateUrl: './download-ticket-csv.component.html',
  styleUrls: ['./download-ticket-csv.component.scss']
})
export class DownloadTicketCsvComponent implements OnInit {

  dateForm: FormGroup;
  private previousInputFromDate: string;
  private previousInputToDate: string;

  constructor(
    public dialogRef: MatDialogRef<DownloadTicketCsvComponent>,
    @Inject(MAT_DIALOG_DATA) public message: any,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
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

      // actualizar filters_chip, es un array con code, name y value
      let filters_chip: FilterChip[] = JSON.parse(localStorage.getItem('filters_chip')) || [];
      for (let key in val) {
        //borrar el filtro si ya existe
        filters_chip = filters_chip.filter(f => f.code !== key);
        if (val[key] && (!Array.isArray(val[key]) || val[key].length) && val[key] !== '') {
          // si es un array de id, recorrerlo y guardar los nombres separados por coma utilizando las variables locations, genders y ethnicities
          if (key === 'locations' || key === 'genders' || key === 'ethnicities') {
            // let names = [];
            // val[key].forEach(id => {
            //   if (key === 'locations') {
            //     names.push(this.locations.find(l => l.id === id).community_city);
            //   } else if (key === 'genders') {
            //     names.push(this.genders.find(g => g.id === id).name);
            //   } else if (key === 'ethnicities') {
            //     names.push(this.ethnicities.find(e => e.id === id).name);
            //   }
            // }
            // );
            // filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: names.join(', ') });
          } else if (key === 'from_date' || key === 'to_date') {
            let date = new Date(val[key] + 'T00:00');
            let formattedDate = date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            });
            filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: formattedDate });
          } else {
            filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: val[key] });
          }
        }
      }
      localStorage.setItem('filters_chip', JSON.stringify(filters_chip));
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


  formatDate(event, selectType: string) {
    let input = event.target.value;
    let cursorPosition = event.target.selectionStart; // Guarda la posición del cursor
    let previousLength = 0;

    switch (selectType) {
      case 'from_date':
        previousLength = this.previousInputFromDate ? this.previousInputFromDate.length : 0; // Guarda la longitud del input anterior
        break;
      case 'to_date':
        previousLength = this.previousInputToDate ? this.previousInputToDate.length : 0; // Guarda la longitud del input anterior
        break;
    }

    input = input.replace(/[^0-9]/g, ''); // Elimina cualquier caracter que no sea un número
    let formattedInput = '';
    let addedSlash = false;

    for (let i = 0; i < input.length; i++) {
      if (i == 2 || i == 4) {
        formattedInput += '/';
        addedSlash = true;
      }
      formattedInput += input[i];
    }

    event.target.value = formattedInput;

    // Si se ha agregado una barra, incrementa la posición del cursor
    if (addedSlash && cursorPosition > 2) {
      cursorPosition++;
    }

    // Si se ha eliminado un carácter y el cursor no está en la primera o segunda posición, disminuye la posición del cursor
    if (formattedInput.length < previousLength && cursorPosition > 1) {
      cursorPosition--;
    }

    // Restablece la posición del cursor
    event.target.setSelectionRange(cursorPosition, cursorPosition);

    switch (selectType) {
      case 'from_date':
        // Guarda el input actual para la próxima vez
        this.previousInputFromDate = formattedInput;
        break;
      case 'to_date':
        // Guarda el input actual para la próxima vez
        this.previousInputToDate = formattedInput;
        break;
    }
  }

  formatDateOnBlur(event, dateType: string) {
    switch (dateType) {
      case 'from_date':
        if (this.previousInputFromDate && new Date(this.previousInputFromDate).toString() !== 'Invalid Date') {
          // Establece el valor del control de formulario a la fecha formateada
          this.dateForm.controls['from_date'].setValue(new Date(this.previousInputFromDate), { emitEvent: false });
          // Actualiza el valor y la validez del control de formulario
          this.dateForm.controls['from_date'].updateValueAndValidity({ emitEvent: false });
        }
        break;
      case 'to_date':
        if (this.previousInputToDate && new Date(this.previousInputToDate).toString() !== 'Invalid Date') {
          // Establece el valor del control de formulario a la fecha formateada
          this.dateForm.controls['to_date'].setValue(new Date(this.previousInputToDate), { emitEvent: false });
          // Actualiza el valor y la validez del control de formulario
          this.dateForm.controls['to_date'].updateValueAndValidity({ emitEvent: false });
        }
        break;
    }
  }

  formatDateOnFocus(event) {
    let input = event.target.value;
    let dateParts = input.split('/');

    if (dateParts.length === 3) {
      let month = dateParts[0].padStart(2, '0');
      let day = dateParts[1].padStart(2, '0');
      let year = dateParts[2];

      event.target.value = `${month}/${day}/${year}`;
    }
  }
}
