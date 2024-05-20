import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/login/auth.service';
import { Usuario } from 'src/app/models/login/usuario';
import { Router } from '@angular/router';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AnimationEvent } from '@angular/animations';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContenidoToken } from 'src/app/models/login/contenido-token';
import decode from 'jwt-decode';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate(300)]),
      transition(':leave', [animate(300)])
    ]),
    trigger('slideInOut', [
      state('void', style({ transform: 'translateX(-100%)' })),
      state('*', style({ transform: 'translateX(0)' })),
      transition(':enter', [animate('500ms ease-in')]),
      transition(':leave', [animate('500ms ease-out', style({ transform: 'translateX(100%)' }))])
    ]),
    trigger('scaleInOut', [
      state('void', style({ transform: 'scale(0.95)' })),
      state('*', style({ transform: 'scale(1)' })),
      transition(':enter', [animate('150ms ease-in-out')]),
      transition(':leave', [animate('150ms ease-in-out')])
    ])
  ]
})
export class InicioSesionComponent implements OnInit {

  user_temporal = {
    nombre_usuario: '',
    password: '',
    recordar: false
  }
  // variable
  private usuario: Usuario;
  private previousInput: string;

  public loginValid: boolean = true;
  public resetValid: boolean = true;
  public loading: boolean = false;
  public loginSection: boolean = false;
  public passwordSection: boolean = false;
  public firstPageSection: boolean = true;
  public loginSectionChoice: string;
  public loginForm: FormGroup;
  public recoverPasswordForm: FormGroup;
  public submitted = false;
  public selectedLanguage: string;

  constructor(
    private authService: AuthService,
    private decodificadorService: DecodificadorService,
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {
    // translate.addLangs(['en', 'es']);
    // translate.setDefaultLang('en');
    // translate.use(localStorage.getItem('language') || 'en');
    this.buildLoginForm();
    this.buildRecoverPasswordForm();
    this.usuario = this.decodificadorService.getUsuario();
    if (this.usuario !== null) {
      this.redireccionar();
    }
  }

  switchLang() {
    this.translate.use(this.selectedLanguage);
    // save in local storage
    localStorage.setItem('language', this.selectedLanguage);
  }
  // switchLang(lang: string) {
  //   this.translate.use(lang);
  //   // save in local storage
  //   localStorage.setItem('language', lang);
  // }

  ngOnInit() {
    if (this.usuario !== null) {
      this.redireccionar();
    }
  }

  logIn() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.signin(this.loginForm.value).subscribe(
        (res: any) => {
          if (res != null) {
            const usuario: Usuario = JSON.parse((<ContenidoToken>decode(res.token)).data);
            console.log("usuario", usuario)
            if (usuario.role === 'thirdparty') {
              this.loginValid = false;
              alert(this.translate.instant('login_snack_role_disabled'));
            } else {
              localStorage.setItem('token', res.token);
              localStorage.setItem('reset_password', res.reset_password);
              let filters = {
                ethnicities: [],
                from_date: null,
                genders: [],
                locations: [],
                max_age: null,
                min_age: null,
                product_types: [],
                providers: [],
                to_date: null,
                zipcode: null
              }
              localStorage.setItem('filters', JSON.stringify(filters));
              let filters_chip = [];
              localStorage.setItem('filters_chip', JSON.stringify(filters_chip));

              this.redireccionar();
            }
          } else {
            this.loginValid = false;
          }
          this.loading = false;
          this.authService.login();
        },
        (err: any) => {
          this.loginValid = false;
          this.loading = false;
        })
    } else {
      this.submitted = true;
      this.loginForm.markAllAsTouched();
    }
  }

  onSubmitResetPassword() {
    if (this.recoverPasswordForm.valid) {
      this.loading = true;
      // Obtener la fecha del formulario
      const date = new Date(this.recoverPasswordForm.value.dateOfBirth);
      // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
      const dateString = date.toISOString().slice(0, 10);
      // Asignar la fecha al campo de fecha en el formulario
      this.recoverPasswordForm.get('dateOfBirth').setValue(dateString);
      this.authService.resetPassword(this.recoverPasswordForm.value).subscribe({
        next: (res) => {
          if (res != null) {
            this.openSnackBar(this.translate.instant('login_snack_your_new_password') + res.password);
            this.resetearFormulario();
          } else {
            this.resetValid = false;
          }
          this.loading = false;
        },
        error: (error) => {
          this.resetValid = false;
          this.loading = false;
        }
      });
    } else {
      this.submitted = true;
      this.loginForm.markAllAsTouched();
    }
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
      this.recoverPasswordForm.controls['dateOfBirth'].setValue(new Date(this.previousInput), { emitEvent: false });
      // Actualiza el valor y la validez del control de formulario
      this.recoverPasswordForm.controls['dateOfBirth'].updateValueAndValidity({ emitEvent: false });
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

  redireccionar() {
    // create switch
    switch (this.decodificadorService.getRol()) {
      case 'admin':
        this.router.navigate(['home']);
        break;
      case 'client':
        this.router.navigate(['home']);
        break;
      case 'stocker':
        this.router.navigate(['stocker/home']);
        break;
      case 'delivery':
        this.router.navigate(['delivery/home']);
        break;
      case 'beneficiary':
        this.router.navigate(['beneficiary/home']);
        break;
      case 'thirdparty':
        this.router.navigate(['thirdparty/home']);
        break;
    }
  }



  signUp() {
    this.router.navigate(['register']);
  }

  setForgetPassword(login: boolean, password: boolean, firstpage: boolean) {
    if (!firstpage) {
      this.loginSectionChoice = 'firstpage';
      this.firstPageSection = firstpage;
    }
    if (!login) {
      this.loginSection = login;
    }
    if (!password) {
      this.loginSectionChoice = 'password';
      this.passwordSection = password;
    }
  }

  animationDone(event: AnimationEvent, componente: string) {
    if (event.toState === 'void') {
      if (componente === 'login') {
        this.loginSection = true;
      } else {
        if (componente === 'password') {
          this.passwordSection = true;
        } else {
          if (componente === 'firstpage') {
            this.firstPageSection = true;
          }
        }
      }
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }



  private resetearFormulario() {
    this.router.navigate(['/login']);
  }

  private buildLoginForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      remember: [false, Validators.required]
    });
  }

  private buildRecoverPasswordForm(): void {
    this.recoverPasswordForm = this.formBuilder.group({
      email: [null, Validators.required],
      dateOfBirth: [null, [Validators.required, this.validateAge]]
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
}

