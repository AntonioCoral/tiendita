import { DataTypes } from "sequelize";
import db from '../db/conecction';

const Cliente = db.define('Cliente', {

    nombre: {
        type: DataTypes.STRING
    },
    apellido: {
        type: DataTypes.STRING
    },
    direction: {
        type: DataTypes.STRING
    },
    telefono: {
        type: DataTypes.STRING
    },

}, {

    updateAt: false
});
    //sincronizamos el modelo a la base de datos
    (async () => {
        await db.sync();
        console.log('Modelo sincronizado con la base de datos');
    })();
export default Cliente;