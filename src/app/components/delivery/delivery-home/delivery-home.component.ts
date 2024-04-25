import { Component, ViewChild, OnInit, AfterViewChecked } from '@angular/core';
import { Observable, finalize, forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { Location } from 'src/app/models/map/location';
import { Client } from 'src/app/models/user/client';
import { UserStatus } from 'src/app/models/user/user-status';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { NewService } from 'src/app/services/new/new.service';


@Component({
  selector: 'app-delivery-home',
  templateUrl: './delivery-home.component.html',
  styleUrls: ['./delivery-home.component.scss'],
})
export class DeliveryHomeComponent implements OnInit, AfterViewChecked {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  public loading: boolean = false;
  public deliveryForm: FormGroup;
  scanActive: boolean = false;
  infoValid: boolean = false;
  onBoarded: boolean = false;
  isBeneficiaryLocationError: boolean = false;
  isReceivingUserErrorNull: boolean = false;
  isReceivingLocationErrorNull: boolean = false;
  objeto: beneficiaryQR;
  locations: Location[] = [];
  clients: Client[] = [];
  clientsFiltered: Client[] = [];
  userStatus: UserStatus;
  userLocation: Location;
  public locationOrganizationSelected: string = '';
  public locationAddressSelected: string = '';

  constructor(
    private deliveryService: DeliveryService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private newService: NewService,
    public translate: TranslateService
  ) {
    this.buildDeliveryForm();
  }

  ngOnInit(): void {
    forkJoin([this.getLocations(), this.getClients(), this.getUserStatus()])
      .subscribe(() => {
        this.getUserLocation();
      });

    // set locationOrganizationSelected and locationAddressSelected when location changes
    this.deliveryForm.get('destination').valueChanges.subscribe(
      (res) => {
        const location = this.locations.find(l => l.id === res);
        if (location) {
          this.locationOrganizationSelected = location.organization;
          this.locationAddressSelected = location.address;
          this.clientsFiltered = this.clients.filter(client => client.location_ids.includes(res));
          if (this.clientsFiltered.length > 0) {
            this.deliveryForm.get('client_id').setValidators([Validators.required]);
          } else {
            this.deliveryForm.get('client_id').setValidators([]);
            this.deliveryForm.get('client_id').setValue(null); // Limpia el campo client_id
          }
          this.deliveryForm.get('client_id').markAsTouched();
          this.deliveryForm.get('client_id').updateValueAndValidity();
        } else {
          this.locationOrganizationSelected = '';
          this.locationAddressSelected = '';
          this.clientsFiltered = [];
          this.deliveryForm.get('client_id').setValidators([]);
          this.deliveryForm.get('client_id').setValue(null); // Limpia el campo client_id
          this.deliveryForm.get('client_id').updateValueAndValidity();
        }
      }
    );
  }

  ngAfterViewChecked(): void {
    // para iphone
    if (this.scanActive && this.qrScannerComponent.videoElement) {
      // console.log(this.qrScannerComponent.videoElement.getAttribute('playsinline'));
      this.qrScannerComponent.videoElement.setAttribute('playsinline', 'true');
    }
  }

  scanQR() {
    this.scanActive = true;
    setTimeout(() => {
      // this.qrScannerComponent.getMediaDevices().then(devices => {
      // navigator.mediaDevices.enumerateDevices().then(devices => {
      //   const videoDevices: MediaDeviceInfo[] = [];
      //   for (const device of devices) {
      //     if (device.kind.toString() === 'videoinput') {
      //       videoDevices.push(device);
      //     }
      //   }
      //   if (videoDevices.length > 0) {
      //     let choosenDev;
      //     for (const dev of videoDevices) {
      //       if (dev.label.includes('back')) {
      //         choosenDev = dev;
      //         break;
      //       }
      //     }
      //     if (choosenDev) {
      //       this.qrScannerComponent.chooseCamera.next(choosenDev);
      //     } else {
      //       this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
      //     }
      //   }
      // });
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          const track = stream.getVideoTracks()[0];
          const deviceId = track.getSettings().deviceId;

          navigator.mediaDevices.enumerateDevices().then(devices => {
            const device = devices.find(device => device.deviceId === deviceId);
            if (device) {
              this.qrScannerComponent.chooseCamera.next(device);
            }
          });
        })
        .catch(err => {
          console.error('Error al acceder a la cámara trasera', err);
        });

      this.qrScannerComponent.capturedQr.subscribe(result => {
        console.log(result);
        this.scanActive = false;
        try {
          if (!this.loading) {
            this.loading = true;
            this.objeto = JSON.parse(result);
            this.deliveryService.uploadTicket(this.objeto, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).subscribe({
              next: (res) => {
                if (res.error) {
                  switch (res.error) {
                    case 'receiving_location':
                      this.isBeneficiaryLocationError = true; // beneficiario eligio mal la locacion
                      break;
                    case 'receiving_user_null':
                      this.isReceivingUserErrorNull = true; // no se pudo leer id de beneficiario
                      break;
                    case 'receiving_location_null':
                      this.isReceivingLocationErrorNull = true; // no se pudo leer id de la locacion del beneficiario
                      break;
                    default:
                      this.openSnackBar(this.translate.instant('delivery_snack_upload_qr_error'));
                      break;
                  }

                  this.infoValid = false;
                } else {
                  if (res.could_approve === 'Y') {
                    this.infoValid = true;
                  } else {
                    this.infoValid = false;
                  }
                }
                this.loading = false;
              },
              error: (error) => {
                console.log(error);
                this.openSnackBar(this.translate.instant('delivery_snack_upload_qr_error'));
                this.infoValid = false;
                this.loading = false;
              }
            });
          }
        } catch (error) {
          console.error(error);
          this.infoValid = false;
          this.loading = false;
        }
      });
    }, 0);
  }

  onBoard() {
    this.loading = true;
    if (!this.onBoarded) {
      this.deliveryService.onBoard(true, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).pipe(
        finalize(() => {
          this.clientsFiltered = this.clients.filter(client => client.location_ids.includes(this.deliveryForm.value.destination));
        })
      ).subscribe({
        next: (res) => {
          console.log(res);
          // actualizar token con res.token en el local storage
          localStorage.setItem('token', res.token);
          this.userLocation = this.locations.find(location => location.id === this.deliveryForm.value.destination);
          this.onBoarded = true;
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
      this.deliveryService.onBoard(false, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).pipe(
        finalize(() => {
          this.clientsFiltered = this.clients.filter(client => client.location_ids.includes(this.deliveryForm.value.destination));
        })
      ).subscribe({
        next: (res) => {
          console.log(res);
          this.deliveryForm.get('client_id').setValue(null); // Limpia el campo client_id
          this.userLocation = null;
          this.onBoarded = false;
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

  onSubmit() {
    if (this.infoValid && this.deliveryForm.valid) {
      this.loading = true;
      // cambiar el approved del objeto
      this.objeto.approved = 'Y';
      this.deliveryService.uploadTicket(this.objeto, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_delivery_approved'));
          this.infoValid = false;
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_delivery_approved_error'));
        }
      });

    } else {
      this.openSnackBar(this.translate.instant('delivery_snack_scan_valid_error'));
    }
  }

  onCancel() {
    this.infoValid = false;
    this.scanActive = false;
    this.isBeneficiaryLocationError = false;
    this.isReceivingUserErrorNull = false;
    this.isReceivingLocationErrorNull = false;
    if (this.qrScannerComponent) {
      this.qrScannerComponent.stopScanning();
      this.qrScannerComponent.capturedQr.unsubscribe();
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private getClients(): Observable<any> {
    return new Observable(observer => {
      this.newService.getClients().subscribe({
        next: (res) => {
          this.clients = res;
          observer.next(res);
          observer.complete();
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar(this.translate.instant('new_user_input_client_error_get'));
          observer.error(error);
        }
      });
    });
  }

  private getLocations(): Observable<any> {
    return new Observable(observer => {
      this.deliveryService.getLocations().subscribe({
        next: (res) => {
          this.locations = res;
          observer.next(res);
          observer.complete();
        },
        error: (error) => {
          console.error(error);
          observer.error(error);
        }
      });
    });
  }

  private getUserStatus(): Observable<any> {
    return new Observable(observer => {
      this.deliveryService.getUserStatus().subscribe({
        next: (res) => {
          this.userStatus = res;
          if (this.userStatus.id === 3) {
            this.onBoarded = true;
          } else {
            this.onBoarded = false;
          }
          this.deliveryForm.patchValue({
            client_id: res.client_id
          });
          observer.next(res);
          observer.complete();
        },
        error: (error) => {
          console.error(error);
          observer.error(error);
        }
      });
    });
  }

  private getUserLocation() {
    this.deliveryService.getUserLocation().subscribe({
      next: (res) => {
        this.userLocation = res;
        if (res.id !== null) {
          this.deliveryForm.patchValue({
            destination: res.id
          });
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private buildDeliveryForm(): void {
    this.deliveryForm = this.formBuilder.group({
      destination: [null, Validators.required],
      client_id: [null]
    });
  }
}
