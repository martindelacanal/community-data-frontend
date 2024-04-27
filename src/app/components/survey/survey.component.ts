import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { SurveyModifyCheckbox } from 'src/app/models/survey/survey-modify-checkbox';
import { SurveyQuestion } from 'src/app/models/survey/survey-question';
import { SurveyService } from 'src/app/services/survey/survey.service';
import { Location } from 'src/app/models/map/location';
import { DeliveryService } from 'src/app/services/deliver/delivery.service';
import { SurveyAnswer } from 'src/app/models/survey/survey-answer';
import { AnswerType } from 'src/app/models/survey/answer-type';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  @ViewChild('footer', { read: ElementRef }) footer: ElementRef;

  public surveyQuestionForm: FormGroup;
  public surveyAnswerForm: FormGroup;
  public surveyLocationForm: FormGroup;
  public loadingSubmitQuestion: boolean = false;
  public loadingSubmitAnswers: boolean = false;
  public loadingSubmitLocations: boolean = false;
  public surveyQuestions: SurveyQuestion[] = [];
  public loadingQuestions: boolean = false;
  private lastAnswerId: number = null;
  private lastAnswerIdQuestionForm: number = 0;

  answerTypes: AnswerType[] = [];
  locations: Location[] = [];
  locationsFiltered: Location[] = [];
  answersFromQuestionDepends: SurveyAnswer[] = [];

  selectAllTextLocations = 'Select all';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private surveyService: SurveyService,
    private deliveryService: DeliveryService,
  ) {
    this.buildSurveyQuestionForm();
    this.buildSurveyAnswerForm();
    this.buildSurveyLocationForm();
  }

  ngOnInit(): void {
    this.getSurveyQuestions(this.translate.currentLang);
    this.getLocations();
    this.getAnswerTypes();
  }

  onSubmitAnswer() {
    if (this.surveyAnswerForm.valid) {
      this.loadingSubmitAnswers = true;
      this.surveyService.postSurveyAnswer(this.surveyAnswerForm.value).pipe(
        finalize(() => {
          this.loadingSubmitAnswers = false;
        })
      ).subscribe({
        next: (res) => {
          this.openSnackBar(this.translate.instant('survey_snack_message_answer'));
          // agregar al surveyQuestions la nueva respuesta
          let question = this.surveyQuestions.find((question) => question.id === this.surveyAnswerForm.get('question_id').value);
          let answers = this.surveyAnswerForm.get('answers').value;
          answers.forEach((answer) => {
            question.answers.push({
              question_id: question.id,
              id: answer.id,
              name: answer.name,
              name_es: answer.name_es,
              enabled: 'Y',
              loading: 'N'
            });
          });
          this.surveyAnswerForm.get('question_id').setValue(null);
          this.answersForm.clear();
          this.lastAnswerId = null;
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar(this.translate.instant('survey_snack_message_error'));
        }
      });
    } else {
      this.openSnackBar(this.translate.instant('survey_snack_message_form_error'));
    }
  }

  onSubmitLocation() {
    if (this.surveyLocationForm.valid) {
      this.loadingSubmitLocations = true;

      // si en el array de ids de surveyLocationForm (locations) hay uno con valor 0, se elimina
      let locations = this.surveyLocationForm.get('locations').value;

      if (locations) {
        let index = locations.indexOf(0);
        if (index > -1) {
          locations.splice(index, 1);
        }
        this.surveyLocationForm.get('locations').setValue(locations);
      }

      this.surveyService.postSurveyLocation(this.surveyLocationForm.value).pipe(
        finalize(() => {
          this.loadingSubmitLocations = false;
        })
      ).subscribe({
        next: (res) => {
          this.openSnackBar(this.translate.instant('survey_snack_message_location'));
          // actualizar las locaciones la pregunta actual y de sus preguntas padre
          this.updateFatherQuestionsLocations(this.surveyLocationForm.get('question_id').value, this.surveyLocationForm.get('locations').value);
          this.surveyLocationForm.get('question_id').setValue(null);
          this.surveyLocationForm.get('locations').setValue(null);
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar(this.translate.instant('survey_snack_message_error'));
        }
      });
    } else {
      this.openSnackBar(this.translate.instant('survey_snack_message_form_error'));
    }
  }

  onSubmitQuestion() {
    if (this.surveyQuestionForm.valid) {
      this.loadingSubmitQuestion = true;

      // si en el array de ids de surveyQuestionForm (locations) hay uno con valor 0, se elimina
      let locations = this.surveyQuestionForm.get('locations').value;

      if (locations && locations.length > 0) {
        let index = locations.indexOf(0);
        if (index > -1) {
          locations.splice(index, 1);
        }
        this.surveyQuestionForm.get('locations').setValue(locations);
      }

      this.surveyService.postSurveyQuestion(this.surveyQuestionForm.value).pipe(
        finalize(() => {
          this.loadingSubmitQuestion = false;
        })
      ).subscribe({
        next: (res) => {
          this.openSnackBar(this.translate.instant('survey_snack_message_question'));

          this.surveyQuestionForm.get('id').setValue(res['id']);

          // agregar la nueva pregunta al surveyQuestions
          let question = this.surveyQuestionForm.value;
          question.id = res['id'];
          question.enabled = 'Y';
          question.loading = 'N';
          question.answer_type = this.answerTypes.find((answerType) => answerType.id === question.answer_type_id).name;
          if (question.answer_type_id === 3 || question.answer_type_id === 4) {
            question.answers = this.surveyQuestionForm.get('answers').value.map((answer) => {
              return {
                question_id: question.id,
                id: answer.id,
                name: answer.name,
                name_es: answer.name_es,
                enabled: 'Y',
                loading: 'N'
              };
            });
          } else {
            question.answers = [];
          }

          // se guarda vacio pero luego se actualiza con las locaciones
          question.locations = [];

          this.surveyQuestions.push(question);

          // actualizar las locaciones de sus preguntas padre
          if (this.surveyQuestionForm.get('locations').value && this.surveyQuestionForm.get('locations').value.length > 0) {
            this.updateFatherQuestionsLocations(this.surveyQuestionForm.get('id').value, this.surveyQuestionForm.get('locations').value);
          }

          this.surveyQuestionForm.reset();
          this.answersQuestionForm.clear();
          this.surveyQuestionForm.get('locations').setValue(null);
          this.answersFromQuestionDepends = [];
          this.lastAnswerIdQuestionForm = 0;
          // quitar el validator required de depends_on_answer_id
          this.surveyQuestionForm.get('depends_on_answer_id').clearValidators();
          // actualizar validadores
          this.surveyQuestionForm.get('depends_on_answer_id').updateValueAndValidity();
        },
        error: (error) => {
          console.error(error);
          this.openSnackBar(this.translate.instant('survey_snack_message_error'));
        }
      });
    } else {
      this.openSnackBar(this.translate.instant('survey_snack_message_form_error'));
    }
  }

  toggleCheckbox(event, question, answer?, location?) {
    this.loadingQuestions = true;
    let objectToModify: SurveyModifyCheckbox = {
      question_id: null,
      answer_id: null,
      location_id: null,
      enabled: null
    };

    let elementModified = null;

    if (answer) {
      // Activar o desactivar respuesta
      objectToModify.question_id = question.id;
      objectToModify.answer_id = answer.id;
      objectToModify.enabled = event.checked ? 'Y' : 'N';

      elementModified = "answer";
      answer.loading = 'Y';

      // si salio correcta la modificacion, se activa o desactiva el checkbox de la respuesta
      answer.enabled = event.checked ? 'Y' : 'N';
    } else {
      if (location) {
        // Activar o desactivar locación
        objectToModify.question_id = question.id;
        objectToModify.location_id = location.id;
        objectToModify.enabled = event.checked ? 'Y' : 'N';

        elementModified = "location";
        location.loading = 'Y';

        // si salio correcta la modificacion, se activa o desactiva el checkbox de la locación
        location.enabled = event.checked ? 'Y' : 'N';
      } else {
        // Activar o desactivar pregunta
        objectToModify.question_id = question.id;
        objectToModify.enabled = event.checked ? 'Y' : 'N';

        elementModified = "question";
        question.loading = 'Y';

        // si salio correcta la modificacion, se activa o desactiva el checkbox de la pregunta
        question.enabled = event.checked ? 'Y' : 'N';

        // Si la pregunta se intenta activar, pero depende de una pregunta o respuesta desactivada, informar error
        let hasErrorQuestionDisabled = false;
        let hasErrorAnswerDisabled = false;
        if (question.depends_on_question_id && event.checked) {
          for (let questionReview of this.surveyQuestions) {
            if (questionReview.id === question.depends_on_question_id && questionReview.enabled === 'N') {
              hasErrorQuestionDisabled = true;
              break;
            } else {
              if (questionReview.id === question.depends_on_question_id && (questionReview.answer_type_id === 3 || questionReview.answer_type_id === 4) && questionReview.answers) {
                for (let answer of questionReview.answers) {
                  if (answer.id === question.depends_on_answer_id && answer.enabled === 'N') {
                    hasErrorAnswerDisabled = true;
                    break;
                  }
                }
              }
            }
            if (hasErrorQuestionDisabled || hasErrorAnswerDisabled) {
              break;
            }
          }
        }

        if (hasErrorQuestionDisabled || hasErrorAnswerDisabled) {
          setTimeout(() => {
            question.enabled = 'N';
          }, 0);
          question.loading = 'N';
          if (hasErrorQuestionDisabled) {
            this.openSnackBar(this.translate.instant('survey_snack_message_error_question_depends_disabled'));
            this.loadingQuestions = false;
            return;
          } else {
            if (hasErrorAnswerDisabled) {
              this.openSnackBar(this.translate.instant('survey_snack_message_error_question_depends_answer_disabled'));
              this.loadingQuestions = false;
              return;
            }
          }
        }

      }
    }

    this.surveyService.postToggleCheckbox(objectToModify).pipe(
      finalize(() => {
        this.loadingQuestions = false;
        switch (elementModified) {
          case "answer":
            answer.loading = 'N';
            break;
          case "location":
            location.loading = 'N';
            break;
          case "question":
            question.loading = 'N';
            break;
          default:
            break;
        }
      })
    ).subscribe({
      next: (res) => {
        switch (elementModified) {
          case "answer":
            // buscar las preguntas que dependen de esta pregunta y respuesta y actualizar su enabled
            this.surveyQuestions.forEach((questionReview) => {
              if (questionReview.depends_on_question_id === question.id && questionReview.depends_on_answer_id === answer.id) {
                questionReview.enabled = event.checked ? 'Y' : 'N';
                this.updateChildQuestionsCheckbox(questionReview.id, questionReview.enabled);
              }
            });
            this.openSnackBar(this.translate.instant('survey_snack_message_answer'));
            break;
          case "location":
            this.openSnackBar(this.translate.instant('survey_snack_message_location'));
            break;
          case "question":
            // buscar las preguntas que dependen de esta pregunta y actualizar su enabled
            this.surveyQuestions.forEach((questionReview) => {
              if (questionReview.depends_on_question_id === question.id) {
                questionReview.enabled = event.checked ? 'Y' : 'N';
                this.updateChildQuestionsCheckbox(questionReview.id, questionReview.enabled);
              }
            });
            this.openSnackBar(this.translate.instant('survey_snack_message_question'));
            break;
          default:
            break;
        }
      },
      error: (error) => {
        console.error(error);
        this.openSnackBar(this.translate.instant('survey_snack_message_error'));
        switch (elementModified) {
          case "answer":
            answer.enabled = event.checked ? 'N' : 'Y';
            break;
          case "location":
            location.enabled = event.checked ? 'N' : 'Y';
            break;
          case "question":
            question.enabled = event.checked ? 'N' : 'Y';
            break;
          default:
            break;
        }
      }
    });
  }

  agregarCampoAnswer(question: SurveyQuestion) {
    if (!this.surveyAnswerForm.get('question_id').value) {
      this.surveyAnswerForm.get('question_id').setValue(question.id);
    } else {
      if (this.surveyAnswerForm.get('question_id').value !== question.id) {
        // si se cambio de pregunta, resetear los valores
        this.surveyAnswerForm.get('question_id').setValue(question.id);
        this.answersForm.clear();
        this.lastAnswerId = null;
      }
    }
    if (!this.lastAnswerId) {
      this.lastAnswerId = question.answers[question.answers.length - 1].id;
    }
    this.answersForm.push(this.formBuilder.group({
      id: [this.lastAnswerId + 1],
      name: [null, Validators.required],
      name_es: [null, Validators.required],
    }));
    this.lastAnswerId++;
  }
  quitarCampoAnswer(question: SurveyQuestion) {
    if (this.answersForm.length > 0) {
      this.answersForm.removeAt(this.answersForm.length - 1);
    }
    // si el tamaño del formArray es 0, se reinician los contadores
    if (this.answersForm.length === 0) {
      this.lastAnswerId = null;
      this.surveyAnswerForm.get('question_id').setValue(null);
    } else {
      this.lastAnswerId--;
    }
  }

  get answersForm() {
    return this.surveyAnswerForm.get('answers') as FormArray;
  }

  modifyLocationsFiltered(event, question) {
    this.locationsFiltered = this.locations.filter((location) =>
      question.locations ? !question.locations.some(qLocation => qLocation.id === location.id) : true
    );
  }

  haveFullLocations(question: SurveyQuestion) {
    return (question.locations && (question.locations.length === this.locations.length));
  }

  canMyQuestionReserveAddLocation(question: SurveyQuestion) {
    return this.surveyLocationForm.get('question_id').value === null || this.surveyLocationForm.get('question_id').value === question.id;
  }

  toggleAllSelection(matSelect: MatSelect, surveyLocation: boolean, question?: SurveyQuestion) {
    const isSelected: boolean = matSelect.options
      // The "Select All" item has the value 0, so find that one
      .filter((item: MatOption) => item.value === 0)
      // Get the value of the property 'selected' (this tells us whether "Select All" is selected or not)
      .map((item: MatOption) => item.selected)
    // Get the first element (there should only be 1 option with the value 0 in the select)
    [0];

    if (isSelected) {
      matSelect.options.forEach((item: MatOption) => item.select());
      this.selectAllTextLocations = this.translate.instant('metrics_filters_button_clear_all');
    } else {
      matSelect.options.forEach((item: MatOption) => item.deselect());
      this.selectAllTextLocations = this.translate.instant('metrics_filters_button_select_all');
    }

    if (surveyLocation) {
      this.saveQuestionLocation(question);
    }
  }

  saveQuestionLocation(question: SurveyQuestion) {
    if (!this.surveyLocationForm.get('question_id').value) {
      this.surveyLocationForm.get('question_id').setValue(question.id);
    } else {
      if (this.surveyLocationForm.get('question_id').value !== question.id) {
        // si se cambio de pregunta, resetear los valores
        this.surveyLocationForm.get('question_id').setValue(question.id);
        this.surveyLocationForm.get('locations').setValue(null);
      } else {
        // si locations esta vacio, se borra el valor de question_id
        if (this.surveyLocationForm.get('locations').value.length === 0) {
          this.surveyLocationForm.get('question_id').setValue(null);
        }
      }
    }
  }

  scrollAddQuestion() {
    this.footer.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  private updateFatherQuestionsLocations(questionId: number, locationsToFather: number[]) {
    let question = this.surveyQuestions.find((question) => question.id === questionId);
    let newLocations = locationsToFather.map((location_id) => {
      let location = this.locations.find((location) => location.id === location_id);
      return {
        question_id: question.id,
        id: location_id,
        name: location.community_city,
        enabled: 'Y',
        loading: 'N'
      };
    });
    newLocations.forEach(newLocation => {
      if (!question.locations.some(location => location.id === newLocation.id)) {
        question.locations.push(newLocation);
      }
    });
    if (question.depends_on_question_id) {
      this.updateFatherQuestionsLocations(question.depends_on_question_id, locationsToFather);
    }
  }

  private updateChildQuestionsCheckbox(questionId: number, enabled: string) {
    this.surveyQuestions.forEach((questionReview) => {
      if (questionReview.depends_on_question_id === questionId) {
        questionReview.enabled = enabled;
        this.updateChildQuestionsCheckbox(questionReview.id, enabled);
      }
    });
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.router.navigate(['/survey']);
  }

  private getSurveyQuestions(language: string) {
    this.loadingQuestions = true;
    this.surveyService.getSurveyQuestions(language).pipe(
      finalize(() => {
        this.loadingQuestions = false;
      })
    ).subscribe({
      next: (res) => {
        this.surveyQuestions = res;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getLocations() {
    this.deliveryService.getLocations().subscribe(
      (res) => {
        this.locations = res;
      }
    );
  }

  private getAnswerTypes() {
    this.surveyService.getAnswerTypes().subscribe(
      (res) => {
        this.answerTypes = res;
      }
    );
  }

  public saveAnswersFromQuestionDepends(question: SurveyQuestion) {
    // limpiar el campo depends_on_answer_id del formulario
    this.surveyQuestionForm.get('depends_on_answer_id').setValue(null);
    // debe ser obligatorio seleccionar una respuesta
    this.surveyQuestionForm.get('depends_on_answer_id').setValidators(Validators.required);
    // actualizar validadores
    this.surveyQuestionForm.get('depends_on_answer_id').updateValueAndValidity();

    this.answersFromQuestionDepends = [];
    // guardar las respuestas de la pregunta padre
    this.answersFromQuestionDepends = question.answers;
  }

  onSelectionAnswerTypeQuestionFormChange(selectedValue: number) {
    // si es simple option (3) o multiple option (4) hay que agregar los campos de respuestas
    if (selectedValue === 3 || selectedValue === 4) {
      this.lastAnswerIdQuestionForm = 0;
      this.answersQuestionForm.clear();
      this.agregarCampoAnswerQuestionForm();
    } else {
      this.answersQuestionForm.clear();
    }
  }

  agregarCampoAnswerQuestionForm() {
    this.answersQuestionForm.push(this.formBuilder.group({
      id: [this.lastAnswerIdQuestionForm + 1],
      name: [null, Validators.required],
      name_es: [null, Validators.required],
    }));
    this.lastAnswerIdQuestionForm++;
  }
  quitarCampoAnswerQuestionForm() {
    if (this.answersQuestionForm.length > 0) {
      this.answersQuestionForm.removeAt(this.answersQuestionForm.length - 1);
    }
    // si el tamaño del formArray es 0, se reinician los contadores
    if (this.answersQuestionForm.length === 0) {
      this.lastAnswerIdQuestionForm = 0;
    } else {
      this.lastAnswerIdQuestionForm--;
    }
  }

  get answersQuestionForm() {
    return this.surveyQuestionForm.get('answers') as FormArray;
  }

  get locationsQuestionForm() {
    return this.surveyQuestionForm.get('locations') as FormArray;
  }

  private buildSurveyQuestionForm(): void {
    this.surveyQuestionForm = this.formBuilder.group({
      id: [null],
      name: [null, Validators.required],
      name_es: [null, Validators.required],
      depends_on_question_id: [null],
      depends_on_answer_id: [null],
      answer_type_id: [null, Validators.required],
      answers: this.formBuilder.array([]),
      locations: [null]
    });
  }

  private buildSurveyAnswerForm(): void {
    this.surveyAnswerForm = this.formBuilder.group({
      question_id: [null],
      answers: this.formBuilder.array([])
    });
  }

  private buildSurveyLocationForm(): void {
    this.surveyLocationForm = this.formBuilder.group({
      question_id: [null],
      locations: [null, Validators.required]
    });
  }

}
