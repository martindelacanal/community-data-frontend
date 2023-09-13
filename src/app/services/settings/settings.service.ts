import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangePasswordForm } from 'src/app/models/settings/change-password-form.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient,
  ) { }

  changePassword(form: ChangePasswordForm) {
    return this.http.put(`${environment.url_api}/settings/password`, form);
  }
}
