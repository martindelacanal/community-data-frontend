import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewNotification } from 'src/app/models/view/view-notification';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-notification',
  templateUrl: './view-notification.component.html',
  styleUrls: ['./view-notification.component.scss']
})
export class ViewNotificationComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idNotification: string;

  loading: boolean = false;
  viewNotification: ViewNotification;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idNotification = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewNotification = {
      id: '',
      user_id: '',
      user_name: '',
      user_email: '',
      message: '',
      creation_date: '',
      notifications: [],
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
      this.idNotification = params['id'];
      if (this.idNotification) {
        this.getViewNotification(this.idNotification);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewNotification(idNotification: string) {
    this.viewService.getViewNotification(idNotification).subscribe({
      next: (res) => {
        if (res) {
          this.viewNotification = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_notification_error'));
        this.loading = false;
      }
    });
  }

}

