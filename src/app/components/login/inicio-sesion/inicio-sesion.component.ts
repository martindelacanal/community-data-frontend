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
            localStorage.setItem('token', res.token);
            localStorage.setItem('reset_password', res.reset_password);

            this.redireccionar();
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
    input = input.replace(/[^0-9]/g, ''); // Elimina cualquier caracter que no sea un número
    let formattedInput = '';

    for (let i = 0; i < input.length; i++) {
      if (i == 2 || i == 4) {
        formattedInput += '/';
      }
      formattedInput += input[i];
    }

    event.target.value = formattedInput;
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
    console.log("setForgetPassword")
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
    console.log("animationDone")
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
