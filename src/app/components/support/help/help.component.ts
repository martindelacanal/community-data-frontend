import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HelpService } from 'src/app/services/help/help.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent {

  public helpForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private helpService: HelpService,
    public translate: TranslateService
  ) {
    this.buildHelpForm();
  }

  onSubmit() {
    if (this.helpForm.valid) {
      this.helpService.uploadMessage(this.helpForm.value).subscribe({
        next: (res) => {
          this.openSnackBar(this.translate.instant('help_snack_message'));
          this.resetearFormulario();
        },
        error: (error) => {
          console.log(error);
          this.openSnackBar(this.translate.instant('help_snack_message_error'));
        }
      });
    } else {
      this.openSnackBar(this.translate.instant('help_snack_message_form_error'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.router.navigate(['/help']);
  }

  private buildHelpForm(): void {
    this.helpForm = this.formBuilder.group({
      message: [null, Validators.required],
    });
  }

}
