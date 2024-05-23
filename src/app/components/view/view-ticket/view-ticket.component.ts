import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Usuario } from 'src/app/models/login/usuario';
import { ViewTicket } from 'src/app/models/view/view-ticket';
import { ViewTicketImage } from 'src/app/models/view/view-ticket-image';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idTicket: string;

  loading: boolean = false;
  loadingImages: boolean = false;
  viewTicket: ViewTicket;
  viewTicketImages: ViewTicketImage[] = [];

  usuario: Usuario;

  constructor(
    private decodificadorService: DecodificadorService,
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.usuario = this.decodificadorService.getUsuario();
    this.idTicket = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewTicket = {
      id: '',
      donation_id: '',
      total_weight: '',
      provider: '',
      location: '',
      date: '',
      delivered_by: '',
      created_by_id: '',
      created_by_username: '',
      creation_date: '',
      products: [],
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
      this.idTicket = params['id'];
      if (this.idTicket) {
        this.getViewTicket(this.idTicket);
        this.getImages(this.idTicket);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewTicket(idTicket: string) {
    this.loading = true;
    this.viewService.getViewTicket(idTicket).subscribe({
      next: (res) => {
        if (res) {
          this.viewTicket = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_ticket_error'));
        this.loading = false;
      }
    });
  }

  private getImages(idTicket: string) {
    this.loadingImages = true;
    this.viewService.getImagesTicket(idTicket).subscribe({
      next: (res) => {
        this.viewTicketImages = res;
        this.loadingImages = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_ticket_error'));
        this.loadingImages = false;
      }
    });
  }
}
