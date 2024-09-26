import { NgModule } from '@angular/core';
export interface Order {

    id?: number;
    numerOrden: number;
    numeroCaja?: number;
    nameClient: string;
    direction: string;
    efectivo: number;
    montoCompra: number;
    transferenciaPay: number;
    nameDelivery?: string;
    recharge?: string; //servico ya sea recarga o retiro de efectivo
    montoServicio?: number;
    itemOrder: string;
    status?: string;
    createdAt?: string | null; 

}