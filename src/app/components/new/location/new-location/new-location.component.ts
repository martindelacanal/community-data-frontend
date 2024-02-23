import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { LocationMap } from 'src/app/models/map/location-map';
import { NewLocation } from 'src/app/models/new/new-location';
import { Client } from 'src/app/models/user/client';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.scss']
})
export class NewLocationComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = true;
  public loadingGetForm: boolean = false;
  public loadingGetClients: boolean = false;
  public locationForm: FormGroup;
  public communityCityExists: boolean = false;
  public loadingCommunityCityExists: boolean = false;
  public clients: Client[] = [];
  public idLocation: string = '';
  public locationMapPoint: LocationMap = { center: { lat: 0, lng: 0 }, locations: [] };
  private locationGetted: NewLocation;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.locationGetted = {
      organization: null,
      community_city: null,
      client_ids: [],
      address: null,
      coordinates: null
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
        this.idLocation = params['id'];
        this.getLocation();
      }
    });

    this.getClients();

    this.locationForm.get('community_city').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateCommunityCityExists(res);
        }
      );

    this.locationForm.get('coordinates').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          if (res) {
            let coordinates = res.split(',');
            if (coordinates.length === 2) {
              let lat = parseFloat(coordinates[0]);
              let lng = parseFloat(coordinates[1]);
              if (!isNaN(lat) && !isNaN(lng)) {
                this.locationMapPoint = {
                  center: { lat: lat, lng: lng },
                  locations: [{ position: { lat: lat, lng: lng }, label: '' }]
                }
              } else {
                this.locationMapPoint = { center: { lat: 0, lng: 0 }, locations: [] };
              }
            } else {
              this.locationMapPoint = { center: { lat: 0, lng: 0 }, locations: [] };
            }
          }
        }
      );

  }

  onSubmit() {
    this.loading = true;
    if (this.locationForm.valid) {
      if (this.idLocation) {
        this.newService.updateLocation(this.idLocation, this.locationForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_location_snack_location_updated'));
            this.router.navigate(['/view/location/' + this.idLocation]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_location_snack_error_update'));
          }
        });
      } else {
        this.newService.newLocation(this.locationForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_location_snack_created'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('new_location_snack_error'));
          }
        });
      }
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_location_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.locationForm.reset();
    this.locationForm.get('organization').setErrors(null);
    this.locationForm.get('community_city').setErrors(null);
    this.locationForm.get('address').setErrors(null);
    this.locationForm.get('coordinates').setErrors(null);
    this.communityCityExists = false;
    this.locationMapPoint = { center: { lat: 0, lng: 0 }, locations: [] };
  }

  private getLocation() {
    this.loadingGetForm = true;
    this.newService.getLocation(this.idLocation).subscribe({
      next: (res) => {
        this.locationGetted = {
          organization: res.organization,
          community_city: res.community_city,
          client_ids: res.client_ids,
          address: res.address,
          coordinates: res.coordinates
        }

        this.locationForm.patchValue({
          organization: res.organization,
          community_city: res.community_city,
          client_ids: res.client_ids,
          address: res.address,
          coordinates: res.coordinates
        });

        // Actualizar la validez de los campos de formulario
        this.locationForm.get('organization').updateValueAndValidity();
        this.locationForm.get('community_city').updateValueAndValidity();
        this.locationForm.get('address').updateValueAndValidity();
        this.locationForm.get('coordinates').updateValueAndValidity();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_location_snack_get_error'));
      },
      complete: () => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      }
    });
  }

  private getClients() {
    this.loadingGetClients = true;
    this.newService.getClients().subscribe({
      next: (res) => {
        this.clients = res;
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('new_user_input_client_error_get'));
      },
      complete: () => {
        this.loadingGetClients = false;
        this.checkLoadingGet();
      }
    });
  }

  private updateCommunityCityExists(community_city: string) {
    if (this.idLocation && this.locationGetted.community_city === community_city) {
      this.communityCityExists = false;
      this.locationForm.get('community_city').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingCommunityCityExists = true;
      this.newService.getLocationExists(community_city).subscribe({
        next: (res) => {
          if (res) {
            this.communityCityExists = true;
          } else {
            this.communityCityExists = false;
          }
          this.locationForm.get('community_city').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.loadingCommunityCityExists = false;
        }
    });
    }
  }

  private validateCommunityCity(): ValidationErrors | null {
    if (this.communityCityExists) {
      return { 'invalidCommunityCity': true };
    }
    return null;
  }

  private checkLoadingGet() {
    if (!this.loadingGetForm && !this.loadingGetClients) {
      this.loadingGet = false;
    }
  }

  private buildNewForm(): void {
    this.locationForm = this.formBuilder.group({
      organization: [null, Validators.required],
      community_city: [null, [Validators.required, () => this.validateCommunityCity()]],
      client_ids: [null],
      address: [null, Validators.required],
      coordinates: [null, [Validators.required, Validators.pattern(/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/)]]
    });
  }

}
