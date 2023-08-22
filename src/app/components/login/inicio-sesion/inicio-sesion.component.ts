import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/login/auth.service';
import { Usuario } from 'src/app/models/login/usuario';
import { Router } from '@angular/router';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { AnimationEvent } from '@angular/animations';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

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
  public loading: boolean = false;
  public loginSection: boolean = true;
  public passwordSection: boolean = false;
  public loginForm: FormGroup;
  public recoverPasswordForm: FormGroup;
  public submitted = false;

  constructor(
    private authService: AuthService,
    private decodificadorService: DecodificadorService,
    private router: Router,
    private formBuilder: FormBuilder,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    this.buildLoginForm();
    this.buildRecoverPasswordForm();
    this.usuario = this.decodificadorService.getUsuario();
   }

   switchLang(lang: string) {
    this.translate.use(lang);
  }

  ngOnInit() {
    if (this.usuario !== null) {
      this.redireccionar();
    }
  }

  logIn(){
    if (this.loginForm.valid) {
      this.loading = true;
      console.log("this.loginForm.value: ", this.loginForm.value);
      this.authService.signin(this.loginForm.value).subscribe(
        (res:any) => {
                console.log("la respuesta fue: ", res);
                if(res!=null){
                  localStorage.setItem('token',res.token);
                  this.redireccionar();
                }else{
                  this.loginValid = false;
                }
                this.loading = false;
                this.authService.login();
        },
        (err:any) => {
          this.loginValid = false;
          this.loading = false;
        })
    } else {
      this.submitted = true;
      this.loginForm.markAllAsTouched();
    }
  }

  redireccionar(){
    // create switch
    switch(this.decodificadorService.getRol()){
      case 'admin':
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

  signUp(){
    this.router.navigate(['register']);
  }

  setForgetPassword(login:boolean, password: boolean){
    if(!login){
      this.loginSection = login;
    }else{
      if(!password){
        this.passwordSection = password;
      }
    }
  }

  animationDone(event: AnimationEvent, componente: string) {
    if (event.toState === 'void') {
      if(componente === 'login'){
        this.loginSection = true;
      }else{
        if(componente === 'password'){
          this.passwordSection = true;
        }
      }
    }
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
      email: [null,  Validators.required],
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
