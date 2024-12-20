import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, finalize } from 'rxjs';
import { NewUser } from 'src/app/models/new/new-user';
import { Client } from 'src/app/models/user/client';
import { Gender } from 'src/app/models/user/gender';
import { Role } from 'src/app/models/user/role';
import { AuthService } from 'src/app/services/login/auth.service';
import { NewService } from 'src/app/services/new/new.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  public loading: boolean = false;
  public loadingGet: boolean = true;
  public loadingGetForm: boolean = false;
  public loadingGetRoles: boolean = false;
  public loadingGetClients: boolean = false;
  public loadingGetGender: boolean = false;
  public userForm: FormGroup;
  public userNameExists: boolean = false;
  public loadingUserNameExists: boolean = false;
  public emailExists: boolean = false;
  public loadingEmailExists: boolean = false;
  public phoneExists: boolean = false;
  public loadingPhoneExists: boolean = false;
  public roles: Role[] = [];
  public clients: Client[] = [];
  public genders: Gender[] = [];
  public idUser: string = '';
  private userGetted: NewUser;
  public role_id_button_table: number;
  public numberOfFields: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private newService: NewService,
    private authService: AuthService,
    public translate: TranslateService
  ) {
    this.userGetted = {
      username: null,
      password: null,
      email: null,
      firstname: null,
      lastname: null,
      date_of_birth: null,
      gender_id: null,
      role_id: null,
      phone: null,
      client_id: null,
      emails_for_reporting: []
    }
    this.numberOfFields = 0;
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

    this.activatedRoute.params.subscribe((params: Params) => {
      if (params['id']) {
        this.idUser = params['id'];
        this.getUser();
      } else {
        this.openSnackBar(this.translate.instant('new_user_snack_password_message'));
      }
    });

    this.getRoles();
    this.getClients();
    this.getGender(this.translate.currentLang);

    this.userForm.get('username').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateUserNameExists(res);
        }
      );
    this.userForm.get('email').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateEmailExists(res);
        }
      );
    this.userForm.get('phone').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updatePhoneExists(res);
        }
      );
    this.userForm.get('role_id').valueChanges.pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateRoleIdButtonTable(res);
        }
      );

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

      if (this.idUser) {
        this.newService.updateUser(this.idUser, this.userForm.value).subscribe({
          next: (res) => {
            this.loading = false;
            console.log(res);
            this.openSnackBar(this.translate.instant('edit_user_snack_user_updated'));
            this.router.navigate(['/view/user/' + this.idUser]);
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            this.openSnackBar(this.translate.instant('edit_user_snack_error_update'));
          }
        });
      } else {
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
      }
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

  agregarCampo(createButton?: boolean) {
    this.emailsForReportingForm.push(this.formBuilder.group({
      email: [null],
    }));
    if (!createButton) {
      this.numberOfFields++;
    }
  }
  quitarCampo(createButton?: boolean) {
    if (this.emailsForReportingForm.length > 0) {
      this.emailsForReportingForm.removeAt(this.emailsForReportingForm.length - 1);
      if (!createButton) {
        this.numberOfFields--;
      }
    }
  }
  quitarCampoParticular(index: number): void {
    this.emailsForReportingForm.removeAt(index);
    this.numberOfFields--;
  }
  onNumberOfFieldsChange() {
    if (Number.isInteger(this.numberOfFields) && this.numberOfFields >= 0) {
      // quitar campos hasta que el número de campos sea igual al número de campos en el formulario
      while (this.emailsForReportingForm.length > this.numberOfFields) {
        this.quitarCampo(true);
      }
      // agregar campos hasta que el número de campos sea igual al número de campos en el formulario
      while (this.emailsForReportingForm.length < this.numberOfFields) {
        this.agregarCampo(true);
      }
    }
  }
  get emailsForReportingForm() {
    return this.userForm.get('emails_for_reporting') as FormArray;
  }


  private resetearFormulario() {
    this.userForm.reset();
    this.userForm.get('username').setErrors(null);
    this.userForm.get('email').setErrors(null);
    this.userForm.get('phone').setErrors(null);
    this.userNameExists = false;
    this.emailExists = false;
    this.phoneExists = false;
  }

  private getUser() {
    this.loadingGetForm = true;
    this.newService.getUser(this.idUser).pipe(
      finalize(() => {
        this.loadingGetForm = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.role_id_button_table = res.role_id;

        this.userGetted = {
          username: res.username,
          firstname: res.firstname,
          lastname: res.lastname,
          password: null,
          email: res.email,
          date_of_birth: new Date(res.date_of_birth),
          gender_id: res.gender_id,
          role_id: res.role_id,
          phone: res.phone,
          client_id: res.client_id,
          emails_for_reporting: res.emails_for_reporting
        }

        this.userForm.patchValue({
          username: res.username,
          firstname: res.firstname,
          lastname: res.lastname,
          email: res.email,
          date_of_birth: new Date(res.date_of_birth),
          gender_id: res.gender_id,
          role_id: res.role_id,
          phone: res.phone,
          client_id: res.client_id,
          emails_for_reporting: res.emails_for_reporting
        });

        // agregar campos de productos
        for (let i = 0; i < res.emails_for_reporting.length; i++) {
          this.agregarCampo(true);
          const control = this.emailsForReportingForm.controls[i];
          control.get('email').setValue(res.emails_for_reporting[i].email);
        }

        this.numberOfFields = res.emails_for_reporting.length;

        // Si se obtiene un usuario, desactivar el validador required para role_id y password
        this.userForm.get('role_id').setValidators([]);
        this.userForm.get('password').setValidators([]);
        this.userForm.get('emails_for_reporting').updateValueAndValidity();

        // Si role_id es 2, entonces client_id debe tener validators.required
        if (res.role_id === 2 && res.client_id === null) {
          this.userForm.get('client_id').setValidators([Validators.required]);
        }
        // else {
        //   this.userForm.get('client_id').disable();
        // }
        // Actualizar la validez de los campos de formulario
        this.userForm.get('username').updateValueAndValidity();
        this.userForm.get('email').updateValueAndValidity();
        this.userForm.get('phone').updateValueAndValidity();
        this.userForm.get('firstname').updateValueAndValidity();
        this.userForm.get('gender_id').updateValueAndValidity();
        this.userForm.get('role_id').updateValueAndValidity();
        this.userForm.get('client_id').updateValueAndValidity();
        this.userForm.get('date_of_birth').updateValueAndValidity();

        this.userForm.get('password').disable();
        this.userForm.get('role_id').disable();

      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('edit_user_snack_get_error'));
      }
    });
  }

  private getRoles() {
    this.loadingGetRoles = true;
    this.newService.getRoles().subscribe({
      next: (res) => {
        this.roles = res;
        this.loadingGetRoles = false;
        this.checkLoadingGet();
      },
      error: (error) => {
        console.error(error);
        this.loadingGetRoles = false;
        this.checkLoadingGet();
      }
    });
  }

  private getClients() {
    this.loadingGetClients = true;
    this.newService.getClients().pipe(
      finalize(() => {
        this.loadingGetClients = false;
        this.checkLoadingGet();
      })
    ).subscribe({
      next: (res) => {
        this.clients = res;
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('new_user_input_client_error_get'));
      }
    });
  }

  private getGender(language: string, id?: number) {
    this.loadingGetGender = true;
    this.authService.getGender(language, id).subscribe({
      next: (res) => {
        this.genders = res;
        this.loadingGetGender = false;
        this.checkLoadingGet();
      },
      error: (error) => {
        console.error(error);
        this.loadingGetGender = false;
        this.checkLoadingGet();
      }
    });
  }

  private updateUserNameExists(nombre: string) {
    if (this.idUser && this.userGetted.username === nombre) {
      this.userNameExists = false;
      this.userForm.get('username').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingUserNameExists = true;
      this.authService.getUserNameExists(nombre).pipe(
        finalize(() => {
          this.loadingUserNameExists = false;
        })
      ).subscribe({
        next: (res) => {
          if (res) {
            this.userNameExists = true;
          } else {
            this.userNameExists = false;
          }
          this.userForm.get('username').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  private updateEmailExists(nombre: string) {
    if (this.idUser && this.userGetted.email === nombre) {
      this.emailExists = false;
      this.userForm.get('email').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingEmailExists = true;
      this.authService.getEmailExists(nombre).pipe(
        finalize(() => {
          this.loadingEmailExists = false;
        })
      ).subscribe({
        next: (res) => {
          if (res) {
            this.emailExists = true;
          } else {
            this.emailExists = false;
          }
          this.userForm.get('email').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  private updatePhoneExists(nombre: string) {
    if (this.idUser && this.userGetted.phone === nombre) {
      this.phoneExists = false;
      this.userForm.get('phone').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
    } else {
      this.loadingPhoneExists = true;
      this.authService.getPhoneExists(nombre).pipe(
        finalize(() => {
          this.loadingPhoneExists = false;
        })
      ).subscribe({
        next: (res) => {
          if (Array.isArray(res) && res.length > 0) {
            this.phoneExists = true;
          } else {
            this.phoneExists = false;
          }
          this.userForm.get('phone').updateValueAndValidity({ emitEvent: false }); // para que no lo detecte el valueChanges
        },
        error: (error) => {
          console.error(error);
        }
      });
    }
  }

  // Actualizar el valor para cambiar boton para ver tabla correspondiente
  private updateRoleIdButtonTable(id: number) {
    this.role_id_button_table = id;
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

  private validatePhone(): ValidationErrors | null {
    if (this.phoneExists) {
      return { 'invalidPhone': true };
    }
    return null;
  }

  private checkLoadingGet() {
    if (!this.loadingGetForm && !this.loadingGetRoles && !this.loadingGetClients && !this.loadingGetGender) {
      this.loadingGet = false;
    }
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
      phone: [null, [Validators.minLength(10), Validators.maxLength(10), () => this.validatePhone()]],
      client_id: [null],
      emails_for_reporting: this.formBuilder.array([])
    });
  }

}
