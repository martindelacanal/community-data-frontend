import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, debounceTime, map } from 'rxjs';
import { RegisterAnswer } from 'src/app/models/login/register-answer';
import { RegisterQuestion } from 'src/app/models/login/register-question';
import { Usuario } from 'src/app/models/login/usuario';
import { Ethnicity } from 'src/app/models/user/ethnicity';
import { Gender } from 'src/app/models/user/gender';
import { AuthService } from 'src/app/services/login/auth.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { DisclaimerRegisterComponent } from '../../dialog/disclaimer-register/disclaimer-register/disclaimer-register.component';
import { Location } from 'src/app/models/map/location';
import { DisclaimerRegisterLocationComponent } from '../../dialog/disclaimer-register-location/disclaimer-register-location.component';

@Component({
  selector: 'app-formulario-registro',
  templateUrl: './formulario-registro.component.html',
  styleUrls: ['./formulario-registro.component.scss'],
})


export class FormularioRegistroComponent implements OnInit {

  stepperOrientation: Observable<StepperOrientation>;

  private usuario: Usuario;
  private firstExecuteComponent: boolean = true;
  public loading: boolean = false;
  public loadingGender: boolean = false;
  public loadingEthnicity: boolean = false;
  public submitted = false;
  public loginValid: boolean = true;
  public loginForm: FormGroup;
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;
  public combinedFormGroup: FormGroup;
  public registerQuestions: RegisterQuestion[] = [];
  public loadingRegisterQuestions: boolean = false;
  public selectedLanguage: string;
  locations: Location[] = [];
  userNameExists: boolean = false;
  phoneExists: boolean = false;
  emailExists: boolean = false;

  isLinear = true;
  genders: Gender[];
  ethnicities: Ethnicity[];
  otroEthnicity: Ethnicity;
  input1s: string[] = ['Yes', 'No'];
  input2s: string[] = ['Yes', 'No'];
  input3s: string[] = ['IEHP', 'Health Net', 'Kaiser', 'Molina', 'Other'];
  input4s: string[] = ['Yes', 'No'];
  input5s: string[] = ['Primary care', 'Dental care', 'Laboratory and diagnostic care', 'Prenatal care', 'Pharmaceutical care', 'Chronic conditions care (i.e. diabetes, high blood pressure, etc.)', 'Nutritional support', 'Physical and occupational therapy', 'Mental health care', 'Substance abuse treatment', 'Others'];
  input7s: string[] = ['Yes', 'No'];
  input8s: string[] = ['Education-Training', 'Housing', 'Immigration', 'Legal', 'Taxes', 'Others'];

  constructor(
    private decodificadorService: DecodificadorService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private dialog: MatDialog,
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    this.genders = [];
    this.ethnicities = [];
    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    translate.use(localStorage.getItem('language') || 'en');
    this.usuario = this.decodificadorService.getUsuario();

    this.buildForm();
    this.buildFirstFormGroup();
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

    this.disclaimer();

    this.firstFormGroup.get('username').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateUserNameExists(res);
        }
      );
    this.firstFormGroup.get('phone').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updatePhoneExists(res);
        }
      );
    this.firstFormGroup.get('email').valueChanges
      .pipe(debounceTime(300))
      .subscribe(
        (res) => {
          this.updateEmailExists(res);
        }
      );

    this.getGender(this.translate.currentLang);
    this.getEthnicity(this.translate.currentLang);
    this.getRegisterQuestions(this.translate.currentLang);
    this.getLocations();

    this.translate.onLangChange.subscribe(() => {
      if (this.firstExecuteComponent) {
        this.firstExecuteComponent = false;
      } else {
        this.genders = [];
        this.ethnicities = [];
        this.getGender(this.translate.currentLang);
        this.getEthnicity(this.translate.currentLang);
        this.getRegisterQuestions(this.translate.currentLang);
      }
    });

    this.firstFormGroup.get('destination').valueChanges.subscribe(
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

  onSubmit(): void {
    if (this.combinedFormGroup.valid) {
      this.loading = true;
      // Obtener la fecha del formulario
      const date = new Date(this.firstFormGroup.value.dateOfBirth);
      // Convertir la fecha a un string en formato ISO 8601 y obtener solo la parte de la fecha
      const dateString = date.toISOString().slice(0, 10);
      // Asignar la fecha al campo de fecha en el formulario
      this.firstFormGroup.get('dateOfBirth').setValue(dateString);
      // Enviar para cada pregunta, el answer_type_id
      const answers = this.registerQuestions.map(question => {
        const answer = this.combinedFormGroup.value.secondFormGroup[question.id];
        if (question.answer_type_id === 4) {
          return { question_id: question.id, answer_type_id: question.answer_type_id, answer: answer.map(x => parseInt(x, 10)) };
        } else {
          return { question_id: question.id, answer_type_id: question.answer_type_id, answer: answer };
        }
      });
      // Crear objeto a enviar que contiene firstFormGroup.value y answers
      const combinedFormGroupValue = { firstForm: this.firstFormGroup.value, secondForm: answers };
      this.authService.signup(combinedFormGroupValue).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
          this.openSnackBar(this.translate.instant('register_snack_submitted'));
          this.router.navigate(['login']);
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          this.openSnackBar(this.translate.instant('register_snack_submitted_error'));
        }
      });
    } else {
      this.openSnackBar(this.translate.instant('register_snack_submitted_incomplete_error'));
    }
  }

  shouldShowQuestion(question: any): boolean {
    if (!question.depends_on_question_id) {
      return true;
    }
    const dependsOnValue = this.secondFormGroup.get(question.depends_on_question_id.toString()).value;
    if (!dependsOnValue) {
      return false;
    }
    if (Array.isArray(dependsOnValue)) {
      return dependsOnValue.includes(question.depends_on_answer_id);
    }
    return dependsOnValue === question.depends_on_answer_id;
  }

  onCheckboxChange(event: MatCheckboxChange, index: number, questionId: number) {
    const inputArray = this.secondFormGroup.get(questionId.toString()) as FormArray;
    if (event.checked) {
      inputArray.push(this.formBuilder.control(this.getAnswersForQuestion(questionId)[index].id));
    } else {
      const indexFiltered = inputArray.controls.findIndex(x => x.value === this.getAnswersForQuestion(questionId)[index].id);
      inputArray.removeAt(indexFiltered);
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

  limitInputHouseholdSizeLength(event: any) {
    const maxLength = 3;
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }

  private getRegisterQuestions(language: string) {
    this.authService.getRegisterQuestions(language).subscribe({
      next: (res) => {
        this.registerQuestions = res;
        this.buildSecondFormGroup();
        this.buildCombinedFormGroup();
      },
      error: (error) => {
        console.error(error);
      }
    });
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

  private getEthnicity(language: string, id?: number) {
    this.loadingEthnicity = true;
    this.authService.getEthnicity(language, id).subscribe({
      next: (res) => {
        this.ethnicities = res;
        this.otroEthnicity = this.ethnicities.find(e => e.name === 'Otros' || e.name === 'Others' || e.name === 'Otro' || e.name === 'Other');
        this.loadingEthnicity = false;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getLocations() {
    this.authService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
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

  private updatePhoneExists(nombre: string) {
    this.authService.getPhoneExists(nombre).subscribe(
      (res) => {
        if (res) {
          this.phoneExists = true;
        } else {
          this.phoneExists = false;
        }
        this.firstFormGroup.get('phone').updateValueAndValidity();
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
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
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
      phone: [null, [Validators.required, () => this.validatePhone()]],
      zipcode: [null],
      destination: [null, Validators.required],
      householdSize: [null, Validators.required],
      gender: [null, Validators.required],
      ethnicity: [null, Validators.required],
      otherEthnicity: [null],
    });

    // Agregar un observador al campo 'ethnicity'
    this.firstFormGroup.get('ethnicity').valueChanges.subscribe(value => {
      if (this.otroEthnicity && value === this.otroEthnicity.id) {
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

  getAnswersForQuestion(questionId: number): RegisterAnswer[] {
    const question = this.registerQuestions.find(x => x.id === questionId);
    return question ? question.answers : [];
  }

  getChildrenQuestions(question: RegisterQuestion): RegisterQuestion[] {
    const childrenQuestions = this.registerQuestions.filter(x => x.depends_on_question_id === question.id);
    let result = [...childrenQuestions];
    for (const child of childrenQuestions) {
      result = [...result, ...this.getChildrenQuestions(child)];
    }
    return result;
  }

  private buildSecondFormGroup(): void {
    this.loadingRegisterQuestions = true;

    const formGroup = this.registerQuestions.reduce((group, control) => {
      if (control.answer_type_id === 4) {
        group[control.id] = this.formBuilder.array([], [Validators.required]);
      } else {
        group[control.id] = [null, Validators.required];
      }
      return group;
    }, {});

    this.secondFormGroup = this.formBuilder.group(formGroup);

    for (let i = 0; i < this.registerQuestions.length; i++) {
      // obtener en un array las preguntas que dependen de la pregunta actual
      const dependsOnQuestionIds = this.registerQuestions.filter(x => x.depends_on_question_id === this.registerQuestions[i].id);

      if (dependsOnQuestionIds.length > 0) {
        // Si tiene preguntas que dependan de la pregunta actual, agregar un observador al campo de la pregunta actual
        this.secondFormGroup.get(this.registerQuestions[i].id.toString()).valueChanges.subscribe(value => {

          var answerIds: number[] = []; // obtener los id de las respuestas seleccionadas
          if (this.registerQuestions[i].answer_type_id === 4) { // es un multiple option
            answerIds = value.map(x => parseInt(x, 10)); // value es un array de ids en string
          } else { // es un simple option
            answerIds.push(value); // value es un id
          }
          // obtener los id de las dependQuestionIds cuya depends_on_answer_id sea igual a alguno de los answerIds obtenidos
          const dependsOnQuestionIdsFiltered_selected = dependsOnQuestionIds.filter(x => answerIds.includes(x.depends_on_answer_id));
          // obtener los id de las dependQuestionIds cuyo depends_on_answer_id sea diferente a alguno de los answerIds obtenidos
          const dependsOnQuestionIdsFiltered_notselected = dependsOnQuestionIds.filter(x => !answerIds.includes(x.depends_on_answer_id));
          // setValidators a los campos de las dependsOnQuestionIdsFiltered_selected
          for (let j = 0; j < dependsOnQuestionIdsFiltered_selected.length; j++) {
            this.secondFormGroup.get(dependsOnQuestionIdsFiltered_selected[j].id.toString()).setValidators(Validators.required);
            this.secondFormGroup.get(dependsOnQuestionIdsFiltered_selected[j].id.toString()).updateValueAndValidity();
          }
          // setValidators a los campos de las dependOnQuestionIdsFiltered_notselected
          for (let j = 0; j < dependsOnQuestionIdsFiltered_notselected.length; j++) {
            if (dependsOnQuestionIdsFiltered_notselected[j].answer_type_id === 4) {
              (this.secondFormGroup.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()) as FormArray).clear();
            } else {
              this.secondFormGroup.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()).reset();
            }
            this.secondFormGroup.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()).clearValidators();
            this.secondFormGroup.get(dependsOnQuestionIdsFiltered_notselected[j].id.toString()).updateValueAndValidity();
            // hacer lo mismo con los hijos de las dependOnQuestionIdsFiltered_notselected
            const childrenQuestions = this.getChildrenQuestions(dependsOnQuestionIdsFiltered_notselected[j]);
            for (let k = 0; k < childrenQuestions.length; k++) {
              if (childrenQuestions[k].answer_type_id === 4) {
                (this.secondFormGroup.get(childrenQuestions[k].id.toString()) as FormArray).clear();
              } else {
                this.secondFormGroup.get(childrenQuestions[k].id.toString()).reset();
              }
              this.secondFormGroup.get(childrenQuestions[k].id.toString()).clearValidators();
              this.secondFormGroup.get(childrenQuestions[k].id.toString()).updateValueAndValidity();
            }
          }
        });
      }
    }

    this.loadingRegisterQuestions = false;

    // this.secondFormGroup = this.formBuilder.group({
    //   input1: [null, Validators.required],
    //   input2: [null, Validators.required],
    //   input3: [null, Validators.required],
    //   input4: [null, Validators.required],
    //   input5: this.formBuilder.array([], [Validators.required]),
    //   input6: [null, Validators.required],
    //   input7: [null, Validators.required],
    //   input8: this.formBuilder.array([], [Validators.required]),
    //   input9: [null, Validators.required],
    // });

    // this.secondFormGroup.get('input1').valueChanges.subscribe(value => {
    //   if (value === 'Yes') {
    //     // Si el valor es 'Yes', agregar el validador 'Validators.required' al campo 'input2' y 'input3'
    //     this.secondFormGroup.get('input2').setValidators(Validators.required);
    //     this.secondFormGroup.get('input3').setValidators(Validators.required);
    //   } else {
    //     // De lo contrario, eliminar el validador
    //     this.secondFormGroup.get('input2').reset(); // si input2 es un opcion simple
    //     this.secondFormGroup.get('input3').reset(); // si input3 es un opcion simple
    //     this.secondFormGroup.get('input2').clearValidators();
    //     this.secondFormGroup.get('input3').clearValidators();
    //   }
    //   // Actualizar el estado del campo 'input2' y 'input3'
    //   this.secondFormGroup.get('input2').updateValueAndValidity();
    //   this.secondFormGroup.get('input3').updateValueAndValidity();
    // });


    // this.secondFormGroup.get('input4').valueChanges.subscribe(value => {
    //   if (value === 'Yes') {
    //     // Si el valor es 'Yes', agregar el validador 'Validators.required' al campo 'input5' y 'input6'
    //     this.secondFormGroup.get('input5').setValidators(Validators.required);
    //   } else {
    //     // De lo contrario, eliminar el validador y limpiar los valores del campo 'input5' y 'input6'
    //     (this.secondFormGroup.get('input5') as FormArray).clear(); // si input5 es un opcion multiple
    //     this.secondFormGroup.get('input6').reset(); // si input6 es campo de texto
    //     this.secondFormGroup.get('input5').clearValidators();
    //     this.secondFormGroup.get('input6').clearValidators();
    //   }
    //   // Actualizar el estado del campo 'input5' y 'input6'
    //   this.secondFormGroup.get('input5').updateValueAndValidity();
    //   this.secondFormGroup.get('input6').updateValueAndValidity();
    // });
    // this.secondFormGroup.get('input5').valueChanges.subscribe(value => {
    //   if (value.includes('Others')) {
    //     // Si el valor es 'Others', agregar el validador 'Validators.required' al campo 'input6'
    //     this.secondFormGroup.get('input6').setValidators(Validators.required);
    //   } else {
    //     // De lo contrario, eliminar el validador
    //     this.secondFormGroup.get('input6').reset(); // si input6 es campo de texto
    //     this.secondFormGroup.get('input6').clearValidators();
    //   }
    //   // Actualizar el estado del campo 'input6'
    //   this.secondFormGroup.get('input6').updateValueAndValidity();
    // }
    // );


    // this.secondFormGroup.get('input7').valueChanges.subscribe(value => {
    //   if (value === 'Yes') {
    //     // Si el valor es 'Yes', agregar el validador 'Validators.required' al campo 'input8' y 'input9'
    //     this.secondFormGroup.get('input8').setValidators(Validators.required);
    //   } else {
    //     // De lo contrario, eliminar el validador
    //     (this.secondFormGroup.get('input8') as FormArray).clear(); // si input8 es un opcion multiple
    //     this.secondFormGroup.get('input9').reset(); // si input9 es campo de texto
    //     this.secondFormGroup.get('input8').clearValidators();
    //     this.secondFormGroup.get('input9').clearValidators();
    //   }
    //   // Actualizar el estado del campo 'input8' y 'input9'
    //   this.secondFormGroup.get('input8').updateValueAndValidity();
    //   this.secondFormGroup.get('input9').updateValueAndValidity();
    // });
    // this.secondFormGroup.get('input8').valueChanges.subscribe(value => {
    //   if (value.includes('Others')) {
    //     // Si el valor es 'Others', agregar el validador 'Validators.required' al campo 'input9'
    //     this.secondFormGroup.get('input9').setValidators(Validators.required);
    //   } else {
    //     // De lo contrario, eliminar el validador
    //     this.secondFormGroup.get('input9').reset(); // si input9 es campo de texto
    //     this.secondFormGroup.get('input9').clearValidators();
    //   }
    //   // Actualizar el estado del campo 'input9'
    //   this.secondFormGroup.get('input9').updateValueAndValidity();
    // }
    // );
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

  private validatePhone(): ValidationErrors | null {
    if (this.phoneExists) {
      return { 'invalidPhone': true };
    }
    return null;
  }

  private validateEmail(): ValidationErrors | null {
    if (this.emailExists) {
      return { 'emailExists': true };
    }
    if (this.firstFormGroup && this.firstFormGroup.controls['email'].value !== null && this.firstFormGroup.controls['email'].value !== '') {
      const email = this.firstFormGroup.controls['email'].value;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { 'invalidEmail': true };
      }
    }
    return null;
  }

  private disclaimer(): void {
    const dialogRef = this.dialog.open(DisclaimerRegisterComponent, {
      width: '370px',
      data: '',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result.status) {
        this.router.navigate(['login']);
      }
    });
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
        this.firstFormGroup.get('destination').setValue(null);
      }
    });
  }

}
