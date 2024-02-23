import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { NewEthnicity } from 'src/app/models/new/new-ethnicity';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-ethnicity',
  templateUrl: './new-ethnicity.component.html',
  styleUrls: ['./new-ethnicity.component.scss']
})
export class NewEthnicityComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public ethnicityForm: FormGroup;
  public nameExists: boolean = false;
  public idEthnicity: string = '';
  private ethnicityGetted: NewEthnicity;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.ethnicityGetted = {
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
        this.idEthnicity = params['id'];
        this.loadingGet = true;
        this.getEthnicity();
      }
    });

    this.ethnicityForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.ethnicityForm.valid) {

      if (this.idEthnicity) {
        this.newService.updateEthnicity(this.idEthnicity, this.ethnicityForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_ethnicity_snack_ethnicity_updated'));
            this.router.navigate(['/view/ethnicity/' + this.idEthnicity]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_ethnicity_snack_error_update'));
          }
        });
      } else {
        this.newService.newEthnicity(this.ethnicityForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_ethnicity_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_ethnicity_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_ethnicity_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.ethnicityForm.reset();
    this.ethnicityForm.get('name').setErrors(null);
    this.ethnicityForm.get('name_es').setErrors(null);
    this.nameExists = false;
  }

  private getEthnicity() {
    this.loadingGetForm = true;
    this.newService.getEthnicity(this.idEthnicity).subscribe({
      next: (res) => {
        this.ethnicityGetted = {
          name: res.name,
          name_es: res.name_es
        }

        this.ethnicityForm.patchValue({
          name: res.name,
          name_es: res.name_es
        });

        // Actualizar la validez de los campos de formulario
        this.ethnicityForm.get('name').updateValueAndValidity();
        this.ethnicityForm.get('name_es').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_ethnicity_snack_get_error'));
      },
      complete: () => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idEthnicity && this.ethnicityGetted.name === nombre) {
      this.nameExists = false;
      this.ethnicityForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.newService.getEthnicityExists(nombre).subscribe(
        (res) => {
          if (res) {
            this.nameExists = true;
          } else {
            this.nameExists = false;
          }
          this.ethnicityForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
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
    this.ethnicityForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
      name_es: [null, Validators.required],
    });
  }

}
