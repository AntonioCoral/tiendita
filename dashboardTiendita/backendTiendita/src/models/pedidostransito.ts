import { DataTypes } from 'sequelize';
import db from '../db/conecction';

const PedidosTransitos = db.define('PedidosTransitos', {
  cajaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Cajas',
      key: 'id'
    }
  },
  monto: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING,
    allowNull: true
  },
  estatus: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'PedidosTransitos',
});

export default PedidosTransitos;
