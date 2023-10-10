import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';
import { Gender } from 'src/app/models/user/gender';
import { Role } from 'src/app/models/user/role';
import { AuthService } from 'src/app/services/login/auth.service';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public userForm: FormGroup;
  public userNameExists: boolean = false;
  public emailExists: boolean = false;
  public roles: Role[] = [];
  public genders: Gender[] = [];

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    this.buildNewForm();
    // get language from local storage
    translate.use(localStorage.getItem('language') || 'en');
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([
      '(max-width: 900px)'
    ]).subscribe(result => {
      this.isMobile = result.matches;
    });

    this.breakpointObserver.observe([
      '(min-width: 901px) and (max-width: 1200px)'
    ]).subscribe(result => {
      this.isTablet = result.matches;
    });

    this.getRoles();
    this.getGender(this.translate.currentLang);

    this.userForm.get('username').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateUserNameExists(res);
        }
      );
    this.userForm.get('email').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateEmailExists(res);
        }
      );

      this.openSnackBar(this.translate.instant('new_user_snack_password_message'));
  }

  onSubmit() {
    this.loading = true;
    if (this.userForm.valid) {
      // Obtener la fecha del formulario
      const date = new Date(this.userForm.value.date_of_birth);
      // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
      const dateString = date.toISOString().slice(0, 10);
      // Asignar la fecha al campo de fecha en el formulario
      this.userForm.get('date_of_birth').setValue(dateString);

      this.newService.newUser(this.userForm.value).subscribe({
        next: (res) => {
          this.loading = false;
          console.log(res);
          this.openSnackBar(this.translate.instant('new_user_snack_your_new_password') + res.password);
          this.resetearFormulario();
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.openSnackBar(this.translate.instant('new_user_snack_error'));
        }
      });
    } else {
      this.loading = false;
      this.openSnackBar(this.translate.instant('new_user_invalid_form'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
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

  private resetearFormulario() {
    this.userForm.reset();
    this.userForm.get('username').setErrors(null);
    this.userForm.get('email').setErrors(null);
    this.userNameExists = false;
    this.emailExists = false;
  }

  private getRoles() {
    this.newService.getRoles().subscribe(
      (res) => {
        this.roles = res;
      }
    );
  }

  private getGender(language: string, id?: number) {
    this.authService.getGender(language, id).subscribe({
      next: (res) => {
        this.genders = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private updateUserNameExists(nombre: string) {
    this.authService.getUserNameExists(nombre).subscribe(
      (res) => {
        if (res) {
          this.userNameExists = true;
        } else {
          this.userNameExists = false;
        }
        this.userForm.get('username').updateValueAndValidity();
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
        this.userForm.get('email').updateValueAndValidity();
      }
    );
  }

  private validateUserName(): ValidationErrors | null {
    if (this.userNameExists) {
      return { 'invalidUsername': true };
    }
    return null;
  }

  private validateEmail(): ValidationErrors | null {
    if (this.emailExists) {
      return { 'emailExists': true };
    }
    if (this.userForm && this.userForm.controls['email'].value !== null && this.userForm.controls['email'].value !== '') {
      const email = this.userForm.controls['email'].value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { 'invalidEmail': true };
      }
    }
    return null;
  }

  private buildNewForm(): void {
    this.userForm = this.formBuilder.group({
      username: [null, [Validators.required, () => this.validateUserName()]],
      password: [null],
      firstname: [null, Validators.required],
      lastname: [null],
      email: [null, [() => this.validateEmail()]],
      date_of_birth: [null],
      gender_id: [null, Validators.required],
      role_id: [null, Validators.required],
    });
  }

}
