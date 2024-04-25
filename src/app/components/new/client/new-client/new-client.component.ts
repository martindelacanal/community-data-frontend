import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize } from 'rxjs';
import { Location } from 'src/app/models/map/location';
import { NewClient } from 'src/app/models/new/new-client';
import { NewService } from 'src/app/services/new/new.service';
import { StockerService } from 'src/app/services/stock/stocker.service';

@Component({
  selector: 'app-new-client',
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss']
})
export class NewClientComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = false;
  public loadingGetForm: boolean = false;
  public loadingGetLocations: boolean = false;
  public clientForm: FormGroup;
  public nameExists: boolean = false;
  public short_nameExists: boolean = false;
  public loadingNameShortNameExists: boolean = false;
  public idClient: string = '';
  public locations: Location[] = [];
  private clientGetted: NewClient;

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
    this.clientGetted = {
      name: null,
      short_name: null,
      email: null,
      phone: null,
      address: null,
      webpage: null,
      location_ids: null
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

    this.getLocations();

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.idClient = params['id'];
        this.loadingGet = true;
        this.getClient();
      }
    });

    this.clientForm.get('name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameShortNameExists(res, null);
        }
      );

    this.clientForm.get('short_name').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateNameShortNameExists(null, res);
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.clientForm.valid) {

      if (this.idClient) {
        this.newService.updateClient(this.idClient, this.clientForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_client_snack_client_updated'));
            this.router.navigate(['/view/client/' + this.idClient]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_client_snack_error_update'));
          }
        });
      } else {
        this.newService.newClient(this.clientForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('new_client_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_client_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_client_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.clientForm.reset();
    this.clientForm.get('name').setErrors(null);
    this.clientForm.get('short_name').setErrors(null);
    this.nameExists = false;
    this.short_nameExists = false;
  }

  private getClient() {
    this.loadingGetForm = true;
    this.newService.getClient(this.idClient).pipe(
      finalize(() => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.clientGetted = {
          name: res.name,
          short_name: res.short_name,
          email: res.email,
          phone: res.phone,
          address: res.address,
          webpage: res.webpage,
          location_ids: res.location_ids
        }

        this.clientForm.patchValue({
          name: res.name,
          short_name: res.short_name,
          email: res.email,
          phone: res.phone,
          address: res.address,
          webpage: res.webpage,
          location_ids: res.location_ids
        });

        // Actualizar la validez de los campos de formulario
        this.clientForm.get('name').updateValueAndValidity();
        this.clientForm.get('short_name').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_client_snack_get_error'));
      }
    });
  }

  private getLocations() {
    this.loadingGetLocations = true;
    this.stockerService.getLocations().pipe(
      finalize(() => {
        this.loadingGetLocations = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.locations = res;
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('new_client_input_location_ids_error_get'));
      }
    });
  }

  private updateNameShortNameExists(name: string, short_name: string) {
    let fieldToCheck = name ? 'name' : 'short_name';
    let valueToCheck = name || short_name;

    if (this.idClient && this.clientGetted[fieldToCheck] === valueToCheck) {
      this[fieldToCheck + 'Exists'] = false;
      this.clientForm.get(fieldToCheck).updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingNameShortNameExists = true;
      this.newService.getClientExists(name, short_name).pipe(
        finalize(() => {
          this.loadingNameShortNameExists = false;
        })
      ).subscribe({
        next: (res) => {
          if (res[fieldToCheck]) {
            this[fieldToCheck + 'Exists'] = true;
          } else {
            this[fieldToCheck + 'Exists'] = false;
          }
          this.clientForm.get(fieldToCheck).updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
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

  private validateShortName(): ValidationErrors | null {
    if (this.short_nameExists) {
      return { 'invalidShortName': true };
    }
    return null;
  }

  private checkLoadingGet() {
    if (!this.loadingGetForm && !this.loadingGetLocations) {
      this.loadingGet = false;
    }
  }

  private buildNewForm(): void {
    this.clientForm = this.formBuilder.group({
      name: [null, [Validators.required, () => this.validateName()]],
      short_name: [null, [Validators.required, () => this.validateShortName()]],
      email: [null],
      phone: [null],
      address: [null],
      webpage: [null],
      location_ids: [null]
    });
  }

}
