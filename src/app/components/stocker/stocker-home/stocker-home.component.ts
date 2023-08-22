import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map, of, startWith } from 'rxjs';
import { Location } from 'src/app/models/mapa/location';
import { Product } from 'src/app/models/stocker/product';
import { StockerService } from 'src/app/services/stock/stocker.service';

@Component({
  selector: 'app-stocker-home',
  templateUrl: './stocker-home.component.html',
  styleUrls: ['./stocker-home.component.scss']
})
export class StockerHomeComponent implements OnInit {

  public stockForm: FormGroup;
  public isValidFiles: boolean = true;
  public imageTicketUploaded: boolean = false;
  private file_ticket: any;
  locations: Location[] = [];
  products: Product[] = [];
  productNames: string[] = [];
  filteredOptions: Observable<string[]>;
  inputIndexModified: number;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private stockerService: StockerService
  ) {
    this.file_ticket = [];
    this.buildStockForm();
  }

  ngOnInit(): void {
    this.getLocations();
    this.getProducts();
    this.filteredOptions = this.stockForm.get('products').valueChanges.pipe(
      startWith(''),
      map(value => this.filterProducts(value))
    );
  }

  onSubmit() {
    console.log("form: ", this.stockForm.value);
    console.log("imageTicketUploaded: ", this.imageTicketUploaded);
    if (this.imageTicketUploaded === true) {
      this.isValidFiles = true;
    } else {
      this.isValidFiles = false;
    }
    if (this.stockForm.valid && this.isValidFiles) {
      // this.loading = true;
      this.stockForm.value.date = new Date(this.stockForm.value.date).toISOString().slice(0, 19).replace('T', ' ');
      // si se usó un producto creado, se guarda el id, si es nuevo se guarda el texto
      for (let i = 0; i < this.productsForm.controls.length; i++) {
        const control = this.productsForm.controls[i];
        const productName = control.get('product').value;
        const product = this.products.find(p => p.name === productName);
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
      console.log("Form: ", this.stockForm.value);
      console.log("Body: ", body);
      this.stockerService.uploadTicket(body).subscribe(
        (res: any) => {
          console.log(res);
          this.openSnackBar('Ticket uploaded successfully');
          this.resetearFormulario();
        },
        (err: any) => {
          console.log(err);
          this.openSnackBar('Error uploading ticket');
        }
      );
    } else {
      this.openSnackBar('Please fill the form correctly');
    }
  }

  onInputFocus(index: number): void {
    this.inputIndexModified = index;
  }

  uploadFile($event) {
    const files = $event.target.files;
    if (files.length === 0) {
      console.log('No file selected');
      this.imageTicketUploaded = false;
      return;
    }
    if (files.length > 2) {
      alert('You can only upload a maximum of 2 files');
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
    console.log(this.stockForm.value);
  }

  agregarCampo() {
    this.productsForm.push(this.formBuilder.group({
      product: [null],
      quantity: [null]
    }));
  }
  quitarCampo() {
    this.productsForm.removeAt(this.productsForm.length - 1);
  }
  quitarCampoParticular(index: number): void {
    this.productsForm.removeAt(index);
  }
  get productsForm() {
    return this.stockForm.get('products') as FormArray;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close');
  }

  private resetearFormulario() {
    this.router.navigate(['stocker/home']);
  }

  private filterProducts(value: any): string[] {
    console.log("value: ", value);
    var valueString = '';
    if (typeof value === 'object') {
      valueString = value[this.inputIndexModified].product;
    } else {
      if (typeof value === 'string') {
        valueString = value;
      }
    }
    if (valueString === '') {
      console.log("valueString: ", valueString);
      return this.productNames;
    } else {
      const filterValue = typeof valueString === 'string' ? valueString.toLowerCase() : '';
      return this.productNames.filter(option => option.toLowerCase().includes(filterValue));
    }
  }

  private getLocations() {
    this.stockerService.getLocations().subscribe(
      (res) => {
        this.locations = res;
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
      customer: [null, Validators.required],
      destination: [null, Validators.required],
      address: [null, Validators.required],
      date: [null, Validators.required],
      delivered_by: [null, Validators.required],
      products: this.formBuilder.array([])
    });
  }
}
