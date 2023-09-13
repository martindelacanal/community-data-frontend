import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { QrScannerComponent } from 'angular2-qrscanner';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { Location } from 'src/app/models/map/location';
import { UserStatus } from 'src/app/models/user/user-status';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';


@Component({
  selector: 'app-delivery-home',
  templateUrl: './delivery-home.component.html',
  styleUrls: ['./delivery-home.component.scss'],
})
export class DeliveryHomeComponent implements OnInit, AfterViewInit {

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent;

  public loading: boolean = false;
  public deliveryForm: FormGroup;
  scanActive: boolean = false;
  infoValid: boolean = false;
  onBoarded: boolean = false;
  objeto: beneficiaryQR;
  locations: Location[] = [];
  userStatus: UserStatus;
  userLocation: Location;

  constructor(
    private deliveryService: DeliveryService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
    this.buildDeliveryForm();
  }

  ngOnInit(): void {
    this.getLocations();
    this.getUserStatus();
    this.getUserLocation();
  }

  ngAfterViewInit(): void {

  }

  scanQR() {
    console.log('Escaneando QR');
    this.scanActive = true;
    setTimeout(() => {
      this.qrScannerComponent.getMediaDevices().then(devices => {
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
            videoDevices.push(device);
          }
        }
        if (videoDevices.length > 0) {
          let choosenDev;
          for (const dev of videoDevices) {
            if (dev.label.includes('back')) {
              choosenDev = dev;
              break;
            }
          }
          if (choosenDev) {
            this.qrScannerComponent.chooseCamera.next(choosenDev);
          } else {
            this.qrScannerComponent.chooseCamera.next(videoDevices[0]);
          }
        }
      });

      this.qrScannerComponent.capturedQr.subscribe(result => {
        console.log(result);
        this.scanActive = false;
        try {
          this.loading = true;
          this.objeto = JSON.parse(result);
          this.deliveryService.uploadTicket(this.objeto, this.deliveryForm.value.destination).subscribe({
            next: (res) => {
              if (res.could_approve === 'Y'){
                this.infoValid = true;
              } else {
                this.infoValid = false;
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
      this.onBoarded = true;
      this.deliveryService.onBoard(true,this.deliveryForm.value.destination).subscribe(
        (res: any) => {
          console.log(res);
          this.userLocation = this.locations.find(location => location.id === this.deliveryForm.value.destination);
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded'));
        },
        (err: any) => {
          console.log(err);
          this.onBoarded = false;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded_error'));
        }
      );
    } else {
      this.onBoarded = false;
      this.deliveryService.onBoard(false,this.deliveryForm.value.destination).subscribe(
        (res: any) => {
          console.log(res);
          this.userLocation = null;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_off_boarded'));
        },
        (err: any) => {
          console.log(err);
          this.onBoarded = true;
          this.loading = false;
          this.openSnackBar(this.translate.instant('delivery_snack_off_boarded_error'));
        }
      );

    }
  }

  onSubmit() {
    if (this.infoValid && this.deliveryForm.valid) {
      this.loading = true;
      // cambiar el approved del objeto
      this.objeto.approved = 'Y';
      this.deliveryService.uploadTicket(this.objeto, this.deliveryForm.value.destination).subscribe({
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
    console.log('Formulario cancelado');
    this.infoValid = false;
    this.scanActive = false;
    if (this.qrScannerComponent) {
      this.qrScannerComponent.stopScanning();
      this.qrScannerComponent.capturedQr.unsubscribe();
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
        this.userStatus = res;
        if (this.userStatus.id === 3) {
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
          this.deliveryForm.patchValue({
            destination: res.id
          });
        }
      }
    );
  }


  private buildDeliveryForm(): void {
    this.deliveryForm = this.formBuilder.group({
      destination: [null, Validators.required]
    });
  }
}
