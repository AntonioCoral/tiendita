import { Component, OnInit } from '@angular/core';
import { CorteCajaService } from 'src/app/services/corte.service';
import { CorteCaja } from 'src/app/interfaces/corte';

@Component({
  selector: 'app-corte-caja',
  templateUrl: './corte-caja.component.html',
  styleUrls: ['./corte-caja.component.css']
})
export class CorteCajaComponent implements OnInit {
  selectedDate: string = '';
  cortes: CorteCaja[] = [];

  constructor(private corteService: CorteCajaService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.selectedDate) {
      this.corteService.getCortesByDate(this.selectedDate).subscribe((data: CorteCaja[]) => {
        this.cortes = data;
      });
    }
  }

  calcularDiferencia(corte: CorteCaja): number {
    const totalIngresos = corte.totalEfectivo + corte.totalTransferencias + corte.totalPagosTarjeta + corte.totalPedidoTransito + corte.totalRetiros ;
    const totalEgresos = corte.ventaTotal + corte.recargas;
    return totalEgresos -  totalIngresos;
  }
}
