import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DisclaimerRegisterLocationComponent } from '../../dialog/disclaimer-register-location/disclaimer-register-location.component';
import { Location } from 'src/app/models/map/location';
import { AuthService } from 'src/app/services/login/auth.service';
import { Gender } from 'src/app/models/user/gender';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-voluntario-registro',
  templateUrl: './voluntario-registro.component.html',
  styleUrls: ['./voluntario-registro.component.scss']
})
export class VoluntarioRegistroComponent implements OnInit, AfterViewInit {

  @ViewChild('signaturePadCanvas', { static: false }) signaturePadCanvas!: ElementRef;
  private signaturePad!: SignaturePad;

  public selectedLanguage: string;
  public volunteerFormGroup: FormGroup;
  public loadingGender: boolean = false;
  public loadingSubmit: boolean = false;
  public hasSignature: boolean = false;
  private firstExecuteComponent: boolean = true;
  private previousInput: string;
  locations: Location[] = [];
  genders: Gender[] = [];

  constructor(
    public translate: TranslateService,
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    translate.use(localStorage.getItem('language') || 'en');
    this.buildForm();
  }

  ngOnInit() {
    this.getGender(this.translate.currentLang);
    this.getLocations();

    this.translate.onLangChange.subscribe(() => {
      if (this.firstExecuteComponent) {
        this.firstExecuteComponent = false;
      } else {
        this.genders = [];
        this.getGender(this.translate.currentLang);
      }
    });

    this.volunteerFormGroup.get('destination').valueChanges.subscribe(
      (res) => {
        if (res) {
          const location = this.locations.find(l => l.id === res);
          if (location) {
            this.disclaimerLocation(location.organization, location.address);
          }
        }
      }
    );
  }

  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.signaturePadCanvas.nativeElement, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: 'rgb(0, 0, 0)'
    });

    // Add listener for signature changes
    this.signaturePad.addEventListener('endStroke', () => {
      this.hasSignature = true;
      this.volunteerFormGroup.controls['signature'].setValue(true);
    });
  }

  clearSignature() {
    this.signaturePad.clear();
    this.hasSignature = false;
    this.volunteerFormGroup.controls['signature'].setValue(false);
  }

  isSignatureEmpty(): boolean {
    return !this.hasSignature;
  }

  onSubmit() {

    if (this.volunteerFormGroup.valid) {
      this.loadingSubmit = true;

      // Obtener la fecha del formulario
      const dateOfBirth = new Date(this.volunteerFormGroup.value.dateOfBirth);
      const date = new Date(this.volunteerFormGroup.value.date);
      // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
      const dateOfBirthString = dateOfBirth.toISOString().slice(0, 10);
      const dateString = date.toISOString().slice(0, 10);
      // Asignar la fecha al campo de fecha en el formulario
      this.volunteerFormGroup.get('dateOfBirth').setValue(dateOfBirthString);
      this.volunteerFormGroup.get('date').setValue(dateString);

      var body = new FormData();
      const dataURL = this.signaturePad.toDataURL('image/jpeg');
      const imageBlob = this.dataURLToBlob(dataURL);
      body.append('signature[]', imageBlob, 'signature.jpg');
      body.append('form', JSON.stringify(this.volunteerFormGroup.value));
      this.authService.registerVolunteer(body).pipe(
        finalize(() => {
          this.loadingSubmit = false;
        })
      ).subscribe({
        next: (res) => {
          this.openSnackBar(this.translate.instant('register_snack_submitted'));
          this.router.navigate(['login']);
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar(this.translate.instant('register_snack_submitted_error'));
        }
      });
    }

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  switchLang() {
    this.translate.use(this.selectedLanguage);
    // save in local storage
    localStorage.setItem('language', this.selectedLanguage);
  }

  setForgetPassword(login: boolean, password: boolean) {
    this.router.navigate(['login']);
  }

  formatDate(event) {
    let input = event.target.value;
    let cursorPosition = event.target.selectionStart; // Guarda la posición del cursor
    let previousLength = this.previousInput ? this.previousInput.length : 0; // Guarda la longitud del input anterior

    input = input.replace(/[^0-9]/g, ''); // Elimina cualquier caracter que no sea un número
    let formattedInput = '';
    let addedSlash = false;

    for (let i = 0; i < input.length; i++) {
      if (i == 2 || i == 4) {
        formattedInput += '/';
        addedSlash = true;
      }
      formattedInput += input[i];
    }

    event.target.value = formattedInput;

    // Si se ha agregado una barra, incrementa la posición del cursor
    if (addedSlash && cursorPosition > 2) {
      cursorPosition++;
    }

    // Si se ha eliminado un carácter y el cursor no está en la primera o segunda posición, disminuye la posición del cursor
    if (formattedInput.length < previousLength && cursorPosition > 1) {
      cursorPosition--;
    }

    // Restablece la posición del cursor
    event.target.setSelectionRange(cursorPosition, cursorPosition);

    // Guarda el input actual para la próxima vez
    this.previousInput = formattedInput;
  }

  formatDateOnBlur(event) {
    if (this.previousInput && new Date(this.previousInput).toString() !== 'Invalid Date') {
      // Establece el valor del control de formulario a la fecha formateada
      this.volunteerFormGroup.controls['dateOfBirth'].setValue(new Date(this.previousInput), { emitEvent: false });
      // Actualiza el valor y la validez del control de formulario
      this.volunteerFormGroup.controls['dateOfBirth'].updateValueAndValidity({ emitEvent: false });
    }
  }

  formatDateOnFocus(event) {
    let input = event.target.value;
    let dateParts = input.split('/');

    if (dateParts.length === 3) {
      let month = dateParts[0].padStart(2, '0');
      let day = dateParts[1].padStart(2, '0');
      let year = dateParts[2];

      event.target.value = `${month}/${day}/${year}`;
    }
  }

  private getGender(language: string, id?: number) {
    this.loadingGender = true;
    this.authService.getGender(language, id).subscribe({
      next: (res) => {
        this.genders = res;
        this.loadingGender = false;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private buildForm(): void {
    this.volunteerFormGroup = this.formBuilder.group({
      firstName: [null, [Validators.required, this.noNumbersValidator()]],
      lastName: [null, [Validators.required, this.noNumbersValidator()]],
      dateOfBirth: [null, [Validators.required, this.validateAge]],
      email: [null, [Validators.required, () => this.validateEmail()]],
      phone: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      zipcode: [null, Validators.required],
      destination: [null, Validators.required],
      gender: [null, Validators.required],
      date: [null, Validators.required],
      signature: [false, Validators.requiredTrue]
    });
  }

  private dataURLToBlob(dataURL: string): Blob {
    // Modern approach to handle base64
    try {
      const arr = dataURL.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = window.atob(arr[1]);
      const n = bstr.length;
      const u8arr = new Uint8Array(n);

      for (let i = 0; i < n; i++) {
        u8arr[i] = bstr.charCodeAt(i);
      }

      return new Blob([u8arr], { type: mime });
    } catch (e) {
      console.error('Error converting signature to blob:', e);
      return new Blob([''], { type: 'image/jpeg' });
    }
  }

  private validateEmail(): ValidationErrors | null {
    if (this.volunteerFormGroup && this.volunteerFormGroup.controls['email'].value !== null && this.volunteerFormGroup.controls['email'].value !== '') {
      const email = this.volunteerFormGroup.controls['email'].value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { 'invalidEmail': true };
      }
    }
    return null;
  }

  private validateAge(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const birthDate = new Date(control.value);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return { 'invalidAge': true };
    }
    if (age > 120) {
      return { 'tooOld': true };
    }
    return null;
  }

  private noNumbersValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const hasNumber = /\d/.test(control.value);
      return hasNumber ? { 'hasNumber': true } : null;
    };
  }


  private getLocations() {
    this.authService.getLocations().subscribe(
      (res) => {
        this.locations = res;
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
        this.volunteerFormGroup.get('destination').setValue(null);
      }
    });
  }

}
