import { DataTypes } from 'sequelize';
import db from '../db/conecction';

const Caja = db.define('Caja', {
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  nombre: {
    type: DataTypes.STRING
  },
  numeroCaja: {
    type: DataTypes.DOUBLE
  },
  totalEfectivo: {
    type: DataTypes.DOUBLE,
    
  },
  totalTransferencias: {
    type: DataTypes.DOUBLE,
    
  },
  totalRetiros: {
    type: DataTypes.DOUBLE,
    
  },
  totalPagosTarjeta: {
    type: DataTypes.DOUBLE,
    
  },
  totalPedidoTransito: {
    type: DataTypes.DOUBLE
  
  },
  ventaTotal: {
    type: DataTypes.DOUBLE
  },
  recargas: {
    type: DataTypes.DOUBLE
  }
});

export default Caja;
