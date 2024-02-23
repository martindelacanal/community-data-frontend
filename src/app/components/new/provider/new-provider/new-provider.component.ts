import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { NewProvider } from 'src/app/models/new/new-provider';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-provider',
  templateUrl: './new-provider.component.html',
  styleUrls: ['./new-provider.component.scss']
})
export class NewProviderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public providerForm: FormGroup;
  public nameExists: boolean = false;
  public loadingNameExists: boolean = false;
  public idProvider: string = '';
  private providerGetted: NewProvider;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.providerGetted = {
      name: null
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
        this.idProvider = params['id'];
        this.loadingGet = true;
        this.getProvider();
      }
    });

    this.providerForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.providerForm.valid) {

      if (this.idProvider) {
        this.newService.updateProvider(this.idProvider, this.providerForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_provider_snack_provider_updated'));
            this.router.navigate(['/view/provider/' + this.idProvider]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_provider_snack_error_update'));
          }
        });
      } else {
        this.newService.newProvider(this.providerForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_provider_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_provider_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_provider_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.providerForm.reset();
    this.providerForm.get('name').setErrors(null);
    this.nameExists = false;
  }

  private getProvider() {
    this.loadingGetForm = true;
    this.newService.getProvider(this.idProvider).subscribe({
      next: (res) => {
        this.providerGetted = {
          name: res.name
        }

        this.providerForm.patchValue({
          name: res.name
        });

        // Actualizar la validez de los campos de formulario
        this.providerForm.get('name').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_provider_snack_get_error'));
      },
      complete: () => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idProvider && this.providerGetted.name === nombre) {
      this.nameExists = false;
      this.providerForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingNameExists = true;
      this.newService.getProviderExists(nombre).subscribe({
        next: (res) => {
          if (res) {
            this.nameExists = true;
          } else {
            this.nameExists = false;
          }
          this.providerForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
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
    if (!this.loadingGetForm) {
      this.loadingGet = false;
    }
  }

  private buildNewForm(): void {
    this.providerForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]]
    });
  }

}
