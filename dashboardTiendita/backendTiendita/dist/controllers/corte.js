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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actualizarCorte = exports.getUltimoCorteByCaja = exports.getTransferenciasByCajaAndDate = exports.actualizarPedidoTransito = exports.checkCajaNumberExists = exports.getLastCajaNumber = exports.getCortesByDate = exports.createCaja = void 0;
const conecction_1 = __importDefault(require("../db/conecction"));
const caja_1 = __importDefault(require("../models/caja"));
const denominaciones_1 = __importDefault(require("../models/denominaciones"));
const transferencia_1 = __importDefault(require("../models/transferencia"));
const retiros_1 = __importDefault(require("../models/retiros"));
const pagostarjeta_1 = __importDefault(require("../models/pagostarjeta"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const sequelize_1 = require("sequelize");
const pedidostransito_1 = __importDefault(require("../models/pedidostransito"));
const orden_1 = __importDefault(require("../models/orden"));
// Configurar la zona horaria
const TIMEZONE = 'America/Mexico_City';
const createCaja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transaction = yield conecction_1.default.transaction();
    try {
        const { fecha, nombre, numeroCaja, totalEfectivo, totalTransferencias, totalRetiros, totalPagosTarjeta, totalPedidoTransito, ventaTotal, recargas, denominaciones, transferencias, retiros, pagosTarjeta, pedidosTransitos } = req.body;
        console.log("Datos recibidos:", req.body);
        const nuevaCaja = yield caja_1.default.create({
            fecha,
            nombre,
            numeroCaja,
            totalEfectivo,
            totalTransferencias,
            totalRetiros,
            totalPagosTarjeta,
            totalPedidoTransito,
            ventaTotal,
            recargas
        }, { transaction });
        console.log("Caja creada:", nuevaCaja);
        // Validar y procesar denominaciones
        if (denominaciones && denominaciones.length > 0) {
            for (const denom of denominaciones) {
                if (denom && denom.denominacion != null && denom.cantidad != null) {
                    console.log("Creando denominacion:", denom);
                    yield denominaciones_1.default.create({
                        cajaId: nuevaCaja.id,
                        denominacion: denom.denominacion,
                        cantidad: denom.cantidad
                    }, { transaction });
                }
            }
        }
        // Validar y procesar transferencias
        if (transferencias && transferencias.length > 0) {
            for (const trans of transferencias) {
                if (trans && trans.monto != null) {
                    console.log("Creando transferencia:", trans);
                    yield transferencia_1.default.create({
                        cajaId: nuevaCaja.id,
                        monto: trans.monto
                    }, { transaction });
                }
            }
        }
        // Validar y procesar retiros
        if (retiros && retiros.length > 0) {
            for (const retiro of retiros) {
                if (retiro && retiro.monto != null) {
                    console.log("Creando retiro:", retiro);
                    yield retiros_1.default.create({
                        cajaId: nuevaCaja.id,
                        monto: retiro.monto,
                        descripcion: retiro.descripcion
                    }, { transaction });
                }
            }
        }
        // Validar y procesar pagos con tarjeta
        if (pagosTarjeta && pagosTarjeta.length > 0) {
            for (const pago of pagosTarjeta) {
                if (pago && pago.monto != null) {
                    console.log("Creando pago tarjeta:", pago);
                    yield pagostarjeta_1.default.create({
                        cajaId: nuevaCaja.id,
                        monto: pago.monto
                    }, { transaction });
                }
            }
        }
        // Validar y procesar pedidos en transito
        if (pedidosTransitos && pedidosTransitos.length > 0) {
            for (const transito of pedidosTransitos) {
                if (transito && transito.monto != null) {
                    console.log("Creando pedido en transito:", transito);
                    yield pedidostransito_1.default.create({
                        cajaId: nuevaCaja.id,
                        monto: transito.monto,
                        descripcion: transito.descripcion,
                        estatus: transito.estatus // Asegúrate de incluir la descripción si está disponible
                    }, { transaction });
                }
            }
        }
        yield transaction.commit();
        res.status(201).json(nuevaCaja);
    }
    catch (error) {
        yield transaction.rollback();
        console.error("Error al crear la caja:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred.' });
        }
    }
});
exports.createCaja = createCaja;
const getCortesByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    try {
        const startDate = moment_timezone_1.default.tz(date, TIMEZONE).startOf('day').toDate();
        const endDate = moment_timezone_1.default.tz(date, TIMEZONE).endOf('day').toDate();
        const cortes = yield caja_1.default.findAll({
            where: {
                fecha: {
                    [sequelize_1.Op.gte]: startDate,
                    [sequelize_1.Op.lte]: endDate
                }
            },
            include: [
                { model: denominaciones_1.default, as: 'denominaciones' },
                { model: transferencia_1.default, as: 'transferencias' },
                { model: retiros_1.default, as: 'retiros' },
                { model: pagostarjeta_1.default, as: 'pagosTarjeta' },
                { model: pedidostransito_1.default, as: 'pedidosTransitos' }
            ]
        });
        res.json(cortes);
    }
    catch (error) {
        console.error("Error al obtener cortes:", error);
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An unknown error occurred.' });
        }
    }
});
exports.getCortesByDate = getCortesByDate;
const getLastCajaNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    try {
        const startOfDay = moment_timezone_1.default.tz(date, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment_timezone_1.default.tz(date, TIMEZONE).endOf('day').toDate();
        const lastCaja = yield caja_1.default.findOne({
            where: {
                fecha: {
                    [sequelize_1.Op.gte]: startOfDay,
                    [sequelize_1.Op.lte]: endOfDay
                }
            },
            order: [['numeroCaja', 'DESC']]
        });
        const lastCajaNumber = lastCaja ? lastCaja.numeroCaja : 0;
        res.json({ lastCajaNumber });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching last caja number' });
    }
});
exports.getLastCajaNumber = getLastCajaNumber;
const checkCajaNumberExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cajaNumber } = req.params;
    try {
        const caja = yield caja_1.default.findOne({
            where: {
                numeroCaja: cajaNumber
            }
        });
        if (caja) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error checking caja number' });
    }
});
exports.checkCajaNumberExists = checkCajaNumberExists;
const actualizarPedidoTransito = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { cajaId, pedidoId } = req.params;
    const { estatus } = req.body;
    try {
        const pedido = yield pedidostransito_1.default.findOne({
            where: {
                id: pedidoId,
                cajaId: cajaId
            }
        });
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido en tránsito no encontrado' });
        }
        pedido.estatus = estatus;
        yield pedido.save();
        res.json(pedido);
    }
    catch (error) {
        console.error("Error al actualizar el pedido en tránsito:", error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
exports.actualizarPedidoTransito = actualizarPedidoTransito;
const getTransferenciasByCajaAndDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroCaja, date } = req.params;
    try {
        const startOfDay = moment_timezone_1.default.tz(date, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment_timezone_1.default.tz(date, TIMEZONE).endOf('day').toDate();
        const transferencias = yield orden_1.default.findAll({
            where: {
                numeroCaja,
                createdAt: {
                    [sequelize_1.Op.gte]: startOfDay,
                    [sequelize_1.Op.lte]: endOfDay
                },
                transferenciaPay: {
                    [sequelize_1.Op.gt]: 0 // Sólo selecciona órdenes con transferencias mayores a 0
                }
            },
            attributes: ['transferenciaPay']
        });
        res.json(transferencias);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching transferencias' });
    }
});
exports.getTransferenciasByCajaAndDate = getTransferenciasByCajaAndDate;
// Controlador para obtener el último corte de una caja
const getUltimoCorteByCaja = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroCaja } = req.params; // Obtener el número de caja desde los parámetros de la URL
    try {
        // Buscar el último corte de la caja, ordenado por fecha de creación en orden descendente
        const ultimoCorte = yield caja_1.default.findOne({
            where: { numeroCaja },
            order: [['createdAt', 'DESC']] // Ordenar por fecha descendente para obtener el último
        });
        // Si no se encontró ningún corte para esa caja
        if (!ultimoCorte) {
            return res.status(404).json({ message: `No se encontró ningún corte anterior para la caja ${numeroCaja}` });
        }
        // Enviar el último corte encontrado
        res.json(ultimoCorte);
    }
    catch (error) {
        console.error('Error al obtener el último corte:', error);
        res.status(500).json({ message: 'Error al obtener el último corte', error });
    }
});
exports.getUltimoCorteByCaja = getUltimoCorteByCaja;
const actualizarCorte = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { corteId } = req.params;
    const _a = req.body, { denominaciones, transferencias, retiros } = _a, otrosDatosCorte = __rest(_a, ["denominaciones", "transferencias", "retiros"]);
    try {
        // Primero, encontrar el corte por ID
        const corte = yield caja_1.default.findByPk(corteId);
        if (!corte) {
            return res.status(404).json({ message: 'Corte no encontrado' });
        }
        // Actualizar los datos principales del corte (sin las denominaciones, transferencias y retiros)
        yield corte.update(otrosDatosCorte);
        // Actualizar las denominaciones
        if (denominaciones && Array.isArray(denominaciones)) {
            for (const denom of denominaciones) {
                if (denom.id) {
                    const denominacionExistente = yield denominaciones_1.default.findByPk(denom.id);
                    if (denominacionExistente) {
                        yield denominacionExistente.update({
                            cantidad: denom.cantidad,
                            denominacion: denom.denominacion.id,
                        });
                    }
                }
                else {
                    yield denominaciones_1.default.create({
                        cantidad: denom.cantidad,
                        denominacion: denom.denominacion,
                        cajaId: corte.id,
                    });
                }
            }
            const idsEnviados = denominaciones.map((denom) => denom.id);
            yield denominaciones_1.default.destroy({
                where: {
                    cajaId: corte.id,
                    id: { [sequelize_1.Op.notIn]: idsEnviados },
                },
            });
        }
        // Actualizar las transferencias
        if (transferencias && Array.isArray(transferencias)) {
            for (const trans of transferencias) {
                if (trans.id) {
                    const transferenciaExistente = yield transferencia_1.default.findByPk(trans.id);
                    if (transferenciaExistente) {
                        yield transferenciaExistente.update({
                            monto: trans.monto,
                        });
                    }
                }
                else {
                    yield transferencia_1.default.create({
                        monto: trans.monto,
                        cajaId: corte.id,
                    });
                }
            }
            const idsTransEnviados = transferencias.map((trans) => trans.id);
            yield transferencia_1.default.destroy({
                where: {
                    cajaId: corte.id,
                    id: { [sequelize_1.Op.notIn]: idsTransEnviados },
                },
            });
        }
        // Actualizar los retiros
        if (retiros && Array.isArray(retiros)) {
            for (const retiro of retiros) {
                if (retiro.id) {
                    const retiroExistente = yield retiros_1.default.findByPk(retiro.id);
                    if (retiroExistente) {
                        yield retiroExistente.update({
                            monto: retiro.monto,
                            descripcion: retiro.descripcion,
                        });
                    }
                }
                else {
                    yield retiros_1.default.create({
                        monto: retiro.monto,
                        descripcion: retiro.descripcion,
                        cajaId: corte.id,
                    });
                }
            }
            const idsRetirosEnviados = retiros.map((retiro) => retiro.id);
            yield retiros_1.default.destroy({
                where: {
                    cajaId: corte.id,
                    id: { [sequelize_1.Op.notIn]: idsRetirosEnviados },
                },
            });
        }
        res.status(200).json(corte);
    }
    catch (error) {
        console.error('Error al actualizar el corte:', error);
        res.status(500).json({ message: 'Error al actualizar el corte', error });
    }
});
exports.actualizarCorte = actualizarCorte;
