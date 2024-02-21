import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewProductType } from 'src/app/models/view/view-product-type';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-product-type',
  templateUrl: './view-product-type.component.html',
  styleUrls: ['./view-product-type.component.scss']
})
export class ViewProductTypeComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;

  idProductType: string;

  loading: boolean = false;
  viewProductType: ViewProductType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idProductType = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewProductType = {
      id: '',
      name: '',
      name_es: '',
      creation_date: '',
      modification_date: '',
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
      this.idProductType = params['id'];
      if (this.idProductType) {
        this.getViewProductType(this.idProductType);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewProductType(idProductType: string) {
    this.loading = true;
    this.viewService.getViewProductType(idProductType).subscribe({
      next: (res) => {
        if (res) {
          this.viewProductType = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_product_type_error'));
        this.loading = false;
      }
    });
  }

}
