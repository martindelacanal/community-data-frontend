import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { Location } from 'src/app/models/map/location';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerRegisterLocationComponent } from '../../dialog/disclaimer-register-location/disclaimer-register-location.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-beneficiary-home',
  templateUrl: './beneficiary-home.component.html',
  styleUrls: ['./beneficiary-home.component.scss']
})
export class BeneficiaryHomeComponent implements OnInit {

  title = 'app';
  elementType = 'url';
  value: string = null;
  errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  objeto: beneficiaryQR;
  locations: Location[] = [];
  public beneficiaryForm: FormGroup;
  public loading: boolean = false;
  public onBoarded: boolean = false;
  private remoteLocation: boolean = false;
  public userLocation: Location;
  public locationOrganizationSelected: string = '';
  public locationAddressSelected: string = '';

  constructor(
    private decodificadorService: DecodificadorService,
    private deliveryService: DeliveryService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.buildBeneficiaryForm();

    this.objeto = {
      id: this.decodificadorService.getId(),
      role: this.decodificadorService.getRol(),
      date: new Date().toLocaleString(),
      location_id: 0,
      approved: 'N'
    };
    this.value = JSON.stringify(this.objeto);
  }

  ngOnInit(): void {
    this.getLocations();
    this.getUserStatus();
    this.getUserLocation();

    this.beneficiaryForm.get('destination').valueChanges.subscribe(
      (res) => {
        if (res) {
          if (this.remoteLocation) {
            this.remoteLocation = false;
          } else {
            const location = this.locations.find(l => l.id === res);
            if (location) {
              this.locationOrganizationSelected = location.organization;
              this.locationAddressSelected = location.address;
              this.disclaimerLocation(location.organization, location.address);
            }
          }
        }
      }
    );
  }

  newQR() {
    this.objeto = {
      id: this.decodificadorService.getId(),
      role: this.decodificadorService.getRol(),
      date: new Date().toLocaleString(),
      location_id: this.beneficiaryForm.value.destination,
      approved: 'N'
    };
    this.value = JSON.stringify(this.objeto);
  }


  onBoard() {
    this.loading = true;
    if (!this.onBoarded) {
      this.onBoarded = true;
      this.deliveryService.onBoard(true, this.beneficiaryForm.value.destination).pipe(
        finalize(() => {
          this.newQR();
        })
      ).subscribe({
        next: (res) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.userLocation = this.locations.find(location => location.id === this.beneficiaryForm.value.destination);
          this.locationAddressSelected = this.userLocation.address;
          this.locationOrganizationSelected = this.userLocation.organization;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded'));
        },
        error: (error) => {
          console.log(error);
          this.onBoarded = false;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded_error'));
        }
      });
    } else {
      this.onBoarded = false;
      this.deliveryService.onBoard(false, this.beneficiaryForm.value.destination).pipe(
        finalize(() => {
          this.newQR();
        })
      ).subscribe({
        next: (res) => {
          console.log(res);
          this.userLocation = null;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_off_boarded'));
        },
        error: (error) => {
          console.log(error);
          this.onBoarded = true;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_off_boarded_error'));
        }
      });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getLocations() {
    this.deliveryService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
  }

  private getUserStatus() {
    this.loading = true;
    this.deliveryService.getUserStatus().subscribe(
      (res) => {
        if (res.id === 3) {
          this.onBoarded = true;
        } else {
          this.onBoarded = false;
        }
        this.loading = false;
      }
    );
  }

  private getUserLocation() {
    this.deliveryService.getUserLocation().subscribe(
      (res) => {
        this.userLocation = res;
        if (res.id !== null) {
          this.locationAddressSelected = this.userLocation.address;
          this.locationOrganizationSelected = this.userLocation.organization;
          this.remoteLocation = true;
          this.beneficiaryForm.patchValue({
            destination: res.id
          });
          this.newQR();
        }
      }
    );
  }

  private disclaimerLocation(organization: string, address: string): void {
    const dialogRef = this.dialog.open(DisclaimerRegisterLocationComponent, {
      width: '370px',
      data: {
        organization: organization,
        address: address
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.status) {
        // reset destination
        this.beneficiaryForm.get('destination').setValue(null);
        this.locationOrganizationSelected = '';
        this.locationAddressSelected = '';
      }
      this.newQR();
    });
  }

  private buildBeneficiaryForm(): void {
    this.beneficiaryForm = this.formBuilder.group({
      destination: [null, Validators.required]
    });
  }
}
