import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resumen',
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.scss']
})
export class ResumenComponent implements OnInit {

  selectedTab = 'Desglose';

  products = [
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Pepsi Regular Retornable', description: 'Pepsi Regular Retornable x 3 L' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 2', description: 'Description of Product 2' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' },
    { imageUrl: 'assets/imgs/clientes-particular/articulos/pepsi-chica.png', name: 'Product 3', description: 'Description of Product 3' }
  ];

  columns = ['ID Misiones', 'Cliente', 'Fecha Inicio', 'Fecha Fin', 'Nombre Campaña', '% Finalización','Tipo de Campaña'];
  
  constructor() {
  }

  ngOnInit(): void {
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
}
