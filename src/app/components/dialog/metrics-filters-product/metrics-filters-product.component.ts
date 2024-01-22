import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { StockerService } from 'src/app/services/stock/stocker.service';
import { Provider } from 'src/app/models/stocker/provider';
import { ProductType } from 'src/app/models/stocker/product-type';
import { Location } from 'src/app/models/map/location';

@Component({
  selector: 'app-metrics-filters-product',
  templateUrl: './metrics-filters-product.component.html',
  styleUrls: ['./metrics-filters-product.component.scss']
})
export class MetricsFiltersProductComponent implements OnInit{

  filterForm: FormGroup;
  locations: Location[] = [];
  providers: Provider[] = [];
  product_types: ProductType[] = [];

  constructor(
    public dialogRef: MatDialogRef<MetricsFiltersProductComponent>,
    @Inject(MAT_DIALOG_DATA) public message: FormGroup,
    private formBuilder: FormBuilder,
    private stockerService: StockerService,
    public translate: TranslateService,
  ) {
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      locations: [null],
      providers: [null],
      product_types: [null],
    });

    if (this.message) {
      this.filterForm.patchValue(this.message.value);
    }
  }

  ngOnInit(): void {
    this.getLocations();
    this.getProviders();
    this.getProductTypes(this.translate.currentLang);
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
    this.stockerService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
  }

  private getProviders() {
    this.stockerService.getProviders().subscribe({
      next: (res) => {
        this.providers = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getProductTypes(language: string, id?: number) {
    this.stockerService.getProductTypes(language, id).subscribe({
      next: (res) => {
        this.product_types = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

}

