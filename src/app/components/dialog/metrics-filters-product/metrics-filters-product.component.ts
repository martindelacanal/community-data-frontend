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
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

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
  selectAllTextLocations = 'Select all';
  selectAllTextProviders = 'Select all';
  selectAllTextProductTypes = 'Select all';

  filtersAnterior: string = '';
  filtersChipAnterior: string = '';

  private previousInputFromDate: string;
  private previousInputToDate: string;

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

    if (this.message.origin) {
      this.origin = this.message.origin;
    }
  }

  ngOnInit(): void {
    // Guardo filters y filters_chip en variables para comparar si han cambiado
    this.filtersAnterior = localStorage.getItem('filters');
    this.filtersChipAnterior = localStorage.getItem('filters_chip');

    // Traduce el texto de los botones de selección
    this.selectAllTextLocations = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextProviders = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextProductTypes = this.translate.instant('metrics_filters_button_select_all');

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
                  let location = this.locations.find(l => l.id === id);
                  if (location) {
                    names.push(location.community_city);
                  }
                } else if (key === 'providers') {
                  let provider = this.providers.find(p => p.id === id);
                  if (provider) {
                    names.push(provider.name);
                  }
                } else if (key === 'product_types') {
                  let product_type = this.product_types.find(p => p.id === id);
                  if (product_type) {
                    names.push(product_type.name);
                  }
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
    // Guardar los filtros que estaban en filtersAnterior y filtersChipAnterior
    localStorage.setItem('filters', this.filtersAnterior);
    localStorage.setItem('filters_chip', this.filtersChipAnterior);

    this.dialogRef.close({ status: false, data: this.filterForm.value });
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
          this.filterForm.controls['from_date'].setValue(new Date(this.previousInputFromDate), { emitEvent: false });
          // Actualiza el valor y la validez del control de formulario
          this.filterForm.controls['from_date'].updateValueAndValidity({ emitEvent: false });
        }
        break;
      case 'to_date':
        if (this.previousInputToDate && new Date(this.previousInputToDate).toString() !== 'Invalid Date') {
          // Establece el valor del control de formulario a la fecha formateada
          this.filterForm.controls['to_date'].setValue(new Date(this.previousInputToDate), { emitEvent: false });
          // Actualiza el valor y la validez del control de formulario
          this.filterForm.controls['to_date'].updateValueAndValidity({ emitEvent: false });
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

  toggleAllSelection(matSelect: MatSelect, selectType: string) {
    const isSelected: boolean = matSelect.options
      // The "Select All" item has the value 0, so find that one
      .filter((item: MatOption) => item.value === 0)
      // Get the value of the property 'selected' (this tells us whether "Select All" is selected or not)
      .map((item: MatOption) => item.selected)
    // Get the first element (there should only be 1 option with the value 0 in the select)
    [0];

    if (isSelected) {
      matSelect.options.forEach((item: MatOption) => item.select());
      this.setSelectAllText(selectType, this.translate.instant('metrics_filters_button_clear_all'));
    } else {
      matSelect.options.forEach((item: MatOption) => item.deselect());
      this.setSelectAllText(selectType, this.translate.instant('metrics_filters_button_select_all'));
    }
  }

  setSelectAllText(selectType: string, text: string) {
    switch (selectType) {
      case 'locations':
        this.selectAllTextLocations = text;
        break;
      case 'providers':
        this.selectAllTextProviders = text;
        break;
      case 'product_types':
        this.selectAllTextProductTypes = text;
        break;
    }
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

