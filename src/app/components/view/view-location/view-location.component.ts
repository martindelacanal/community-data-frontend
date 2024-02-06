import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewLocation } from 'src/app/models/view/view-location';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-location',
  templateUrl: './view-location.component.html',
  styleUrls: ['./view-location.component.scss']
})
export class ViewLocationComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idLocation: string;

  loading: boolean = false;
  viewLocation: ViewLocation;

  locationMapArray: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idLocation = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewLocation = {
      id: '',
      organization: '',
      community_city: '',
      partner: '',
      address: '',
      enabled: '',
      coordinates: '',
      creation_date: ''
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
      this.idLocation = params['id'];
      if (this.idLocation) {
        this.locationMapArray = [this.idLocation];
        this.getViewLocation(this.idLocation);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewLocation(idLocation: string) {
    this.viewService.getViewLocation(idLocation).subscribe({
      next: (res) => {
        if (res) {
          this.viewLocation = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_location_error'));
        this.loading = false;
      }
    });
  }

}
