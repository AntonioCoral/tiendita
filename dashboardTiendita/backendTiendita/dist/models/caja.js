"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const Caja = conecction_1.default.define('Caja', {
    fecha: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING
    },
    numeroCaja: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    totalEfectivo: {
        type: sequelize_1.DataTypes.DOUBLE,
    },
    totalTransferencias: {
        type: sequelize_1.DataTypes.DOUBLE,
    },
    totalRetiros: {
        type: sequelize_1.DataTypes.DOUBLE,
    },
    totalPagosTarjeta: {
        type: sequelize_1.DataTypes.DOUBLE,
    },
    totalPedidoTransito: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    ventaTotal: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    recargas: {
        type: sequelize_1.DataTypes.DOUBLE
    }
});
exports.default = Caja;
