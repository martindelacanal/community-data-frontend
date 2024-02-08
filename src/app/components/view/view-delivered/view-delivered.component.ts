import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewDelivered } from 'src/app/models/view/view-delivered';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-delivered',
  templateUrl: './view-delivered.component.html',
  styleUrls: ['./view-delivered.component.scss']
})
export class ViewDeliveredComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idDelivered: string;

  loading: boolean = false;
  viewDelivered: ViewDelivered;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idDelivered = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewDelivered = {
      id: '',
      delivering_user_id: '',
      delivery_username: '',
      receiving_user_id: '',
      beneficiary_username: '',
      location_id: '',
      community_city: '',
      approved: '',
      creation_date: '',
      deliveries: [],
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
      this.idDelivered = params['id'];
      if (this.idDelivered) {
        this.getViewDelivered(this.idDelivered);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewDelivered(idDelivered: string) {
    this.loading = true;
    this.viewService.getViewDelivered(idDelivered).subscribe({
      next: (res) => {
        if (res) {
          this.viewDelivered = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_delivered_error'));
        this.loading = false;
      }
    });
  }

}

