import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewDeliveredBy } from 'src/app/models/view/view-delivered-by';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-delivered-by',
  templateUrl: './view-delivered-by.component.html',
  styleUrls: ['./view-delivered-by.component.scss']
})
export class ViewDeliveredByComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idDeliveredBy: string;

  loading: boolean = false;
  viewDeliveredBy: ViewDeliveredBy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idDeliveredBy = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewDeliveredBy = {
      id: '',
      name: '',
      creation_date: '',
      modification_date: '',
      tickets: [],
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
      this.idDeliveredBy = params['id'];
      if (this.idDeliveredBy) {
        this.getViewDeliveredBy(this.idDeliveredBy);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewDeliveredBy(idDeliveredBy: string) {
    this.loading = true;
    this.viewService.getViewDeliveredBy(idDeliveredBy).subscribe({
      next: (res) => {
        if (res) {
          this.viewDeliveredBy = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_delivered_by_error'));
        this.loading = false;
      }
    });
  }

}

