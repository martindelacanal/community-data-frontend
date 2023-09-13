import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordForm } from 'src/app/models/settings/change-password-form.model';
import { SettingsService } from 'src/app/services/settings/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public passwordForm: FormGroup;
  public loadingPassword: boolean = false;
  public matchPasswords: boolean = true;
  public actualPasswordError: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private settingsService: SettingsService,
    public translate: TranslateService
  ) {
    translate.addLangs(['en', 'es']);
    translate.use(localStorage.getItem('language') || 'en');
    this.buildPasswordForm();
  }

  switchLang(lang: string) {
    this.translate.use(lang);
    // save in local storage
    localStorage.setItem('language', lang);
  }

  onSubmitPassword() {
    if (this.passwordForm.valid) {
      if (this.passwordForm.value.new_password === this.passwordForm.value.new_password_confirm) {
        this.loadingPassword = true;
        this.matchPasswords = true;
        this.actualPasswordError = false;
        let password: ChangePasswordForm = {
          actual_password: this.passwordForm.value.actual_password,
          new_password: this.passwordForm.value.new_password
        }
        this.settingsService.changePassword(password).subscribe({
          next: (res) => {
            this.loadingPassword = false;
            this.openSnackBar(this.translate.instant('settings_snack_new_password'));
            this.resetearFormulario();
          },
          error: (error) => {
            console.log(error);
            this.actualPasswordError = true;
            this.loadingPassword = false;
            this.openSnackBar(this.translate.instant('settings_snack_new_password_error'));
          }
        });
      } else {
        this.matchPasswords = false;
        this.actualPasswordError = false;
      }
    } else {
      this.openSnackBar(this.translate.instant('settings_snack_new_password_form_error'));
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, this.translate.instant('snackbar_close'));
  }

  private resetearFormulario() {
    this.router.navigate(['/settings']);
  }

  private buildPasswordForm(): void {
    this.passwordForm = this.formBuilder.group({
      actual_password: [null, Validators.required],
      new_password: [null, Validators.required],
      new_password_confirm: [null, Validators.required],
    });
  }
}
