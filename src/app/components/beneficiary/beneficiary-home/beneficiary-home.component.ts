import { Component } from '@angular/core';
import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { beneficiaryQR } from 'src/app/models/beneficiary/beneficiary-qr.model';
import { DecodificadorService } from 'src/app/services/login/decodificador.service';

@Component({
  selector: 'app-beneficiary-home',
  templateUrl: './beneficiary-home.component.html',
  styleUrls: ['./beneficiary-home.component.scss']
})
export class BeneficiaryHomeComponent {

  title = 'app';
  elementType = 'url';
  value: string = null;
  errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  objeto: beneficiaryQR;

  constructor(
    private decodificadorService: DecodificadorService
  ) {
    this.objeto = {
      id: this.decodificadorService.getId(),
      role: this.decodificadorService.getRol(),
      date: new Date().toLocaleString(),
      approved: 'N'
    };
    this.value = JSON.stringify(this.objeto);
  }

  newQR() {
    this.objeto = {
      id: this.decodificadorService.getId(),
      role: this.decodificadorService.getRol(),
      date: new Date().toLocaleString(),
      approved: 'N'
    };
    this.value = JSON.stringify(this.objeto);
  }
}
