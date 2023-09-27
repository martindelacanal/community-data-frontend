import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map, of, startWith } from 'rxjs';
import { Location } from 'src/app/models/map/location';
import { Product } from 'src/app/models/stocker/product';
import { Provider } from 'src/app/models/stocker/provider';
import { StockerService } from 'src/app/services/stock/stocker.service';

@Component({
  selector: 'app-stocker-home',
  templateUrl: './stocker-home.component.html',
  styleUrls: ['./stocker-home.component.scss']
})
export class StockerHomeComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
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
  locations: Location[] = [];
  products: Product[] = [];
  providers: Provider[] = [];
  providerNames: string[] = [];
  productNames: string[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsProvider: Observable<string[]>;
  inputIndexModified: number;
  numberOfFields: number;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private stockerService: StockerService,
    public translate: TranslateService
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

    this.getLocations();
    this.getProviders();
    this.getProducts();
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
  }

  onSubmit() {
    this.loading = true;
    console.log("form: ", this.stockForm.value);
    console.log("imageTicketUploaded: ", this.imageTicketUploaded);
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
      console.log("Form enviado: ", this.stockForm.value);
      console.log("Body enviado: ", body);
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
          alert(`Please send to administrator: ${error.message} - ${error.error}`);
          this.openSnackBar(this.translate.instant('stocker_snack_ticket_uploaded_error'));
        }
      });
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

  onNumberOfFieldsChange() {
    console.log('El nuevo número de campos es:', this.numberOfFields);
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
  }
  get productsForm() {
    return this.stockForm.get('products') as FormArray;
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.router.navigate(['stocker/home']);
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
    this.stockerService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
  }

  private getProviders() {
    this.stockerService.getProviders().subscribe(
      (res) => {
        this.providers = res;
        // iterate providers and push name into providerNames
        for (let i = 0; i < this.providers.length; i++) {
          this.providerNames.push(this.providers[i].name);
        }
      }
    );
  }

  private getProducts() {
    this.stockerService.getProducts().subscribe(
      (res) => {
        this.products = res;
        // iterate products and push name into productNames
        for (let i = 0; i < this.products.length; i++) {
          this.productNames.push(this.products[i].name);
        }
      }
    );
  }

  private buildStockForm(): void {
    this.stockForm = this.formBuilder.group({
      donation_id: [null, Validators.required],
      total_weight: [null, Validators.required],
      provider: [null, Validators.required],
      destination: [null, Validators.required],
      date: [null, Validators.required],
      delivered_by: [null, Validators.required],
      products: this.formBuilder.array([])
    });
  }
}
