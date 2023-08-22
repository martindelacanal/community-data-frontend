import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { Usuario } from 'src/app/models/login/usuario';
import { AuthService } from 'src/app/services/login/auth.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.scss']
})


export class FormularioRegistroComponent implements OnInit {

  private usuario: Usuario;
  public loading: boolean = false;
  public submitted = false;
  public loginValid: boolean = true;
  public loginForm: FormGroup;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public combinedFormGroup: FormGroup;
  userNameExists: boolean = false;
  emailExists: boolean = false;

  isLinear = true;
  genders: any[] = [{ id: 1, name: 'Femenine' }, { id: 2, name: 'Masculine' }, { id: 3, name: 'Other' }, { id: 4, name: 'Prefer not to say' }];
  ethnicities: string[] = ['Hispanic/Latino', 'Black/African American', 'Asian', 'Native Hawaiian', 'American/Indian', 'Others'];
  input1s: string[] = ['Yes', 'No'];
  input2s: string[] = ['Yes', 'No'];
  input3s: string[] = ['IEHP', 'Health Net', 'Kaiser', 'Molina', 'Other'];
  input4s: string[] = ['Yes', 'No'];
  input6s: string[] = ['Education-Training', 'Housing', 'Immigration', 'Legal', 'Taxes', 'Others'];
  input8s: string[] = ['Primary care', 'Dental care', 'Laboratory and diagnostic care', 'Prenatal care', 'Pharmaceutical care', 'Chronic conditions care (i.e. diabetes, high blood pressure, etc.)', 'Nutritional support', 'Physical and occupational therapy', 'Mental health care', 'Substance abuse treatment','Others'];

  constructor(
    private decodificadorService: DecodificadorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    this.buildForm();
    this.buildFirstFormGroup();
    this.buildSecondFormGroup();
    this.buildCombinedFormGroup();
    this.usuario = this.decodificadorService.getUsuario();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    if (this.usuario !== null) {
      this.redireccionar();
    }
    const input6Array = this.secondFormGroup.get('input6') as FormArray;
    const input8Array = this.secondFormGroup.get('input8') as FormArray;
    // this.input6s.forEach(() => input6Array.push(this.formBuilder.control(false)));
    this.firstFormGroup.get('username').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateUserNameExists(res);
        }
      );
    this.firstFormGroup.get('email').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateEmailExists(res);
        }
      );
  }

  logIn() {
    console.log(this.loginForm.value);
    this.submitted = true;
  }

  redireccionar() {
    this.router.navigate(['login']);
  }

  setForgetPassword(login: boolean, password: boolean) {
    this.router.navigate(['login']);
  }

  onCheckboxChange(event: MatCheckboxChange, index: number) {
    const input6Array = this.secondFormGroup.get('input6') as FormArray;
    if (event.checked) {
      input6Array.push(this.formBuilder.control(this.input6s[index]));
    } else {
      input6Array.removeAt(index);
    }
  }

  onCheckboxChange8(event: MatCheckboxChange, index: number) {
    const input8Array = this.secondFormGroup.get('input8') as FormArray;
    if (event.checked) {
      input8Array.push(this.formBuilder.control(this.input8s[index]));
    } else {
      input8Array.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.combinedFormGroup.valid) {
      this.firstFormGroup.value.dateOfBirth = new Date(this.firstFormGroup.value.dateOfBirth).toISOString().slice(0, 19).replace('T', ' ');
      console.log(this.firstFormGroup.value);
      console.log(this.secondFormGroup.value);
      this.authService.signup(this.combinedFormGroup.value).subscribe(
        (res: any) => {
          console.log(res);
          this.openSnackBar('Form submitted successfully.');
          this.router.navigate(['login']);
        },
        (err: any) => {
          console.log(err);
          this.openSnackBar('Error submitting form.');
        }
      );
    } else {
      this.openSnackBar('Please fill out all required fields.');
    }
  }

  private updateUserNameExists(nombre: string) {
    this.authService.getUserNameExists(nombre).subscribe(
      (res) => {
        if (res) {
          this.userNameExists = true;
        } else {
          this.userNameExists = false;
        }
        this.firstFormGroup.get('username').updateValueAndValidity();
      }
    );
  }

  private updateEmailExists(nombre: string) {
    this.authService.getEmailExists(nombre).subscribe(
      (res) => {
        if (res) {
          this.emailExists = true;
        } else {
          this.emailExists = false;
        }
        this.firstFormGroup.get('email').updateValueAndValidity();
      }
    );
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, 'Close');
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      remember: [false, Validators.required]
    });
  }

  private buildFirstFormGroup(): void {
    this.firstFormGroup = this.formBuilder.group({
      username: [null, [Validators.required, () => this.validateUserName()]],
      password: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      dateOfBirth: [null, [Validators.required, this.validateAge]],
      email: [null, [() => this.validateEmail()]],
      phone: [null, Validators.required],
      zipcode: [null],
      householdSize: [null, Validators.required],
      gender: [null, Validators.required],
      ethnicity: [null, Validators.required],
      otherEthnicity: [null],
    });

    // Agregar un observador al campo 'ethnicity'
    this.firstFormGroup.get('ethnicity').valueChanges.subscribe(value => {
      if (value === 'Others') {
        // Si el valor es 'Others', agregar el validador 'Validators.required' al campo 'otherEthnicity'
        this.firstFormGroup.get('otherEthnicity').setValidators(Validators.required);
      } else {
        // De lo contrario, eliminar el validador
        this.firstFormGroup.get('otherEthnicity').clearValidators();
      }
      // Actualizar el estado del campo 'otherEthnicity'
      this.firstFormGroup.get('otherEthnicity').updateValueAndValidity();
    });
  }

  private buildSecondFormGroup(): void {
    this.secondFormGroup = this.formBuilder.group({
      input1: [null, Validators.required],
      input2: [null, Validators.required],
      input3: [null, Validators.required],
      input4: [null, Validators.required],
      input5: [null, Validators.required],
      input6: this.formBuilder.array([], [Validators.required]),
      input7: [null, Validators.required],
      input8: this.formBuilder.array([], [Validators.required]),
    });

    this.secondFormGroup.get('input1').valueChanges.subscribe(value => {
      if (value === 'Yes') {
        // Si el valor es 'Yes', agregar el validador 'Validators.required' al campo 'input2' y 'input3'
        this.secondFormGroup.get('input2').setValidators(Validators.required);
        this.secondFormGroup.get('input3').setValidators(Validators.required);
      } else {
        // De lo contrario, eliminar el validador
        this.secondFormGroup.get('input2').clearValidators();
        this.secondFormGroup.get('input3').clearValidators();
      }
      // Actualizar el estado del campo 'input2' y 'input3'
      this.secondFormGroup.get('input2').updateValueAndValidity();
      this.secondFormGroup.get('input3').updateValueAndValidity();
    });
  }

  private buildCombinedFormGroup(): void {
    this.combinedFormGroup = this.formBuilder.group({
      firstFormGroup: this.firstFormGroup,
      secondFormGroup: this.secondFormGroup
    });
  }

  private validateAge(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const birthDate = new Date(control.value);
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    if (age < 18) {
      return { 'invalidAge': true };
    }
    return null;
  }

  private validateUserName(): ValidationErrors | null {
    if (this.userNameExists) {
      return { 'invalidUsername': true };
    }
    return null;
  }

  private validateEmail(): ValidationErrors | null {
    if (this.emailExists) {
      return { 'invalidEmail': true };
    }
    return null;
  }

  get selectedOptions() {
    const input6Array = this.secondFormGroup.get('input6') as FormArray;
    return input6Array.controls.filter((control) => control.value === true).map((control) => control.value);
  }

  get secondFormGroupInput6() {
    return this.secondFormGroup.get('input6') as FormArray;
  }
  get selectedOptions8() {
    const input8Array = this.secondFormGroup.get('input8') as FormArray;
    return input8Array.controls.filter((control) => control.value === true).map((control) => control.value);
  }

  get secondFormGroupInput8() {
    return this.secondFormGroup.get('input8') as FormArray;
  }



}
