import db from '../db/conecction';
import Caja from '../models/caja';
import Denominaciones from '../models/denominaciones';
import Transferencias from '../models/transferencia';
import Retiros from '../models/retiros';
import PagosTarjeta from '../models/pagostarjeta';
import PedidosTransitos from '../models/pedidostransito';

// Definir las relaciones entre los modelos
Caja.hasMany(Denominaciones, { as: 'denominaciones', foreignKey: 'cajaId' });
Caja.hasMany(Transferencias, { as: 'transferencias', foreignKey: 'cajaId' });
Caja.hasMany(Retiros, { as: 'retiros', foreignKey: 'cajaId' });
Caja.hasMany(PagosTarjeta, { as: 'pagosTarjeta', foreignKey: 'cajaId' });
Caja.hasMany(PedidosTransitos, { as: 'pedidosTransitos', foreignKey: 'cajaId' });

Denominaciones.belongsTo(Caja, { foreignKey: 'cajaId' });
Transferencias.belongsTo(Caja, { foreignKey: 'cajaId' });
Retiros.belongsTo(Caja, { foreignKey: 'cajaId' });
PagosTarjeta.belongsTo(Caja, { foreignKey: 'cajaId' });
PedidosTransitos.belongsTo(Caja, { foreignKey: 'cajaId' });

// Sincronizar los modelos con la base de datos
const syncDatabase = async () => {
  try {
    await db.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

export { Caja, Denominaciones, Transferencias, Retiros, PagosTarjeta, PedidosTransitos, syncDatabase };
