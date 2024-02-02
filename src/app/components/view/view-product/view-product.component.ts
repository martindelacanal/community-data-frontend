import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ViewProduct } from 'src/app/models/view/view-product';
import { ViewService } from 'src/app/services/view/view.service';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  isMobile: boolean;
  isTablet: boolean;
  products: any[] = [];

  idProduct: string;

  loading: boolean = false;
  viewProduct: ViewProduct;

  constructor(
    private activatedRoute: ActivatedRoute,
    private viewService: ViewService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.idProduct = '';
    this.isMobile = false;
    this.isTablet = false;
    this.viewProduct = {
      id: '',
      name: '',
      product_type: '',
      total_quantity: '',
      value_usd: '',
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
      this.idProduct = params['id'];
      if (this.idProduct) {
        this.getViewProduct(this.idProduct);
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', { duration: 5000 });
  }

  private getViewProduct(idProduct: string) {
    this.viewService.getViewProduct(idProduct).subscribe({
      next: (res) => {
        if (res) {
          this.viewProduct = res;
        }
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
        this.openSnackBar(this.translate.instant('view_product_error'));
        this.loading = false;
      }
    });
  }

}
