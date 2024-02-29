import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Location } from 'src/app/models/map/location';
import { Ethnicity } from 'src/app/models/user/ethnicity';
import { Gender } from 'src/app/models/user/gender';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { AuthService } from 'src/app/services/login/auth.service';

@Component({
  selector: 'app-metrics-filters',
  templateUrl: './metrics-filters.component.html',
  styleUrls: ['./metrics-filters.component.scss']
})
export class MetricsFiltersComponent implements OnInit{
  filterForm: FormGroup;
  locations: Location[] = [];
  genders: Gender[];
  ethnicities: Ethnicity[];

  constructor(
    public dialogRef: MatDialogRef<MetricsFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public message: FormGroup,
    private formBuilder: FormBuilder,
    private deliveryService: DeliveryService,
    public translate: TranslateService,
    private authService: AuthService,
  ) {
    // Inicializa el formulario aquí, pero no lo llenes con datos todavía
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      locations: [null],
      genders: [null],
      ethnicities: [null],
      min_age: [null],
      max_age: [null],
      zipcode: [null]
    });
  }

  ngOnInit(): void {
    // Intenta recuperar el valor de 'filters' del localStorage
    const filters = JSON.parse(localStorage.getItem('filters'));

    // Si existe, asigna el valor al formulario, si no, guarda el formulario vacío en el localStorage
    if (filters) {
      this.filterForm.patchValue(filters);
    } else {
      const currentFilters = JSON.parse(localStorage.getItem('filters')) || {};
      const updatedFilters = { ...currentFilters, ...this.filterForm.value };
      localStorage.setItem('filters', JSON.stringify(updatedFilters));
    }

    // Suscríbete a los cambios del formulario y actualiza el valor en el localStorage cada vez que haya un cambio
    this.filterForm.valueChanges.subscribe(val => {
      const currentFilters = JSON.parse(localStorage.getItem('filters')) || {};
      const updatedFilters = { ...currentFilters, ...val };
      localStorage.setItem('filters', JSON.stringify(updatedFilters));
    });

    this.getLocations();
    this.getGender(this.translate.currentLang);
    this.getEthnicity(this.translate.currentLang);
  }

  onClickAceptar() {

    // Si hay elemento en from_date
    if (this.filterForm.value.from_date) {
    console.log(this.filterForm.value.from_date);
    // Obtener la fecha del formulario
    const date = new Date(this.filterForm.value.from_date);
    // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
    const dateString = date.toISOString().slice(0, 10);
    // Asignar la fecha al campo de fecha en el formulario
    this.filterForm.get('from_date').setValue(dateString);
    console.log(this.filterForm.value.from_date);
    }

    // Si hay elemento en to_date
    if(this.filterForm.value.to_date) {
    // Obtener la fecha del formulario
    const date2 = new Date(this.filterForm.value.to_date);
    // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
    const dateString2 = date2.toISOString().slice(0, 10);
    // Asignar la fecha al campo de fecha en el formulario
    this.filterForm.get('to_date').setValue(dateString2);
    }

    this.dialogRef.close({ status: true, data: this.filterForm.value });
  }

  onClickCancelar() {
    this.dialogRef.close({ status: false, data: this.filterForm.value });
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

  private getLocations() {
    this.deliveryService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
  }

  private getGender(language: string, id?: number) {
    this.authService.getGender(language, id).subscribe({
      next: (res) => {
        this.genders = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getEthnicity(language: string, id?: number) {
    this.authService.getEthnicity(language, id).subscribe({
      next: (res) => {
        this.ethnicities = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}
