import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';
import { SurveyModifyCheckbox } from 'src/app/models/survey/survey-modify-checkbox';
import { SurveyQuestion } from 'src/app/models/survey/survey-question';
import { SurveyService } from 'src/app/services/survey/survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {
  public surveyForm: FormGroup;
  public loading: boolean = false;
  public surveyQuestions: SurveyQuestion[] = [];
  public loadingQuestions: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
    private surveyService: SurveyService
  ) {
    this.buildSurveyForm();
  }

  ngOnInit(): void {
    this.getSurveyQuestions(this.translate.currentLang);
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      this.loading = true;

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
            this.openSnackBar(this.translate.instant('survey_snack_message_answer'));
            break;
          case "location":
            this.openSnackBar(this.translate.instant('survey_snack_message_location'));
            break;
          case "question":
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

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.router.navigate(['/survey']);
  }

  private getSurveyQuestions(language: string) {
    this.loadingQuestions = true;
    this.surveyService.getSurveyQuestions(language).subscribe({
      next: (res) => {
        this.surveyQuestions = res;
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        this.loadingQuestions = false;
      }
    });
  }

  private buildSurveyForm(): void {
    this.surveyForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }

}
