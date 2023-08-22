import { Component, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import 'slick-carousel/slick/slick';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-articulos',
  templateUrl: './articulos.component.html',
  styleUrls: ['./articulos.component.scss']
})

export class ArticulosComponent implements AfterViewInit{
  products = [
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 1', description: 'Description of Product 1' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 2', description: 'Description of Product 2' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' }
  ];
  columns = ['Codigo', 'Tipo', 'Nombre', 'Tipo de Envase', 'Tamaño', 'Comercios','Misiones Completadas',' '];
  dataSource = new MatTableDataSource();
 //flechas del slider
 prevIcon: SafeResourceUrl;
 nextIcon: SafeResourceUrl;
 constructor(private sanitizer: DomSanitizer) {
  // Rutas de los archivos SVG de los iconos personalizados
  const nextIconPath = 'assets/icons/arrow-right-color.svg';
  const prevIconPath = 'assets/icons/arrow-left-color.svg';

  // Crear rutas seguras para los archivos SVG
  this.prevIcon = prevIconPath;
  this.nextIcon = nextIconPath;

 
}
  ngAfterViewInit(): void {
    $('.slider').slick({
      arrows: true,
      prevArrow: `<button type="button" class="slick-prev"><img src="${this.prevIcon}" alt="Prev" ></button>`,
      nextArrow: `<button type="button" class="slick-next"><img src="${this.nextIcon}" alt="Next" ></button>`,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      adaptiveHeight:true,
      draggable:true,
      
    
    });
  }

}

