import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewUser } from 'src/app/models/view/view-user';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idUser: string;

  loading: boolean = false;
  viewUser: ViewUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idUser = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewUser = {
      id: '',
      username: '',
      email: '',
      firstname: '',
      lastname: '',
      client_name: '',
      date_of_birth: '',
      last_location_community_city: '',
      role_name: '',
      reset_password: '',
      enabled: '',
      modification_date: '',
      creation_date: '',
      ethnicity_name: '',
      other_ethnicity: '',
      gender_name: '',
      phone: '',
      zipcode: '',
      household_size: '',
      table_header: [],
      table_rows: [[]],
    };

  }

  ngOnInit() {
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
      this.idUser = params['id'];
      if (this.idUser) {
        this.getViewUser(this.idUser, this.translate.currentLang);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewUser(idUser: string, language: string) {
    this.loading = true;
    this.viewService.getViewUser(idUser, language).subscribe({
      next: (res) => {
        if (res) {
          this.viewUser = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_user_error'));
        this.loading = false;
      }
    });
  }

}


