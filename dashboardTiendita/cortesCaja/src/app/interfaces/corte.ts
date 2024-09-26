
export interface Denominacion {
    id?: number;
    denominacion: number;
    cantidad: number;
    cajaId?: number;
}

export interface Transferencia {
    id?: number;
    monto: number;
    cajaId?: number;
}

export interface Retiro {
    id?: number;
    monto: number;
    descripcion?: string;
    cajaId?: number;
}

export interface PagoTarjeta {
    id?: number;
    monto: number;
    cajaId?: number;
}

export interface PedidosTransitos {
    id?: number;
    monto:number;
    descripcion?: string;
    estatus?: string;
    cajaId?: number;
}

export interface CorteCaja {
    
    id?: number;
    fecha: Date;
    nombre: String;
    numeroCaja: number;
    totalEfectivo: number;
    totalTransferencias: number;
    totalRetiros: number;
    totalPagosTarjeta: number;
    totalPedidoTransito: number;
    totalCalculado: number;
    ventaTotal: number;
    recargas: number;
    denominaciones: Denominacion[];
    transferencias: Transferencia[];
    retiros: Retiro[];
    pagosTarjeta: PagoTarjeta[];
    pedidosTransitos: PedidosTransitos[];
    createdAt?: string | null;
}
