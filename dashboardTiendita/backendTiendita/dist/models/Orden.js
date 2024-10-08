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
const sequelize_1 = require("sequelize");
const conecction_1 = __importDefault(require("../db/conecction"));
const Orden = conecction_1.default.define('Orden', {
    numerOrden: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    numeroCaja: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    nameClient: {
        type: sequelize_1.DataTypes.STRING
    },
    direction: {
        type: sequelize_1.DataTypes.STRING
    },
    efectivo: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    montoCompra: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    transferenciaPay: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    nameDelivery: {
        type: sequelize_1.DataTypes.STRING
    },
    recharge: {
        type: sequelize_1.DataTypes.STRING
    },
    montoServicio: {
        type: sequelize_1.DataTypes.DOUBLE
    },
    itemOrder: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.STRING
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    updateAt: false
});
//sincronizamos el modelo a la base de datos
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield conecction_1.default.sync();
    console.log('Modelo sincronizado con la base de datos');
}))();
exports.default = Orden;
