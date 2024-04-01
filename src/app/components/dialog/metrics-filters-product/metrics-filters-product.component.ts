import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { StockerService } from 'src/app/services/stock/stocker.service';
import { Provider } from 'src/app/models/stocker/provider';
import { ProductType } from 'src/app/models/stocker/product-type';
import { Location } from 'src/app/models/map/location';
import { catchError, forkJoin, of, tap } from 'rxjs';
import { FilterChip } from 'src/app/models/metrics/filter-chip';

@Component({
  selector: 'app-metrics-filters-product',
  templateUrl: './metrics-filters-product.component.html',
  styleUrls: ['./metrics-filters-product.component.scss']
})
export class MetricsFiltersProductComponent implements OnInit {

  filterForm: FormGroup;
  locations: Location[] = [];
  providers: Provider[] = [];
  product_types: ProductType[] = [];
  origin: string = '';

  constructor(
    public dialogRef: MatDialogRef<MetricsFiltersProductComponent>,
    @Inject(MAT_DIALOG_DATA) public message: any,
    private formBuilder: FormBuilder,
    private stockerService: StockerService,
    public translate: TranslateService,
  ) {
    // Inicializa el formulario aquí, pero no lo llenes con datos todavía
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      locations: [null],
      providers: [null],
      product_types: [null],
    });

    if(this.message.origin){
      this.origin = this.message.origin;
    }
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

      this.filterForm.patchValue(filters);
    } else {
      const currentFilters = JSON.parse(localStorage.getItem('filters')) || {};
      const updatedFilters = { ...currentFilters, ...this.filterForm.value };
      localStorage.setItem('filters', JSON.stringify(updatedFilters));
    }

    forkJoin([
      this.getLocations(),
      this.getProviders(),
      this.getProductTypes(this.translate.currentLang)
    ]).subscribe(() => {
      // Suscríbete a los cambios del formulario y actualiza el valor en el localStorage cada vez que haya un cambio
      this.filterForm.valueChanges.subscribe(val => {
        const currentFilters = JSON.parse(localStorage.getItem('filters')) || {};
        const updatedFilters = { ...currentFilters, ...val };
        localStorage.setItem('filters', JSON.stringify(updatedFilters));

        // actualizar filters_chip, es un array con code, name y value
        let filters_chip: FilterChip[] = JSON.parse(localStorage.getItem('filters_chip')) || [];
        for (let key in val) {
          //borrar el filtro si ya existe
          filters_chip = filters_chip.filter(f => f.code !== key);
          if (val[key] && (!Array.isArray(val[key]) || val[key].length) && val[key] !== '') {
            // si es un array de id, recorrerlo y guardar los nombres separados por coma utilizando las variables locations, providers y product_types
            if (key === 'locations' || key === 'providers' || key === 'product_types') {
              let names = [];
              val[key].forEach(id => {
                if (key === 'locations') {
                  names.push(this.locations.find(l => l.id === id).community_city);
                } else if (key === 'providers') {
                  names.push(this.providers.find(g => g.id === id).name);
                } else if (key === 'product_types') {
                  names.push(this.product_types.find(e => e.id === id).name);
                }
              }
              );
              filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: names.join(', ') });
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
    });


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
    if (this.filterForm.value.to_date) {
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
    return this.stockerService.getLocations().pipe(
      tap((res) => {
        this.locations = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getProviders() {
    return this.stockerService.getProviders().pipe(
       tap((res) => {
        this.providers = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getProductTypes(language: string, id?: number) {
    return this.stockerService.getProductTypes(language, id).pipe(
       tap((res) => {
        this.product_types = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

}

