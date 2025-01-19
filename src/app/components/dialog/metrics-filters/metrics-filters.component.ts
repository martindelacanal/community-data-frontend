import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, forkJoin, of, tap } from 'rxjs';
import { RegisterAnswer } from 'src/app/models/login/register-answer';
import { RegisterQuestion } from 'src/app/models/login/register-question';
import { Location } from 'src/app/models/map/location';
import { FilterChip } from 'src/app/models/metrics/filter-chip';
import { Delivered } from 'src/app/models/stocker/delivered-by';
import { ProductType } from 'src/app/models/stocker/product-type';
import { Provider } from 'src/app/models/stocker/provider';
import { Transported } from 'src/app/models/stocker/transported-by';
import { Ethnicity } from 'src/app/models/user/ethnicity';
import { Gender } from 'src/app/models/user/gender';
import { WorkerFilter } from 'src/app/models/view/view-worker/worker-filter';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { StockerService } from 'src/app/services/stock/stocker.service';

@Component({
  selector: 'app-metrics-filters',
  templateUrl: './metrics-filters.component.html',
  styleUrls: ['./metrics-filters.component.scss']
})
export class MetricsFiltersComponent implements OnInit {

  filterForm: FormGroup;
  registerForm: FormGroup;

  workers: WorkerFilter[] = [];
  locations: Location[] = [];
  providers: Provider[] = [];
  delivereds: Delivered[] = [];
  transporteds: Transported[] = [];
  stockers: Provider[] = [];
  product_types: ProductType[] = [];
  genders: Gender[];
  ethnicities: Ethnicity[];
  origin: string = '';
  selectAllTextWorkers = 'Select all';
  selectAllTextLocations = 'Select all';
  selectAllTextGenders = 'Select all';
  selectAllTextEthnicities = 'Select all';
  selectAllTextProviders = 'Select all';
  selectAllTextDeliveredBy = 'Select all';
  selectAllTextTransportedBy = 'Select all';
  selectAllTextStockerUpload = 'Select all';
  selectAllTextProductTypes = 'Select all';

  filtersAnterior: string = '';
  filtersChipAnterior: string = '';

  private previousInputFromDate: string;
  private previousInputToDate: string;

  public registerQuestions: RegisterQuestion[] = [];
  public loadingRegisterQuestions: boolean = false;

  public loadingQuestions: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<MetricsFiltersComponent>,
    @Inject(MAT_DIALOG_DATA) public message: any,
    private formBuilder: FormBuilder,
    private deliveryService: DeliveryService,
    private stockerService: StockerService,
    public translate: TranslateService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {


    // Inicializa el formulario aquí, pero no lo llenes con datos todavía
    this.filterForm = this.formBuilder.group({
      from_date: [null],
      to_date: [null],
      workers: [null],
      locations: [null],
      providers: [null],
      delivered_by: [null],
      transported_by: [null],
      stocker_upload: [null],
      product_types: [null],
      genders: [null],
      ethnicities: [null],
      min_age: [null],
      max_age: [null],
      zipcode: [null],
      register_form: [null]
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
    this.selectAllTextWorkers = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextLocations = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextProviders = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextDeliveredBy = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextTransportedBy = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextStockerUpload = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextProductTypes = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextGenders = this.translate.instant('metrics_filters_button_select_all');
    this.selectAllTextEthnicities = this.translate.instant('metrics_filters_button_select_all');

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

    let array_api = [];
    let keys_available = [];
    if (this.origin === 'table-worker') {
      array_api.push(this.getWorkers());
      keys_available.push('workers');
    }
    if (this.origin !== 'table-product-type' && this.origin !== 'table-ethnicity' && this.origin !== 'table-gender' && this.origin !== 'table-delivered-by' && this.origin !== 'table-transported-by' && this.origin !== 'table-location' && this.origin !== 'table-delivered-beneficiary-summary') {
      array_api.push(this.getLocations());
      keys_available.push('locations');
    }
    if (this.origin == 'table-product' || this.origin == 'metrics-product' || this.origin == 'table-ticket') {
      array_api.push(this.getProviders());
      keys_available.push('providers');
    }
    if (this.origin == 'table-ticket' || this.origin == 'metrics-product') {
      array_api.push(this.getDeliveredBy());
      array_api.push(this.getTransportedBy());
      keys_available.push('delivered_by');
      keys_available.push('transported_by');
    }
    if (this.origin == 'table-ticket' || this.origin == 'metrics-product') {
      array_api.push(this.getStockerUpload());
      keys_available.push('stocker_upload');
    }
    if (this.origin == 'table-product' || this.origin == 'metrics-product') {
      array_api.push(this.getProductTypes(this.translate.currentLang));
      keys_available.push('product_types');
    }
    if (this.origin == 'table-user' || this.origin == 'table-participant' || this.origin == 'table-volunteer') {
      array_api.push(this.getGender(this.translate.currentLang));
      array_api.push(this.getEthnicity(this.translate.currentLang));
      keys_available.push('genders');
      keys_available.push('ethnicities');
    }
    if (this.origin == 'metrics-health' || this.origin == 'table-participant') {
      array_api.push(this.getGender(this.translate.currentLang));
      this.getRegisterQuestions(this.translate.currentLang); // en estos casos se necesita las preguntas del formulario de registro como filtros
    }

    let observable$ = array_api.length > 0 ? forkJoin(array_api) : of([]);

    observable$.subscribe(() => {
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
            // si es un array de id, recorrerlo y guardar los nombres separados por coma utilizando las variables workers, locations, providers, delivered_by, transported_by, stocker_upload, product_types, genders y ethnicities
            if (key === 'workers' || key === 'locations' || key === 'providers' || key === 'delivered_by' || key === 'transported_by' || key === 'stocker_upload' || key === 'product_types' || key === 'genders' || key === 'ethnicities') {
              if (keys_available.includes(key)) {
                let names = [];
                val[key].forEach(id => {
                  switch (key) {
                    case 'workers':
                      let worker = this.workers.find(l => l.id === id);
                      if (worker) {
                        names.push(worker.username);
                      }
                      break;
                    case 'locations':
                      let location = this.locations.find(l => l.id === id);
                      if (location) {
                        names.push(location.community_city);
                      }
                      break;
                    case 'providers':
                      let provider = this.providers.find(p => p.id === id);
                      if (provider) {
                        names.push(provider.name);
                      }
                      break;
                    case 'delivered_by':
                      let delivered = this.delivereds.find(p => p.id === id);
                      if (delivered) {
                        names.push(delivered.name);
                      }
                      break;
                    case 'transported_by':
                      let transported = this.transporteds.find(p => p.id === id);
                      if (transported) {
                        names.push(transported.name);
                      }
                      break;
                    case 'stocker_upload':
                      let stocker = this.stockers.find(p => p.id === id);
                      if (stocker) {
                        names.push(stocker.name);
                      }
                      break;
                    case 'product_types':
                      let product_type = this.product_types.find(p => p.id === id);
                      if (product_type) {
                        names.push(product_type.name);
                      }
                      break;
                    case 'genders':
                      let gender = this.genders.find(g => g.id === id);
                      if (gender) {
                        names.push(gender.name);
                      }
                      break;
                    case 'ethnicities':
                      let ethnicity = this.ethnicities.find(e => e.id === id);
                      if (ethnicity) {
                        names.push(ethnicity.name);
                      }
                      break;
                  }
                });
                filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: names.join(', ') });
              }
            } else if (key === 'from_date' || key === 'to_date') {
              let date = new Date(val[key] + 'T00:00');
              let formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
              filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: formattedDate });
            } else {
              if (key !== 'register_form') {
                filters_chip.push({ code: key, name: this.translate.instant('metrics_filters_input_' + key), value: val[key] });
              }
            }
          }
        }
        localStorage.setItem('filters_chip', JSON.stringify(filters_chip));
      });
    });

  }

  onClickAceptar() {
    // Guarda los filtros del formulario de registro en el formulario de filtros
    if (this.origin == 'metrics-health' || this.origin == 'table-participant') {
      this.buildCombinedForm();
    }
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

  onClickClean() {
    // reset registerForm
    if (this.registerForm) {
      this.registerForm.reset();
    } else {
      this.buildRegisterForm();
    }
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
      case 'workers':
        this.selectAllTextWorkers = text;
        break;
      case 'locations':
        this.selectAllTextLocations = text;
        break;
      case 'providers':
        this.selectAllTextProviders = text;
        break;
      case 'delivered_by':
        this.selectAllTextDeliveredBy = text;
        break;
      case 'transported_by':
        this.selectAllTextTransportedBy = text;
        break;
      case 'stocker_upload':
        this.selectAllTextStockerUpload = text;
        break;
      case 'product_types':
        this.selectAllTextProductTypes = text;
        break;
      case 'genders':
        this.selectAllTextGenders = text;
        break;
      case 'ethnicities':
        this.selectAllTextEthnicities = text;
        break;
    }
  }

  private getWorkers() {
    return this.deliveryService.getWorkers().pipe(
      tap((res) => {
        this.workers = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getLocations() {
    return this.deliveryService.getLocations().pipe(
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

  private getDeliveredBy() {
    return this.stockerService.getDelivereds().pipe(
      tap((res) => {
        this.delivereds = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getTransportedBy() {
    return this.stockerService.getTransporteds().pipe(
      tap((res) => {
        this.transporteds = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getStockerUpload() {
    return this.stockerService.getStockerUpload().pipe(
      tap((res) => {
        this.stockers = res;
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

  private getGender(language: string, id?: number) {
    return this.authService.getGender(language, id).pipe(
      tap((res) => {
        this.genders = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getEthnicity(language: string, id?: number) {
    return this.authService.getEthnicity(language, id).pipe(
      tap((res) => {
        this.ethnicities = res;
      }),
      catchError((error) => {
        console.error(error);
        return of(null);
      })
    );
  }

  private getRegisterQuestions(language: string) {
    this.loadingQuestions = true;
    this.authService.getRegisterQuestions(language).pipe(
      finalize(() => {
        this.loadingQuestions = false;
      })
    ).subscribe({
      next: (res) => {
        if (res.length === 0) {
          this.openSnackBar(this.translate.instant('register_snack_get_questions_error'));
        }
        this.registerQuestions = res;
        this.buildRegisterForm();
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('register_snack_get_questions_error'));
      }
    });
  }

  private buildRegisterForm(): void {
    this.loadingRegisterQuestions = true;

    const formGroup = this.registerQuestions.reduce((group, control) => {
      if (control.answer_type_id === 4) {
        group[control.id] = this.formBuilder.array([], [Validators.required]);
      } else {
        group[control.id] = [null, Validators.required];
      }
      return group;
    }, {});

    this.registerForm = this.formBuilder.group(formGroup);

    for (let i = 0; i < this.registerQuestions.length; i++) {
      // obtener en un array las preguntas que dependen de la pregunta actual
      const dependsOnQuestionIds = this.registerQuestions.filter(x => x.depends_on_question_id === this.registerQuestions[i].id);

      if (dependsOnQuestionIds.length > 0) {
        // Si tiene preguntas que dependan de la pregunta actual, agregar un observador al campo de la pregunta actual
        this.registerForm.get(this.registerQuestions[i].id.toString()).valueChanges.subscribe(value => {

          var answerIds: number[] = []; // obtener los id de las respuestas seleccionadas
          if (this.registerQuestions[i].answer_type_id === 4) { // es un multiple option
            answerIds = value.map(x => parseInt(x, 10)); // value es un array de ids en string
          } else { // es un simple option
            answerIds.push(value); // value es un id
          }
          // obtener los id de las dependQuestionIds cuya depends_on_answer_id sea igual a alguno de los answerIds obtenidos
          const dependsOnQuestionIdsFiltered_selected = dependsOnQuestionIds.filter(x => answerIds.includes(x.depends_on_answer_id));
          // obtener los id de las dependQuestionIds cuyo depends_on_answer_id sea diferente a alguno de los answerIds obtenidos
          const dependsOnQuestionIdsFiltered_notselected = dependsOnQuestionIds.filter(x => !answerIds.includes(x.depends_on_answer_id));
          // setValidators a los campos de las dependsOnQuestionIdsFiltered_selected
          for (let j = 0; j < dependsOnQuestionIdsFiltered_selected.length; j++) {
            this.registerForm.get(dependsOnQuestionIdsFiltered_selected[j].id.toString()).setValidators(Validators.required);
            this.registerForm.get(dependsOnQuestionIdsFiltered_selected[j].id.toString()).updateValueAndValidity();
          }
          // setValidators a los campos de las dependOnQuestionIdsFiltered_notselected
          for (let j = 0; j < dependsOnQuestionIdsFiltered_notselected.length; j++) {
            if (dependsOnQuestionIdsFiltered_notselected[j].answer_type_id === 4) {
              (this.registerForm.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()) as FormArray).clear();
            } else {
              this.registerForm.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()).reset();
            }
            this.registerForm.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()).clearValidators();
            this.registerForm.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()).updateValueAndValidity();
            // hacer lo mismo con los hijos de las dependOnQuestionIdsFiltered_notselected
            const childrenQuestions = this.getChildrenQuestions(dependsOnQuestionIdsFiltered_notselected[j]);
            for (let k = 0; k < childrenQuestions.length; k++) {
              if (childrenQuestions[k].answer_type_id === 4) {
                (this.registerForm.get(childrenQuestions[k].id.toString()) as FormArray).clear();
              } else {
                this.registerForm.get(childrenQuestions[k].id.toString()).reset();
              }
              this.registerForm.get(childrenQuestions[k].id.toString()).clearValidators();
              this.registerForm.get(childrenQuestions[k].id.toString()).updateValueAndValidity();
            }
          }
        });
      }
    }

    this.loadingRegisterQuestions = false;
  }

  private getChildrenQuestions(question: RegisterQuestion): RegisterQuestion[] {
    const childrenQuestions = this.registerQuestions.filter(x => x.depends_on_question_id === question.id);
    let result = [...childrenQuestions];
    for (const child of childrenQuestions) {
      result = [...result, ...this.getChildrenQuestions(child)];
    }
    return result;
  }

  private buildCombinedForm() {
    this.filterForm.setControl('register_form', this.registerForm);
  }

  shouldShowQuestion(question: any): boolean {
    if (!question.depends_on_question_id) {
      return true;
    }
    const dependsOnValue = this.registerForm.get(question.depends_on_question_id.toString()).value;
    if (!dependsOnValue) {
      return false;
    }
    if (Array.isArray(dependsOnValue)) {
      return dependsOnValue.includes(question.depends_on_answer_id);
    }
    return dependsOnValue === question.depends_on_answer_id;
  }

  onCheckboxChange(event: MatCheckboxChange, index: number, questionId: number) {
    const inputArray = this.registerForm.get(questionId.toString()) as FormArray;
    if (event.checked) {
      inputArray.push(this.formBuilder.control(this.getAnswersForQuestion(questionId)[index].id));
    } else {
      const indexFiltered = inputArray.controls.findIndex(x => x.value === this.getAnswersForQuestion(questionId)[index].id);
      inputArray.removeAt(indexFiltered);
    }
  }

  getAnswersForQuestion(questionId: number): RegisterAnswer[] {
    const question = this.registerQuestions.find(x => x.id === questionId);
    return question ? question.answers : [];
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }
}
