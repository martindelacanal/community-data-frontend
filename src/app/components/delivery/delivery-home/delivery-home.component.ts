import { Component, ViewChild, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private formBuilder: FormBuilder
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
        console.log(devices);
        const videoDevices: MediaDeviceInfo[] = [];
        for (const device of devices) {
          if (device.kind.toString() === 'videoinput') {
            videoDevices.push(device);
          }
        }
        if (videoDevices.length > 0) {
          let choosenDev;
          for (const dev of videoDevices) {
            if (dev.label.includes('front')) {
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
          this.objeto = JSON.parse(result);
          this.infoValid = this.objeto.role === 'beneficiary';
        } catch (error) {
          console.error(error);
          this.infoValid = false;
        }
      });
    }, 0);
  }

  onBoard() {
    if (!this.onBoarded) {
      this.onBoarded = true;
      this.deliveryService.onBoard(true,this.deliveryForm.value.destination).subscribe(
        (res: any) => {
          console.log(res);
          this.userLocation = this.locations.find(location => location.id === this.deliveryForm.value.destination);
          this.openSnackBar('On boarded successfully');
        },
        (err: any) => {
          console.log(err);
          this.onBoarded = false;
          this.openSnackBar('Error on boarding');
        }
      );
    } else {
      this.onBoarded = false;
      this.deliveryService.onBoard(false,this.deliveryForm.value.destination).subscribe(
        (res: any) => {
          console.log(res);
          this.userLocation = null;

          this.openSnackBar('On boarded finished successfully');
        },
        (err: any) => {
          console.log(err);
          this.onBoarded = true;
          this.openSnackBar('Error cancelling on boarding');
        }
      );

    }
  }

  onSubmit() {
    if (this.infoValid && this.deliveryForm.valid) {
      this.deliveryService.uploadTicket(this.objeto, this.deliveryForm.value.destination).subscribe(
        (res: any) => {
          console.log(res);
          this.openSnackBar('QR uploaded successfully');
          this.infoValid = false;
        },
        (err: any) => {
          console.log(err);
          this.openSnackBar('Error uploading QR');
        }
      );
    } else {
      this.openSnackBar('Please scan a valid QR');
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
    this.snackBar.open(message, 'Close');
  }

  private getLocations() {
    this.deliveryService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
  }

  private getUserStatus() {
    this.deliveryService.getUserStatus().subscribe(
      (res) => {
        this.userStatus = res;
        if (this.userStatus.id === 3) {
          this.onBoarded = true;
        } else {
          this.onBoarded = false;
        }
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
