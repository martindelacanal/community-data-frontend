import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewTicketImage } from 'src/app/models/view/view-ticket-image';
import { ViewVolunteer } from 'src/app/models/view/view-volunteer';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-volunteer',
  templateUrl: './view-volunteer.component.html',
  styleUrls: ['./view-volunteer.component.scss']
})
export class ViewVolunteerComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idVolunteer: string;

  loading: boolean = false;
  loadingImages: boolean = false;
  viewVolunteer: ViewVolunteer;
  viewVolunteerImages: ViewTicketImage[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idVolunteer = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewVolunteer = {
      id: '',
      email: '',
      firstname: '',
      lastname: '',
      date_of_birth: '',
      phone: '',
      zipcode: '',
      location: '',
      gender: '',
      ethnicity: '',
      other_ethnicity: '',
      creation_date: '',
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
      this.idVolunteer = params['id'];
      if (this.idVolunteer) {
        this.getViewVolunteer(this.idVolunteer);
        this.getImages(this.idVolunteer);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewVolunteer(idVolunteer: string) {
    this.loading = true;
    this.viewService.getViewVolunteer(idVolunteer, this.translate.currentLang).subscribe({
      next: (res) => {
        if (res) {
          this.viewVolunteer = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_volunteer_error'));
        this.loading = false;
      }
    });
  }

  private getImages(idVolunteer: string) {
    this.loadingImages = true;
    this.viewService.getImagesVolunteer(idVolunteer).subscribe({
      next: (res) => {
        this.viewVolunteerImages = res;
        this.loadingImages = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_volunteer_error'));
        this.loadingImages = false;
      }
    });
  }
}

