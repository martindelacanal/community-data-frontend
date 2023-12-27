import { Component, Input, OnInit } from '@angular/core';
import { ViewTicketImage } from 'src/app/models/view/view-ticket-image';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  _imagenes: ViewTicketImage[] = [];
  @Input()
  set imagenes(imagenes: ViewTicketImage[]) {
    this._imagenes = imagenes;
    this._imagenes.forEach(imagen => {
      // this.imgCollection.push({
      //   image: `${environment.url_api}/${imagen.archivo}`,
      //   thumbImage: `${environment.url_api}/${imagen.archivo}`,
      //   alt: imagen.fecha_modificacion,
      //   title: imagen.fecha_modificacion
      // });
      this.imgCollection.push({
        image: imagen.file,
        thumbImage: imagen.file,
        alt: imagen.creation_date,
        title: imagen.creation_date
      });
    });
  }
  get imagenes() {
    return this._imagenes;
  }

  imgCollection: Array<object> = [];

  constructor() { }

  ngOnInit(): void {
  }

}
