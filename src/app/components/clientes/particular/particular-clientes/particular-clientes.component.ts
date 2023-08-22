import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-particular-clientes',
  templateUrl: './particular-clientes.component.html',
  styleUrls: ['./particular-clientes.component.scss']
})
export class ParticularClientesComponent implements OnInit {
  cliente = 'Farmacity';
  progressBarFill:any;
  valor = 400000;
  
  ngOnInit(){
    this.calcularPorcentajeBarras();
  }
  calcularPorcentajeBarras(){
    this.progressBarFill = document.getElementById('barra1');
    this.progressBarFill.style.width = (this.valor * 100)/5000000 + '%';
    this.progressBarFill = document.getElementById('barra2');
    this.progressBarFill.style.width = (this.valor * 100)/3800000 + '%';
    this.progressBarFill = document.getElementById('barra4');
    this.progressBarFill.style.width = (this.valor * 100)/1200000 + '%';
    this.progressBarFill = document.getElementById('barra2');
    this.progressBarFill.style.width =(this.valor * 100)/3800000 + '%';
  }
}
