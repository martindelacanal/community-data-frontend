import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewEthnicity } from 'src/app/models/view/view-ethnicity';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-ethnicity',
  templateUrl: './view-ethnicity.component.html',
  styleUrls: ['./view-ethnicity.component.scss']
})
export class ViewEthnicityComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idEthnicity: string;

  loading: boolean = false;
  viewEthnicity: ViewEthnicity;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idEthnicity = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewEthnicity = {
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
      this.idEthnicity = params['id'];
      if (this.idEthnicity) {
        this.getViewEthnicity(this.idEthnicity);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewEthnicity(idEthnicity: string) {
    this.loading = true;
    this.viewService.getViewEthnicity(idEthnicity).subscribe({
      next: (res) => {
        if (res) {
          this.viewEthnicity = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_ethnicity_error'));
        this.loading = false;
      }
    });
  }

}

