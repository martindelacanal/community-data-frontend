import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize } from 'rxjs';
import { NewDeliveredBy } from 'src/app/models/new/new-delivered-by';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-delivered-by',
  templateUrl: './new-delivered-by.component.html',
  styleUrls: ['./new-delivered-by.component.scss']
})
export class NewDeliveredByComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public deliveredByForm: FormGroup;
  public nameExists: boolean = false;
  public loadingNameExists: boolean = false;
  public idDeliveredBy: string = '';
  private deliveredByGetted: NewDeliveredBy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.deliveredByGetted = {
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
        this.idDeliveredBy = params['id'];
        this.loadingGet = true;
        this.getDeliveredBy();
      }
    });

    this.deliveredByForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameExists(res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.deliveredByForm.valid) {

      if (this.idDeliveredBy) {
        this.newService.updateDeliveredBy(this.idDeliveredBy, this.deliveredByForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_delivered_by_snack_delivered_by_updated'));
            this.router.navigate(['/view/delivered-by/' + this.idDeliveredBy]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_delivered_by_snack_error_update'));
          }
        });
      } else {
        this.newService.newDeliveredBy(this.deliveredByForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_delivered_by_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_delivered_by_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_delivered_by_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.deliveredByForm.reset();
    this.deliveredByForm.get('name').setErrors(null);
    this.nameExists = false;
  }

  private getDeliveredBy() {
    this.loadingGetForm = true;
    this.newService.getDeliveredBy(this.idDeliveredBy).pipe(
      finalize(() => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.deliveredByGetted = {
          name: res.name,
        }

        this.deliveredByForm.patchValue({
          name: res.name,
        });

        // Actualizar la validez de los campos de formulario
        this.deliveredByForm.get('name').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_delivered_by_snack_get_error'));
      }
    });
  }

  private updateNameExists(nombre: string) {
    if (this.idDeliveredBy && this.deliveredByGetted.name === nombre) {
      this.nameExists = false;
      this.deliveredByForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingNameExists = true;
      this.newService.getDeliveredByExists(nombre).pipe(
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
          this.deliveredByForm.get('name').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
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
    this.deliveredByForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
    });
  }

}
