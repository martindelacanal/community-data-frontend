import { Component, ViewChild, OnInit, AfterViewChecked } from '@angular/core';
import { Observable, debounceTime, finalize, forkJoin } from 'rxjs';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { Location } from 'src/app/models/map/location';
import { Client } from 'src/app/models/user/client';
import { UserStatus } from 'src/app/models/user/user-status';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { NewService } from 'src/app/services/new/new.service';
import { AuthService } from 'src/app/services/login/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectListComponent } from '../../dialog/select-list/select-list.component';
import { DisclaimerRegisterComponent } from '../../dialog/disclaimer-register/disclaimer-register/disclaimer-register.component';


@Component({
  selector: 'app-delivery-home',
  templateUrl: './delivery-home.component.html',
  styleUrls: ['./delivery-home.component.scss'],
})
export class DeliveryHomeComponent implements OnInit, AfterViewChecked {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  public loading: boolean = false;
  public deliveryForm: FormGroup;
  public phoneForm: FormGroup;
  scanActive: boolean = false;
  scanPhoneActive: boolean = false;
  phoneExists: boolean = false;
  loadingPhoneExists: boolean = false;
  userIdFromPhoneList: number = 0;
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
  geolocationGetted: boolean = false;
  latitude: number = 0;
  longitude: number = 0;
  accuracy: number = 0;
  moreThanDistance: boolean = false;
  private locationInterval: any;
  public locationOrganizationSelected: string = '';
  public locationAddressSelected: string = '';

  constructor(
    private deliveryService: DeliveryService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private newService: NewService,
    public translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.buildDeliveryForm();
    this.buildPhoneForm();
  }

  ngOnInit(): void {
    forkJoin([this.getLocations(), this.getClients(), this.getUserStatus()])
      .subscribe(() => {
        this.getUserLocation();
      });

    this.getCurrentLocation();

    // Actualizar la ubicación cada 1 minuto mientras onBoarded sea false
    this.locationInterval = setInterval(() => {
      if (!this.onBoarded) {
        this.getCurrentLocation();
      } else {
        clearInterval(this.locationInterval);
      }
    }, 60000); // 60000 ms = 1 minuto

    // set locationOrganizationSelected and locationAddressSelected when location changes
    this.deliveryForm.get('destination').valueChanges.subscribe(
      (res) => {
        const location = this.locations.find(l => l.id === res);
        if (location) {
          const distance = this.calculateDistance(this.latitude, this.longitude, location.latitude, location.longitude);
          // perdonar la mala accuracy hasta 1000 metros
          if (distance <= 1 && this.accuracy <= 1000) {
            this.moreThanDistance = false;
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
            this.openSnackBar(this.translate.instant('delivery_snack_geolocation_more_than_1km'));
            this.moreThanDistance = true;
            this.locationOrganizationSelected = '';
            this.locationAddressSelected = '';
            this.clientsFiltered = [];
            this.deliveryForm.get('client_id').setValidators([]);
            this.deliveryForm.get('client_id').setValue(null); // Limpia el campo client_id
            this.deliveryForm.get('client_id').updateValueAndValidity();
          }
        } else {
          this.moreThanDistance = false;
          this.locationOrganizationSelected = '';
          this.locationAddressSelected = '';
          this.clientsFiltered = [];
          this.deliveryForm.get('client_id').setValidators([]);
          this.deliveryForm.get('client_id').setValue(null); // Limpia el campo client_id
          this.deliveryForm.get('client_id').updateValueAndValidity();
        }
      }
    );

    this.phoneForm.get('phone').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          // Solo si tiene valor y tiene 10 caracteres
          if (res && res.length === 10) {
            this.updatePhoneExists(res);
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

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distancia en kilómetros
    return distance;
  }

  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  ngOnDestroy(): void {
    // Limpiar el intervalo cuando el componente se destruya
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.accuracy = position.coords.accuracy; // Precisión en metros
          this.geolocationGetted = true;
          // console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}, Accuracy: ${this.accuracy}`);
        },
        (error) => {
          this.geolocationGetted = false;
          console.error('Error obteniendo la ubicación', error);
          this.openSnackBar(this.translate.instant('delivery_snack_geolocation_error_permission_tutorial'));
        },
        {
          enableHighAccuracy: true, // Solicitar alta precisión
          timeout: 10000, // Tiempo máximo de espera en milisegundos
          maximumAge: 0 // No usar una ubicación en caché
        }
      );
    } else {
      this.geolocationGetted = false;
      console.error('Geolocalización no es soportada por este navegador.');
      this.openSnackBar(this.translate.instant('delivery_snack_geolocation_error'));
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

  scanPhone() {
    this.resetPhoneForm();
    this.scanPhoneActive = true;
  }

  private resetPhoneForm() {
    // Limpia el campo phone
    if (this.phoneForm) {
      this.phoneForm.reset();
    } else {
      this.buildPhoneForm();
    }
    this.phoneExists = false;
    this.infoValid = false;
    this.userIdFromPhoneList = 0;
  }

  onBoard() {
    if (!this.onBoarded) {
      this.loading = true;
      this.deliveryService.onBoard(true, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).pipe(
        finalize(() => {
          this.clientsFiltered = this.clients.filter(client => client.location_ids.includes(this.deliveryForm.value.destination));
          this.loading = false;
        })
      ).subscribe({
        next: (res) => {
          // actualizar token con res.token en el local storage
          localStorage.setItem('token', res.token);
          this.userLocation = this.locations.find(location => location.id === this.deliveryForm.value.destination);
          this.onBoarded = true;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded'));
        },
        error: (error) => {
          console.log(error);
          this.onBoarded = false;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded_error'));
          // Actualizar la ubicación cada 1 minuto mientras onBoarded sea false
          this.locationInterval = setInterval(() => {
            if (!this.onBoarded) {
              this.getCurrentLocation();
            } else {
              clearInterval(this.locationInterval);
            }
          }, 60000); // 60000 ms = 1 minuto
        }
      });
    } else {
      const dialogRef = this.dialog.open(DisclaimerRegisterComponent, {
        width: '370px',
        data: this.translate.instant('delivery_button_off_board_disclaimer'),
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loading = true;
        if (result.status) {
          this.deliveryService.onBoard(false, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).pipe(
            finalize(() => {
              this.clientsFiltered = this.clients.filter(client => client.location_ids.includes(this.deliveryForm.value.destination));
              this.loading = false;
            })
          ).subscribe({
            next: (res) => {
              this.deliveryForm.get('client_id').setValue(null); // Limpia el campo client_id
              this.userLocation = null;
              this.onBoarded = false;
              this.openSnackBar(this.translate.instant('delivery_snack_off_boarded'));
              // Actualizar la ubicación cada 1 minuto mientras onBoarded sea false
              this.locationInterval = setInterval(() => {
                if (!this.onBoarded) {
                  this.getCurrentLocation();
                } else {
                  clearInterval(this.locationInterval);
                }
              }, 60000); // 60000 ms = 1 minuto
            },
            error: (error) => {
              console.log(error);
              this.onBoarded = true;
              this.openSnackBar(this.translate.instant('delivery_snack_off_boarded_error'));
            }
          });
        } else {
          this.loading = false;
        }
      });
    }
  }

  onSubmit() {
    if (this.infoValid && (this.deliveryForm.valid || this.phoneForm.valid)) {
      this.loading = true;
      if (this.scanPhoneActive) {
        this.deliveryService.uploadPhone(this.phoneForm.value.phone, this.deliveryForm.value.destination, this.deliveryForm.value.client_id, this.userIdFromPhoneList).subscribe({
          next: (res) => {
            this.loading = false;
            this.openSnackBar(this.translate.instant('delivery_snack_delivery_approved'));
            this.resetPhoneForm();
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('delivery_snack_delivery_approved_error'));
          }
        });
      } else {
        // cambiar el approved del objeto
        this.objeto.approved = 'Y';
        this.deliveryService.uploadTicket(this.objeto, this.deliveryForm.value.destination, this.deliveryForm.value.client_id).subscribe({
          next: (res) => {
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
      }

    } else {
      this.openSnackBar(this.translate.instant('delivery_snack_scan_valid_error'));
    }
  }

  onCancel() {
    this.infoValid = false;
    this.scanActive = false;
    this.scanPhoneActive = false;
    this.isBeneficiaryLocationError = false;
    this.isReceivingUserErrorNull = false;
    this.isReceivingLocationErrorNull = false;
    if (this.qrScannerComponent) {
      this.qrScannerComponent.stopScanning();
      this.qrScannerComponent.capturedQr.unsubscribe();
    }
    this.resetPhoneForm();
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
            // Actualizar la ubicación cada 1 minuto mientras onBoarded sea false
            this.locationInterval = setInterval(() => {
              if (!this.onBoarded) {
                this.getCurrentLocation();
              } else {
                clearInterval(this.locationInterval);
              }
            }, 60000); // 60000 ms = 1 minuto
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

  private updatePhoneExists(nombre: string) {
    this.loadingPhoneExists = true;
    this.loading = true;
    this.userIdFromPhoneList = 0;
    this.authService.getPhoneExists(nombre).pipe(
      finalize(() => {
        this.loadingPhoneExists = false;
        this.loading = false;
      })
    ).subscribe({
      next: (res) => {
        if (Array.isArray(res) && res.length > 0) {
          this.phoneExists = true;
          if (res.length > 1) {
            const dialogRef = this.dialog.open(SelectListComponent, {
              width: '472px',
              data: {
                origin: res,
              },
              disableClose: true
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result && result.status) {
                this.userIdFromPhoneList = result.id;
                this.infoValid = true;
                this.onSubmit();
              } else {
                this.phoneExists = false;
                this.infoValid = false;
                this.userIdFromPhoneList = 0;
                this.resetPhoneForm();
              }
            });
          } else {
            this.infoValid = true;
          }
        } else {
          this.phoneExists = false;
          this.infoValid = false;
        }
        this.phoneForm.get('phone').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
      },
      error: (error) => {
        console.error(error);
        this.infoValid = false;
      }
    });
  }

  private validatePhone(): ValidationErrors | null {
    if (!this.phoneExists) {
      return { 'invalidPhone': true };
    }
    return null;
  }

  private buildDeliveryForm(): void {
    this.deliveryForm = this.formBuilder.group({
      destination: [null, Validators.required],
      client_id: [null]
    });
  }

  private buildPhoneForm(): void {
    this.phoneForm = this.formBuilder.group({
      phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10), () => this.validatePhone()]],
    });
  }
}
