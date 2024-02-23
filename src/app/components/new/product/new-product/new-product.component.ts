import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { NewProduct } from 'src/app/models/new/new-product';
import { ProductType } from 'src/app/models/stocker/product-type';
import { NewService } from 'src/app/services/new/new.service';
import { StockerService } from 'src/app/services/stock/stocker.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = true;
  public loadingGetForm: boolean = false;
  public loadingProductTypes: boolean = false;
  public productForm: FormGroup;
  public nameExists: boolean = false;
  public loadingNameExists: boolean = false;
  public product_types: ProductType[] = [];
  public idProduct: string = '';
  private productGetted: NewProduct;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    private stockerService: StockerService,
    public translate: TranslateService
  ) {
    this.productGetted = {
      name: null,
      product_type_id: null,
      value_usd: null
    }
    this.buildNewForm();
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

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.idProduct = params['id'];
        this.getProduct();
      }
    });

    this.getProductTypes(this.translate.currentLang);

    this.productForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.productForm.valid) {

      if (this.idProduct) {
        this.newService.updateProduct(this.idProduct, this.productForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_product_snack_product_updated'));
            this.router.navigate(['/view/product/' + this.idProduct]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_product_snack_error_update'));
          }
        });
      } else {
        this.newService.newProduct(this.productForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_product_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_product_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_product_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.productForm.reset();
    this.productForm.get('name').setErrors(null);
    this.productForm.get('product_type_id').setErrors(null);
    this.nameExists = false;
  }

  private getProduct() {
    this.loadingGetForm = true;
    this.newService.getProduct(this.idProduct).subscribe({
      next: (res) => {
        this.productGetted = {
          name: res.name,
          product_type_id: res.product_type_id,
          value_usd: res.value_usd
        }

        this.productForm.patchValue({
          name: res.name,
          product_type_id: res.product_type_id,
          value_usd: res.value_usd
        });

        // Actualizar la validez de los campos de formulario
        this.productForm.get('name').updateValueAndValidity();
        this.productForm.get('product_type_id').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_product_snack_get_error'));
      },
      complete: () => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      }
    });
  }

  private getProductTypes(language: string, id?: number) {
    this.loadingProductTypes = true;
    this.stockerService.getProductTypes(language, id).subscribe({
      next: (res) => {
        this.product_types = res;
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('table_product_types_snack_error_get'));
      },
      complete: () => {
        this.loadingProductTypes = false;
        this.checkLoadingGet();
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idProduct && this.productGetted.name === nombre) {
      this.nameExists = false;
      this.productForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingNameExists = true;
      this.newService.getProductExists(nombre).subscribe({
        next: (res) => {
          if (res) {
            this.nameExists = true;
          } else {
            this.nameExists = false;
          }
          this.productForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.loadingNameExists = false;
        }
    });
    }
  }

  private validateName(): ValidationErrors | null {
    if (this.nameExists) {
      return { 'invalidName': true };
    }
    return null;
  }

  private checkLoadingGet() {
    if (!this.loadingGetForm && !this.loadingProductTypes) {
      this.loadingGet = false;
    }
  }

  private buildNewForm(): void {
    this.productForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
      product_type_id: [null, Validators.required],
      value_usd: [null],
    });
  }

}
