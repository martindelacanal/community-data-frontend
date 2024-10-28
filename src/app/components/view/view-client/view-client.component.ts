import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewClient } from 'src/app/models/view/view-client';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-client',
  templateUrl: './view-client.component.html',
  styleUrls: ['./view-client.component.scss']
})
export class ViewClientComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idClient: string;

  loading: boolean = false;
  viewClient: ViewClient;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idClient = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewClient = {
      id: '',
      name: '',
      short_name: '',
      email: '',
      phone: '',
      address: '',
      webpage: '',
      enabled: '',
      creation_date: '',
      modification_date: '',
      locations: [],
      emails_for_reporting: []
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
      this.idClient = params['id'];
      if (this.idClient) {
        this.getViewClient(this.idClient);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewClient(idClient: string) {
    this.loading = true;
    this.viewService.getViewClient(idClient).subscribe({
      next: (res) => {
        if (res) {
          this.viewClient = res;
          if (this.viewClient.webpage && !this.viewClient.webpage.startsWith('http://') && !this.viewClient.webpage.startsWith('https://')) {
            this.viewClient.webpage = 'http://' + this.viewClient.webpage;
          }
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_client_error'));
        this.loading = false;
      }
    });
  }

}
