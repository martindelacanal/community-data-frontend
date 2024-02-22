import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { NewProductType } from 'src/app/models/new/new-product-type';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-product-type',
  templateUrl: './new-product-type.component.html',
  styleUrls: ['./new-product-type.component.scss']
})
export class NewProductTypeComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public productTypeForm: FormGroup;
  public nameExists: boolean = false;
  public idProductType: string = '';
  private productTypeGetted: NewProductType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.productTypeGetted = {
      name: null,
      name_es: null
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
        this.idProductType = params['id'];
        this.loadingGet = true;
        this.getProductType();
      }
    });

    this.productTypeForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.productTypeForm.valid) {

      if (this.idProductType) {
        this.newService.updateProductType(this.idProductType, this.productTypeForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_product_type_snack_product_type_updated'));
            this.router.navigate(['/view/product-type/' + this.idProductType]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_product_type_snack_error_update'));
          }
        });
      } else {
        this.newService.newProductType(this.productTypeForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_product_type_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_product_type_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_product_type_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.productTypeForm.reset();
    this.productTypeForm.get('name').setErrors(null);
    this.productTypeForm.get('name_es').setErrors(null);
    this.nameExists = false;
  }

  private getProductType() {
    this.loadingGetForm = true;
    this.newService.getProductType(this.idProductType).subscribe({
      next: (res) => {
        this.productTypeGetted = {
          name: res.name,
          name_es: res.name_es
        }

        this.productTypeForm.patchValue({
          name: res.name,
          name_es: res.name_es
        });

        // Actualizar la validez de los campos de formulario
        this.productTypeForm.get('name').updateValueAndValidity();
        this.productTypeForm.get('name_es').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_product_type_snack_get_error'));
      },
      complete: () => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idProductType && this.productTypeGetted.name === nombre) {
      this.nameExists = false;
      this.productTypeForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.newService.getProductTypeExists(nombre).subscribe(
        (res) => {
          if (res) {
            this.nameExists = true;
          } else {
            this.nameExists = false;
          }
          this.productTypeForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        }
      );
    }
  }

  private validateName(): ValidationErrors | null {
    if (this.nameExists) {
      return { 'invalidName': true };
    }
    return null;
  }

  private checkLoadingGet() {
    if (!this.loadingGetForm) {
      this.loadingGet = false;
    }
  }

  private buildNewForm(): void {
    this.productTypeForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
      name_es: [null, Validators.required],
    });
  }

}
