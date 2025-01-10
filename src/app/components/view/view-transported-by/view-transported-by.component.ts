import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewTransportedBy } from 'src/app/models/view/view-transported-by';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-transported-by',
  templateUrl: './view-transported-by.component.html',
  styleUrls: ['./view-transported-by.component.scss']
})
export class ViewTransportedByComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idTransportedBy: string;

  loading: boolean = false;
  viewTransportedBy: ViewTransportedBy;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idTransportedBy = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewTransportedBy = {
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
      this.idTransportedBy = params['id'];
      if (this.idTransportedBy) {
        this.getViewTransportedBy(this.idTransportedBy);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewTransportedBy(idTransportedBy: string) {
    this.loading = true;
    this.viewService.getViewTransportedBy(idTransportedBy).subscribe({
      next: (res) => {
        if (res) {
          this.viewTransportedBy = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_transported_by_error'));
        this.loading = false;
      }
    });
  }

}

