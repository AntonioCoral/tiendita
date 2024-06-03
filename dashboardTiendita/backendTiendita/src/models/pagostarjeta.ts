import { DataTypes } from 'sequelize';
import db from '../db/conecction';

const PagosTarjeta = db.define('PagosTarjeta', {
  cajaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Cajas',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DOUBLE,
    
  }
});

export default PagosTarjeta;
