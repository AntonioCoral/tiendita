"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncDatabase = exports.PedidosTransitos = exports.PagosTarjeta = exports.Retiros = exports.Transferencias = exports.Denominaciones = exports.Caja = void 0;
const conecction_1 = __importDefault(require("../db/conecction"));
const caja_1 = __importDefault(require("../models/caja"));
exports.Caja = caja_1.default;
const denominaciones_1 = __importDefault(require("../models/denominaciones"));
exports.Denominaciones = denominaciones_1.default;
const transferencia_1 = __importDefault(require("../models/transferencia"));
exports.Transferencias = transferencia_1.default;
const retiros_1 = __importDefault(require("../models/retiros"));
exports.Retiros = retiros_1.default;
const pagostarjeta_1 = __importDefault(require("../models/pagostarjeta"));
exports.PagosTarjeta = pagostarjeta_1.default;
const pedidostransito_1 = __importDefault(require("../models/pedidostransito"));
exports.PedidosTransitos = pedidostransito_1.default;
// Definir las relaciones entre los modelos
caja_1.default.hasMany(denominaciones_1.default, { as: 'denominaciones', foreignKey: 'cajaId' });
caja_1.default.hasMany(transferencia_1.default, { as: 'transferencias', foreignKey: 'cajaId' });
caja_1.default.hasMany(retiros_1.default, { as: 'retiros', foreignKey: 'cajaId' });
caja_1.default.hasMany(pagostarjeta_1.default, { as: 'pagosTarjeta', foreignKey: 'cajaId' });
caja_1.default.hasMany(pedidostransito_1.default, { as: 'pedidosTransitos', foreignKey: 'cajaId' });
denominaciones_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
transferencia_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
retiros_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
pagostarjeta_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
pedidostransito_1.default.belongsTo(caja_1.default, { foreignKey: 'cajaId' });
// Sincronizar los modelos con la base de datos
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield conecction_1.default.sync({ alter: true }); // Cambia a { force: true } si deseas eliminar y volver a crear las tablas
        console.log('Database synchronized successfully.');
    }
    catch (error) {
        console.error('Error synchronizing the database:', error);
    }
});
exports.syncDatabase = syncDatabase;
