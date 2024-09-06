import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { Location } from 'src/app/models/map/location';
import { MatDialog } from '@angular/material/dialog';
import { DisclaimerRegisterLocationComponent } from '../../dialog/disclaimer-register-location/disclaimer-register-location.component';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { RegisterQuestion } from 'src/app/models/login/register-question';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { RegisterAnswer } from 'src/app/models/login/register-answer';
import { DisclaimerRegisterComponent } from '../../dialog/disclaimer-register/disclaimer-register/disclaimer-register.component';

@Component({
  selector: 'app-beneficiary-home',
  templateUrl: './beneficiary-home.component.html',
  styleUrls: ['./beneficiary-home.component.scss']
})
export class BeneficiaryHomeComponent implements OnInit {

  title = 'app';
  elementType = 'url';
  value: string = null;
  errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  objeto: beneficiaryQR;
  locations: Location[] = [];
  public beneficiaryForm: FormGroup;
  public loading: boolean = false;
  public onBoarded: boolean = false;
  private remoteLocation: boolean = false;
  public userLocation: Location;
  public locationOrganizationSelected: string = '';
  public locationAddressSelected: string = '';
  public registerQuestions: RegisterQuestion[] = [];
  public secondFormGroup: FormGroup;

  constructor(
    private decodificadorService: DecodificadorService,
    private deliveryService: DeliveryService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private snackBar: MatSnackBar
  ) {
    this.buildBeneficiaryForm();

    this.objeto = {
      id: this.decodificadorService.getId(),
      role: this.decodificadorService.getRol(),
      date: new Date().toLocaleString(),
      location_id: 0,
      approved: 'N'
    };
    this.value = JSON.stringify(this.objeto);
  }

  ngOnInit(): void {
    this.getLocations();
    this.getUserStatus();
    this.getUserLocation();

    this.beneficiaryForm.get('destination').valueChanges.subscribe(
      (res) => {
        if (res) {
          if (this.remoteLocation) {
            this.remoteLocation = false;
          } else {
            const location = this.locations.find(l => l.id === res);
            if (location) {
              this.locationOrganizationSelected = location.organization;
              this.locationAddressSelected = location.address;
              this.disclaimerLocation(location.organization, location.address);
            }
          }
        }
      }
    );
  }

  postNewAnswers(): void {
    if (this.secondFormGroup.valid) {
      this.loading = true;

      // Enviar para cada pregunta, el answer_type_id
      const answers = this.registerQuestions.map(question => {
        const answer = this.secondFormGroup.get(question.id.toString()).value;
        if (question.answer_type_id === 4) {
          return { question_id: question.id, answer_type_id: question.answer_type_id, answer: answer.map(x => parseInt(x, 10)) };
        } else {
          return { question_id: question.id, answer_type_id: question.answer_type_id, answer: answer };
        }
      });
      this.deliveryService.postNewAnswers(answers, this.beneficiaryForm.get('destination').value).subscribe({
        next: (res) => {
          console.log(res);
          this.loading = false;
          this.openSnackBar(this.translate.instant('survey_snack_message_form_participant_onboard'));
          this.secondFormGroup.reset();
          this.registerQuestions = [];
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

  getAnswersForQuestion(questionId: number): RegisterAnswer[] {
    const question = this.registerQuestions.find(x => x.id === questionId);
    return question ? question.answers : [];
  }

  newQR() {
    this.objeto = {
      id: this.decodificadorService.getId(),
      role: this.decodificadorService.getRol(),
      date: new Date().toLocaleString(),
      location_id: this.beneficiaryForm.value.destination,
      approved: 'N'
    };
    this.value = JSON.stringify(this.objeto);
  }

  onBoard() {
    if (!this.onBoarded) {
      this.loading = true;
      this.onBoarded = true;
      this.deliveryService.onBoard(true, this.beneficiaryForm.value.destination).pipe(
        finalize(() => {
          this.newQR();
          this.loading = false;
        })
      ).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.userLocation = this.locations.find(location => location.id === this.beneficiaryForm.value.destination);
          this.locationAddressSelected = this.userLocation.address;
          this.locationOrganizationSelected = this.userLocation.organization;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded'));
        },
        error: (error) => {
          console.log(error);
          this.onBoarded = false;
          this.openSnackBar(this.translate.instant('delivery_snack_on_boarded_error'));
        }
      });
    } else {
      const dialogRef = this.dialog.open(DisclaimerRegisterComponent, {
        width: '370px',
        data: this.translate.instant('beneficiary_button_change_location_disclaimer'),
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        this.loading = true;
        if (result.status) {
          this.deliveryService.onBoard(false, this.beneficiaryForm.value.destination).pipe(
            finalize(() => {
              this.newQR();
              this.loading = false;
            })
          ).subscribe({
            next: (res) => {
              this.userLocation = null;
              this.onBoarded = false;
              this.openSnackBar(this.translate.instant('delivery_snack_off_boarded'));
            },
            error: (error) => {
              console.log(error);
              this.onBoarded = true;
              this.openSnackBar(this.translate.instant('delivery_snack_off_boarded_error'));
            }
          });
        } else {
          this.loading = false;
        }
      });
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
        if (res.id === 3) {
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
          this.locationAddressSelected = this.userLocation.address;
          this.locationOrganizationSelected = this.userLocation.organization;
          this.remoteLocation = true;
          this.beneficiaryForm.patchValue({
            destination: res.id
          });
          // get questions from location
          this.getQuestions(this.translate.currentLang, this.beneficiaryForm.get('destination').value);
        }
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
        this.beneficiaryForm.get('destination').setValue(null);
        this.locationOrganizationSelected = '';
        this.locationAddressSelected = '';
      } else {
        // get questions from location
        this.getQuestions(this.translate.currentLang, this.beneficiaryForm.get('destination').value);
      }
    });
  }

  private getQuestions(language: string, location_id: number) {
    this.loading = true;
    this.deliveryService.getQuestions(language, location_id).pipe(
      finalize(() => {
        this.loading = false;
        this.newQR();
      })
    ).subscribe({
      next: (res) => {
        this.registerQuestions = res;
        this.buildSecondFormGroup();
      },
      error: (error) => {
        console.error(error);
      }
    });
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

  }

  private buildBeneficiaryForm(): void {
    this.beneficiaryForm = this.formBuilder.group({
      destination: [null, Validators.required]
    });
  }
}
