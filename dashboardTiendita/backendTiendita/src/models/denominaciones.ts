import { DataTypes } from 'sequelize';
import db from '../db/conecction';

const Denominaciones = db.define('Denominaciones', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cajaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Cajas', // Name of the table, not the model
      key: 'id'
    }
  },
  denominacion: {
    type: DataTypes.STRING,
  },
  cantidad: {
    type: DataTypes.INTEGER,
  }
});


export default Denominaciones;
