import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize } from 'rxjs';
import { NewTransportedBy } from 'src/app/models/new/new-transported-by';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-transported-by',
  templateUrl: './new-transported-by.component.html',
  styleUrls: ['./new-transported-by.component.scss']
})
export class NewTransportedByComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public transportedByForm: FormGroup;
  public nameExists: boolean = false;
  public loadingNameExists: boolean = false;
  public idTransportedBy: string = '';
  private transportedByGetted: NewTransportedBy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.transportedByGetted = {
      name: null,
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
        this.idTransportedBy = params['id'];
        this.loadingGet = true;
        this.getTransportedBy();
      }
    });

    this.transportedByForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.transportedByForm.valid) {

      if (this.idTransportedBy) {
        this.newService.updateTransportedBy(this.idTransportedBy, this.transportedByForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_transported_by_snack_transported_by_updated'));
            this.router.navigate(['/view/transported-by/' + this.idTransportedBy]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_transported_by_snack_error_update'));
          }
        });
      } else {
        this.newService.newTransportedBy(this.transportedByForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_transported_by_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_transported_by_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_transported_by_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.transportedByForm.reset();
    this.transportedByForm.get('name').setErrors(null);
    this.nameExists = false;
  }

  private getTransportedBy() {
    this.loadingGetForm = true;
    this.newService.getTransportedBy(this.idTransportedBy).pipe(
      finalize(() => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.transportedByGetted = {
          name: res.name,
        }

        this.transportedByForm.patchValue({
          name: res.name,
        });

        // Actualizar la validez de los campos de formulario
        this.transportedByForm.get('name').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_transported_by_snack_get_error'));
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idTransportedBy && this.transportedByGetted.name === nombre) {
      this.nameExists = false;
      this.transportedByForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingNameExists = true;
      this.newService.getTransportedByExists(nombre).pipe(
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
          this.transportedByForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
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
    this.transportedByForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
    });
  }

}
