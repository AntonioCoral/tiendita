"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const Denominaciones = conecction_1.default.define('Denominaciones', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    cajaId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: 'Cajas', // Name of the table, not the model
            key: 'id'
        }
    },
    denominacion: {
        type: sequelize_1.DataTypes.STRING,
    },
    cantidad: {
        type: sequelize_1.DataTypes.INTEGER,
    }
});
exports.default = Denominaciones;
