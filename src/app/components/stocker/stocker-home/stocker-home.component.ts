import { BreakpointObserver, } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, debounceTime, finalize, map, of, startWith } from 'rxjs';
import { Location } from 'src/app/models/map/location';
import { NewTicket } from 'src/app/models/new/new-ticket';
import { Product } from 'src/app/models/stocker/product';
import { ProductType } from 'src/app/models/stocker/product-type';
import { Provider } from 'src/app/models/stocker/provider';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { StockerService } from 'src/app/services/stock/stocker.service';

@Component({
  selector: 'app-stocker-home',
  templateUrl: './stocker-home.component.html',
  styleUrls: ['./stocker-home.component.scss']
})
export class StockerHomeComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = true;
  public loadingGetForm: boolean = false;
  private loadingLocations: boolean = false;
  private loadingProviders: boolean = false;
  private loadingProducts: boolean = false;
  private loadingProductTypes: boolean = false;
  private previousInput: string;

  public stockForm: FormGroup;
  public isValidFiles: boolean = true;
  public isQuantityValid: boolean = true;
  public imageTicketUploaded: boolean = false;
  public showMessageStockFormInvalid: boolean = false;
  public showMessageFilesInvalid: boolean = false;
  public showMessageQuantityInvalid: boolean = false;
  public showMessageProductNull: boolean = false;
  public locationOrganizationSelected: string = '';
  public locationAddressSelected: string = '';

  private file_ticket: any;
  public idTicket: string = '';
  locations: Location[] = [];
  products: Product[] = [];
  product_types: ProductType[] = [];
  providers: Provider[] = [];
  providerNames: string[] = [];
  productNames: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsProvider: Observable<string[]>;
  inputIndexModified: number;
  numberOfFields: number;
  donationIDExists: boolean = false;
  loadingDonationIDExists: boolean = false;
  deletedFilesFromEdit: boolean = false;
  ticketGetted: NewTicket;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private stockerService: StockerService,
    public translate: TranslateService,
    public decodificadorService: DecodificadorService

  ) {
    this.numberOfFields = 0;
    this.file_ticket = [];
    this.buildStockForm();
    // get language from local storage
    translate.use(localStorage.getItem('language') || 'en');
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 900px)'
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.breakpointObserver.observe([
      '(min-width: 901px) and (max-width: 1200px)'
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });

    this.stockForm.get('donation_id').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateDonationIDExists(res);
        }
      );

    this.getLocations();
    this.getProviders();
    this.getProducts();
    this.getProductTypes(this.translate.currentLang);
    this.filteredOptionsProvider = this.stockForm.get('provider').valueChanges.pipe(
      startWith(''),
      map(value => this.filterProviders(value))
    );
    this.filteredOptions = this.stockForm.get('products').valueChanges.pipe(
      startWith(''),
      map(value => this.filterProducts(value))
    );

    // set locationOrganizationSelected and locationAddressSelected when location changes
    this.stockForm.get('destination').valueChanges.subscribe(
      (res) => {
        const location = this.locations.find(l => l.id === res);
        if (location) {
          this.locationOrganizationSelected = location.organization;
          this.locationAddressSelected = location.address;
        } else {
          this.locationOrganizationSelected = '';
          this.locationAddressSelected = '';
        }
      }
    );

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.idTicket = params['id'];
        this.getTicket();
      }
    });
  }

  onSubmit() {
    this.loading = true;
    if (this.imageTicketUploaded === true) {
      this.isValidFiles = true;
    } else {
      this.isValidFiles = false;
    }

    // check quantity (and if product isn't null)
    var sumQuantity = 0;
    var isQuantityZero = false; // check if there is a product with quantity 0 or null
    var isProductNull = false; // check if there is a product null
    for (let i = 0; i < this.productsForm.controls.length; i++) {
      const control = this.productsForm.controls[i];
      const quantity = control.get('quantity').value;
      if (quantity === null || quantity === 0) {
        isQuantityZero = true;
      } else {
        sumQuantity += quantity;
      }
      const product = control.get('product').value;
      if (product === null || product === '') {
        isProductNull = true;
      }
    }
    if (isQuantityZero || (sumQuantity !== this.stockForm.get('total_weight').value)) {
      this.isQuantityValid = false;
    } else {
      this.isQuantityValid = true;
    }

    if (this.stockForm.valid && this.isValidFiles && this.isQuantityValid && !isProductNull) {

      this.showMessageStockFormInvalid = false;
      this.showMessageFilesInvalid = false;
      this.showMessageQuantityInvalid = false;
      this.showMessageProductNull = false;
      // si se usó un provider creado, se guarda el id, si es nuevo se guarda el texto
      const provider = this.providers.find(p => p.name.toLowerCase() === this.stockForm.get('provider').value.toLowerCase());
      if (provider) {
        this.stockForm.get('provider').setValue(provider.id);
      }
      // si se usó un producto creado, se guarda el id, si es nuevo se guarda el texto
      for (let i = 0; i < this.productsForm.controls.length; i++) {
        const control = this.productsForm.controls[i];
        // check product
        const productName = control.get('product').value;
        const product = this.products.find(p => p.name.toLowerCase() === productName.toLowerCase());
        if (product) {
          control.get('product').setValue(product.id);
        }
      }
      var body = new FormData();
      if (this.file_ticket && this.file_ticket.length > 0) {
        for (let i = 0; i < this.file_ticket.length; i++) {
          const file = this.file_ticket[i].fileRaw;
          const fileName = this.file_ticket[i].fileName;
          body.append('ticket[]', file, fileName); // Agregar el archivo al FormData con el nombre "ticket[]"
        }
      } else {
        body.append('ticket[]', null); // Agregar un valor nulo al FormData si no hay archivos
      }
      body.append('form', JSON.stringify(this.stockForm.value));
      if (this.idTicket) {
        this.stockerService.updateTicket(this.idTicket, body).subscribe({
          next: (res) => {
            this.loading = false;
            this.openSnackBar(this.translate.instant('stocker_edit_snack_ticket_updated'));
            this.router.navigate(['/view/ticket/' + this.idTicket]);
          },
          error: (error) => {
            console.log(error);
            // volver a colocar el provider y el product en el formulario, ya que se cambió a id, ahora se cambia a texto
            this.stockForm.get('provider').setValue(this.providers.find(p => p.id === this.stockForm.get('provider').value).name);
            for (let i = 0; i < this.productsForm.controls.length; i++) {
              const control = this.productsForm.controls[i];
              const productName = control.get('product').value;
              const product = this.products.find(p => p.id === productName);
              if (product) {
                control.get('product').setValue(product.name);
              }
            }
            this.loading = false;
            // show error message in alert
            this.openSnackBar(this.translate.instant('stocker_edit_snack_error_update'));
          }
        });

      } else {
        this.stockerService.uploadTicket(body).subscribe({
          next: (res) => {
            this.loading = false;
            this.openSnackBar(this.translate.instant('stocker_snack_ticket_uploaded'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            // volver a colocar el provider y el product en el formulario, ya que se cambió a id, ahora se cambia a texto
            this.stockForm.get('provider').setValue(this.providers.find(p => p.id === this.stockForm.get('provider').value).name);
            for (let i = 0; i < this.productsForm.controls.length; i++) {
              const control = this.productsForm.controls[i];
              const productName = control.get('product').value;
              const product = this.products.find(p => p.id === productName);
              if (product) {
                control.get('product').setValue(product.name);
              }
            }
            this.loading = false;
            // show error message in alert
            this.openSnackBar(this.translate.instant('stocker_snack_ticket_uploaded_error'));
          }
        });
      }
    } else {
      this.loading = false;
      if (!this.stockForm.valid) {
        this.showMessageStockFormInvalid = true;
      } else {
        this.showMessageStockFormInvalid = false;
      }
      if (!this.isValidFiles) {
        this.showMessageFilesInvalid = true;
      } else {
        this.showMessageFilesInvalid = false;
      }
      if (!this.isQuantityValid) {
        this.showMessageQuantityInvalid = true;
      } else {
        this.showMessageQuantityInvalid = false;
      }
      if (isProductNull) {
        this.showMessageProductNull = true;
      } else {
        this.showMessageProductNull = false;
      }

      this.openSnackBar(this.translate.instant('stocker_snack_form_error'));
    }
  }

  onInputFocus(index: number): void {
    this.inputIndexModified = index;
  }

  uploadFile($event) {
    const files = $event.target.files;
    // delete all files inside file_ticket
    this.file_ticket = [];
    if (files.length === 0) {
      console.log('No file selected');
      this.imageTicketUploaded = false;
      return;
    }
    if (files.length > 2) {
      this.imageTicketUploaded = false;
      alert(this.translate.instant('stocker_alert_max_files_error'));
      return;
    }
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file) {
        const fileObj = {
          fileName: file.name,
          fileRaw: file
        };
        this.file_ticket.push(fileObj); // Agregar el archivo al array
        this.imageTicketUploaded = true;
        console.log('File selected');
      }
    }
  }

  deleteFiles() {
    this.file_ticket = [];
    this.imageTicketUploaded = false;
    this.deletedFilesFromEdit = true;
  }

  setProductTypeFromProduct(index: number): void {
    setTimeout(() => {
      const control = this.productsForm.controls[index];
      // check product
      const productName = control.get('product').value;
      if (productName) {
        const product = this.products.find(p => p.name && p.name.toLowerCase() === productName.toLowerCase());
        if (product) {
          // set product_type
          control.get('product_type').setValue(product.product_type_id);
          // disable product_type
          control.get('product_type').disable();
        } else {
          // enable product_type if no match
          control.get('product_type').enable();
        }
      }
    });
  }

  onNumberOfFieldsChange() {
    if (Number.isInteger(this.numberOfFields) && this.numberOfFields >= 0) {
      // quitar campos hasta que el número de campos sea igual al número de campos en el formulario
      while (this.productsForm.length > this.numberOfFields) {
        this.quitarCampo(true);
      }
      // agregar campos hasta que el número de campos sea igual al número de campos en el formulario
      while (this.productsForm.length < this.numberOfFields) {
        this.agregarCampo(true);
      }
    }
  }
  agregarCampo(createButton?: boolean) {
    this.productsForm.push(this.formBuilder.group({
      product: [null],
      product_type: [null],
      quantity: [null]
    }));
    if (!createButton) {
      this.numberOfFields++;
    }
  }
  quitarCampo(createButton?: boolean) {
    if (this.productsForm.length > 0) {
      this.productsForm.removeAt(this.productsForm.length - 1);
      if (!createButton) {
        this.numberOfFields--;
      }
    }
  }
  quitarCampoParticular(index: number): void {
    this.productsForm.removeAt(index);
    this.numberOfFields--;
  }
  get productsForm() {
    return this.stockForm.get('products') as FormArray;
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  formatDate(event) {
    let input = event.target.value;
    let cursorPosition = event.target.selectionStart; // Guarda la posición del cursor
    let previousLength = this.previousInput ? this.previousInput.length : 0; // Guarda la longitud del input anterior

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

    // Guarda el input actual para la próxima vez
    this.previousInput = formattedInput;
  }

  formatDateOnBlur(event) {
    if (this.previousInput && new Date(this.previousInput).toString() !== 'Invalid Date') {
      // Establece el valor del control de formulario a la fecha formateada
      this.stockForm.controls['date'].setValue(new Date(this.previousInput), { emitEvent: false });
      // Actualiza el valor y la validez del control de formulario
      this.stockForm.controls['date'].updateValueAndValidity({ emitEvent: false });
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

  private getTicket() {

    this.loadingGetForm = true;
    this.stockerService.getTicket(this.idTicket).pipe(
      finalize(() => {
        this.loadingGetForm = false;
        this.checkLoading();
      })
    ).subscribe({
      next: (res) => {

        this.ticketGetted = {
          donation_id: res.donation_id,
          total_weight: res.total_weight,
          provider: res.provider,
          destination: res.destination,
          date: new Date(res.date).toISOString(),
          delivered_by: res.delivered_by,
          image_count: res.image_count,
          products: res.products
        }

        this.stockForm.patchValue({
          donation_id: res.donation_id,
          total_weight: res.total_weight,
          provider: res.provider,
          destination: res.destination,
          date: new Date(res.date),
          delivered_by: res.delivered_by
        });
        // agregar campos de productos
        for (let i = 0; i < res.products.length; i++) {
          this.agregarCampo(true);
          const control = this.productsForm.controls[i];
          control.get('product').setValue(res.products[i].product);
          control.get('product_type').setValue(res.products[i].product_type);
          control.get('quantity').setValue(res.products[i].quantity);
        }
        this.file_ticket = [];
        if (this.ticketGetted.image_count > 0) {
          this.imageTicketUploaded = true;
        }
        this.numberOfFields = res.products.length;

        // Actualizar la validez de los campos de formulario
        this.stockForm.get('donation_id').updateValueAndValidity();
        this.stockForm.get('total_weight').updateValueAndValidity();
        this.stockForm.get('provider').updateValueAndValidity();
        this.stockForm.get('destination').updateValueAndValidity();
        this.stockForm.get('date').updateValueAndValidity();
        this.stockForm.get('delivered_by').updateValueAndValidity();
        this.stockForm.get('products').updateValueAndValidity();

        // Mark each form control as touched
        Object.keys(this.stockForm.controls).forEach(field => {
          const control = this.stockForm.get(field);
          control.markAsTouched({ onlySelf: true });
        });

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('stocker_edit_snack_get_error'));
      }
    });
  }

  private resetearFormulario() {
    // this.router.navigate(['stocker/home']);
    this.stockForm.reset();
    this.stockForm.get('donation_id').setErrors(null);
    this.stockForm.get('total_weight').setErrors(null);
    this.stockForm.get('provider').setErrors(null);
    this.stockForm.get('destination').setErrors(null);
    this.stockForm.get('date').setErrors(null);
    this.stockForm.get('delivered_by').setErrors(null);
    this.stockForm.get('products').setErrors(null);
    this.file_ticket = [];
    this.imageTicketUploaded = false;
    this.numberOfFields = 0;
    this.productsForm.clear();
    this.showMessageStockFormInvalid = false;
    this.showMessageFilesInvalid = false;
    this.showMessageQuantityInvalid = false;
    this.showMessageProductNull = false;
    this.locationOrganizationSelected = '';
    this.locationAddressSelected = '';
    this.donationIDExists = false;
  }

  private filterProviders(value: any): string[] {
    if (typeof value !== 'string') {
      return [];
    }
    if (value === '') {
      return this.providerNames;
    }
    const filterValue = value.toLowerCase();
    return this.providerNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  private filterProducts(value: any): string[] {
    if (typeof value !== 'string' && typeof value !== 'object') {
      return [];
    }
    if (this.inputIndexModified === undefined) {
      return this.productNames;
    }
    const valueString = typeof value === 'object' ? value[this.inputIndexModified]?.product : value;
    const filterValue = typeof valueString === 'string' ? valueString.toLowerCase() : '';
    return this.productNames.filter(option => option.toLowerCase().includes(filterValue));
  }

  private getLocations() {
    this.loadingLocations = true;
    this.stockerService.getLocations().pipe(
      finalize(() => {
        this.loadingLocations = false;
        this.checkLoading();
      })
    ).subscribe({
      next: (res) => {
        this.locations = res;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('table_locations_snack_error_get'));
      }
    });
  }

  private getProviders() {
    this.loadingProviders = true;
    this.stockerService.getProviders().pipe(
      finalize(() => {
        this.loadingProviders = false;
        this.checkLoading();
      })
    ).subscribe({
      next: (res) => {
        this.providers = res;
        // iterate providers and push name into providerNames
        for (let i = 0; i < this.providers.length; i++) {
          this.providerNames.push(this.providers[i].name);
        }
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('table_providers_snack_error_get'));
      }
    });
  }

  private getProducts() {
    this.loadingProducts = true;
    this.stockerService.getProducts().pipe(
      finalize(() => {
        this.loadingProducts = false;
        this.checkLoading();
      })
    ).subscribe({
      next: (res) => {
        this.products = res;
        // iterate products and push name into productNames
        for (let i = 0; i < this.products.length; i++) {
          this.productNames.push(this.products[i].name);
        }
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('table_products_snack_error_get'));
      }
    });
  }

  private getProductTypes(language: string, id?: number) {
    this.loadingProductTypes = true;
    this.stockerService.getProductTypes(language, id).pipe(
      finalize(() => {
        this.loadingProductTypes = false;
        this.checkLoading();
      })
    ).subscribe({
      next: (res) => {
        this.product_types = res;
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('table_product_types_snack_error_get'));
      }
    });
  }

  private updateDonationIDExists(nombre: string) {
    if (this.idTicket && this.ticketGetted.donation_id === nombre) {
      this.donationIDExists = false;
      this.stockForm.get('donation_id').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingDonationIDExists = true;
      this.stockerService.getDonationIDExists(nombre).pipe(
        finalize(() => {
          this.loadingDonationIDExists = false;
        })
      ).subscribe({
        next: (res) => {
          if (res) {
            this.donationIDExists = true;
          } else {
            this.donationIDExists = false;
          }
          this.stockForm.get('donation_id').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  private validateDonationID(): ValidationErrors | null {
    if (this.donationIDExists) {
      return { 'invalidDonationID': true };
    }
    return null;
  }

  private checkLoading() {
    if (!this.loadingLocations && !this.loadingProviders && !this.loadingProducts && !this.loadingProductTypes) {
      if (this.idTicket) {
        if (!this.loadingGetForm) {
          this.loading = false;
        }
      } else {
        this.loading = false;
      }
    }
  }

  private buildStockForm(): void {
    this.stockForm = this.formBuilder.group({
      donation_id: [null, [Validators.required, () => this.validateDonationID()]],
      total_weight: [null, Validators.required],
      provider: [null, Validators.required],
      destination: [null, Validators.required],
      date: [null, Validators.required],
      delivered_by: [null, Validators.required],
      products: this.formBuilder.array([])
    });
  }
}
