import { DataTypes } from "sequelize";
import db from '../db/conecction';

const Orden = db.define('Orden', {

    numerOrden: {
        type: DataTypes.DOUBLE
    },
    numeroCaja: {
        type: DataTypes.DOUBLE
    },
    nameClient: {
        type: DataTypes.STRING
    },
    direction: {
        type: DataTypes.STRING
    },
    efectivo: {
        type: DataTypes.DOUBLE
    },
    montoCompra: {
        type: DataTypes.DOUBLE
    },
    transferenciaPay: {
        type: DataTypes.DOUBLE
    },
    nameDelivery: {
        type: DataTypes.STRING
    },
    recharge: { //servicio como recarga o retiro efec
        type: DataTypes.STRING
    },
    montoServicio: {
        type: DataTypes.DOUBLE
    },
    itemOrder:{
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.STRING
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }

}, {

    updateAt: false
});
    //sincronizamos el modelo a la base de datos
    (async () => {
        await db.sync();
        console.log('Modelo sincronizado con la base de datos');
    })();
export default Orden;