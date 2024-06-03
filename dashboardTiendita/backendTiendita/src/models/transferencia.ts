import { DataTypes } from 'sequelize';
import db from '../db/conecction';

const Transferencias = db.define('Transferencias', {
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

export default Transferencias;
