import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewGender } from 'src/app/models/view/view-gender';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-gender',
  templateUrl: './view-gender.component.html',
  styleUrls: ['./view-gender.component.scss']
})
export class ViewGenderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idGender: string;

  loading: boolean = false;
  viewGender: ViewGender;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idGender = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewGender = {
      id: '',
      name: '',
      name_es: '',
      creation_date: '',
      modification_date: '',
      beneficiaries: [],
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
      this.idGender = params['id'];
      if (this.idGender) {
        this.getViewGender(this.idGender);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewGender(idGender: string) {
    this.loading = true;
    this.viewService.getViewGender(idGender).subscribe({
      next: (res) => {
        if (res) {
          this.viewGender = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_gender_error'));
        this.loading = false;
      }
    });
  }

}
