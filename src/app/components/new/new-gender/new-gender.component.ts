import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize } from 'rxjs';
import { NewGender } from 'src/app/models/new/new-gender';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-gender',
  templateUrl: './new-gender.component.html',
  styleUrls: ['./new-gender.component.scss']
})
export class NewGenderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public genderForm: FormGroup;
  public nameExists: boolean = false;
  public loadingNameExists: boolean = false;
  public idGender: string = '';
  private genderGetted: NewGender;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.genderGetted = {
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
        this.idGender = params['id'];
        this.loadingGet = true;
        this.getGender();
      }
    });

    this.genderForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.genderForm.valid) {

      if (this.idGender) {
        this.newService.updateGender(this.idGender, this.genderForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_gender_snack_gender_updated'));
            this.router.navigate(['/view/gender/' + this.idGender]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_gender_snack_error_update'));
          }
        });
      } else {
        this.newService.newGender(this.genderForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_gender_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_gender_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_gender_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.genderForm.reset();
    this.genderForm.get('name').setErrors(null);
    this.genderForm.get('name_es').setErrors(null);
    this.nameExists = false;
  }

  private getGender() {
    this.loadingGetForm = true;
    this.newService.getGender(this.idGender).pipe(
      finalize(() => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.genderGetted = {
          name: res.name,
          name_es: res.name_es
        }

        this.genderForm.patchValue({
          name: res.name,
          name_es: res.name_es
        });

        // Actualizar la validez de los campos de formulario
        this.genderForm.get('name').updateValueAndValidity();
        this.genderForm.get('name_es').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_gender_snack_get_error'));
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idGender && this.genderGetted.name === nombre) {
      this.nameExists = false;
      this.genderForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingNameExists = true;
      this.newService.getGenderExists(nombre).pipe(
        finalize(() => {
          this.loadingNameExists = false;
        })
      ).subscribe({
        next: (res) => {
          if (res) {
            this.nameExists = true;
          } else {
            this.nameExists = false;
          }
          this.genderForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
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
    this.genderForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
      name_es: [null, Validators.required],
    });
  }

}
