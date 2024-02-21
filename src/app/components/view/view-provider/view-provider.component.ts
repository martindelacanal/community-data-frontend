import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewProvider } from 'src/app/models/view/view-provider';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-provider',
  templateUrl: './view-provider.component.html',
  styleUrls: ['./view-provider.component.scss']
})
export class ViewProviderComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idProvider: string;

  loading: boolean = false;
  viewProvider: ViewProvider;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idProvider = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewProvider = {
      id: '',
      name: '',
      total_quantity: '',
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
      this.idProvider = params['id'];
      if (this.idProvider) {
        this.getViewProvider(this.idProvider);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewProvider(idProvider: string) {
    this.loading = true;
    this.viewService.getViewProvider(idProvider).subscribe({
      next: (res) => {
        if (res) {
          this.viewProvider = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_provider_error'));
        this.loading = false;
      }
    });
  }

}
