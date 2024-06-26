"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const Retiros = conecction_1.default.define('Retiros', {
    cajaId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'Cajas',
            key: 'id'
        }
    },
    monto: {
        type: sequelize_1.DataTypes.DOUBLE,
    },
    descripcion: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
});
exports.default = Retiros;
