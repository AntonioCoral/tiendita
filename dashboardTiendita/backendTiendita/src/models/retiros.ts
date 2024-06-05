import { DataTypes } from 'sequelize';
import db from '../db/conecction';

const Retiros = db.define('Retiros', {
  cajaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Cajas',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DOUBLE,
    
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

export default Retiros;
