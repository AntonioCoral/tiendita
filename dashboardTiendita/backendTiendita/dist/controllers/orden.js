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
exports.getTotalEfectivoByOrderRange = exports.getPedidosTransitoByCajaAndTimeRange = exports.getTransferenciasByCajaAndTimeRange = exports.checkOrderNumberExists = exports.getLastOrderNumber = exports.getOrdenesByDate = exports.getOrdenesByDelivery = exports.updateOrden = exports.postOrden = exports.deleteOrden = exports.getOrden = exports.getOrdenes = void 0;
const orden_1 = __importDefault(require("../models/orden"));
const sequelize_1 = require("sequelize");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
// Configurar la zona horaria
const TIMEZONE = 'America/Mexico_City';
const getOrdenes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const today = (0, moment_timezone_1.default)().tz(TIMEZONE).format('YYYY-MM-DD');
        const startOfDay = moment_timezone_1.default.tz(today, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment_timezone_1.default.tz(today, TIMEZONE).endOf('day').toDate();
        const listOrden = yield orden_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: startOfDay,
                    [sequelize_1.Op.lte]: endOfDay
                }
            }
        });
        res.json(listOrden);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las órdenes' });
    }
});
exports.getOrdenes = getOrdenes;
const getOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const orden = yield orden_1.default.findByPk(id);
        if (orden) {
            res.json(orden);
        }
        else {
            res.status(404).json({ msg: 'No existe la orden con la id: ' + id });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.getOrden = getOrden;
const deleteOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const io = req.app.get('socketio');
    const orden = yield orden_1.default.findByPk(id);
    if (!orden) {
        res.status(404).json({ msg: 'No existe usuario con la id: ' + id });
    }
    else {
        yield orden.destroy();
        io.emit('orderDeleted', id); // Emitir evento de orden eliminada
        res.status(200).json({ msg: 'El usuario ha sido eliminado exitosamente' });
    }
});
exports.deleteOrden = deleteOrden;
const postOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const io = req.app.get('socketio');
    try {
        const newOrder = yield orden_1.default.create(body);
        io.emit('orderAdded', newOrder); // Emitir evento de orden agregada
        res.json({ msg: 'Orden agregada exitosamente', order: newOrder });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.postOrden = postOrden;
const updateOrden = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    const io = req.app.get('socketio');
    try {
        const orden = yield orden_1.default.findByPk(id);
        if (orden) {
            yield orden.update(body);
            io.emit('orderUpdated', orden); // Emitir evento de orden actualizada
            res.json({ msg: 'Orden actualizada con éxito', order: orden });
        }
        else {
            res.status(404).json({ msg: 'No existe la orden con la id: ' + id });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.updateOrden = updateOrden;
const getOrdenesByDelivery = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nameDelivery } = req.params;
    const today = (0, moment_timezone_1.default)().tz(TIMEZONE).format('YYYY-MM-DD');
    const startOfDay = moment_timezone_1.default.tz(today, TIMEZONE).startOf('day').toDate();
    const endOfDay = moment_timezone_1.default.tz(today, TIMEZONE).endOf('day').toDate();
    try {
        const ordenes = yield orden_1.default.findAll({
            where: {
                nameDelivery,
                createdAt: {
                    [sequelize_1.Op.gte]: startOfDay,
                    [sequelize_1.Op.lte]: endOfDay
                }
            }
        });
        res.json(ordenes);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.getOrdenesByDelivery = getOrdenesByDelivery;
const getOrdenesByDate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    try {
        const startOfDay = moment_timezone_1.default.tz(date, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment_timezone_1.default.tz(date, TIMEZONE).endOf('day').toDate();
        const orders = yield orden_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: startOfDay,
                    [sequelize_1.Op.lte]: endOfDay
                }
            }
        });
        res.json(orders);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching orders' });
    }
});
exports.getOrdenesByDate = getOrdenesByDate;
const getLastOrderNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { date } = req.params;
    try {
        const startOfDay = moment_timezone_1.default.tz(date, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment_timezone_1.default.tz(date, TIMEZONE).endOf('day').toDate();
        const lastOrder = yield orden_1.default.findOne({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: startOfDay,
                    [sequelize_1.Op.lte]: endOfDay
                }
            },
            order: [['numerOrden', 'DESC']]
        });
        const lastOrderNumber = lastOrder ? lastOrder.numerOrden : 0;
        res.json({ lastOrderNumber });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching last order number' });
    }
});
exports.getLastOrderNumber = getLastOrderNumber;
const checkOrderNumberExists = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderNumber } = req.params;
    try {
        const order = yield orden_1.default.findOne({
            where: {
                numerOrden: orderNumber
            }
        });
        if (order) {
            res.json(true);
        }
        else {
            res.json(false);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error checking order number' });
    }
});
exports.checkOrderNumberExists = checkOrderNumberExists;
const getTransferenciasByCajaAndTimeRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroCaja, date, startTime, endTime } = req.params;
    try {
        // Combina la fecha y las horas específicas para formar los DateTime correctos en la zona horaria local
        const startDateTimeLocal = moment_timezone_1.default.tz(`${date} ${startTime}`, TIMEZONE);
        const endDateTimeLocal = moment_timezone_1.default.tz(`${date} ${endTime}`, TIMEZONE);
        // Convierte a UTC para hacer la consulta en la base de datos
        const startDateTimeUTC = startDateTimeLocal.clone().utc().toDate();
        const endDateTimeUTC = endDateTimeLocal.clone().utc().toDate();
        console.log('Start DateTime UTC:', startDateTimeUTC);
        console.log('End DateTime UTC:', endDateTimeUTC);
        const transferencias = yield orden_1.default.findAll({
            where: {
                numeroCaja,
                createdAt: {
                    [sequelize_1.Op.gte]: startDateTimeUTC,
                    [sequelize_1.Op.lte]: endDateTimeUTC,
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
exports.getTransferenciasByCajaAndTimeRange = getTransferenciasByCajaAndTimeRange;
const getPedidosTransitoByCajaAndTimeRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { numeroCaja, date, startTime, endTime } = req.params;
    try {
        // Combina la fecha y las horas específicas para formar los DateTime correctos en la zona horaria local
        const startDateTimeLocal = moment_timezone_1.default.tz(`${date} ${startTime}`, TIMEZONE);
        const endDateTimeLocal = moment_timezone_1.default.tz(`${date} ${endTime}`, TIMEZONE);
        // Convierte a UTC para hacer la consulta en la base de datos
        const startDateTimeUTC = startDateTimeLocal.clone().utc().toDate();
        const endDateTimeUTC = endDateTimeLocal.clone().utc().toDate();
        console.log('Start DateTime UTC:', startDateTimeUTC);
        console.log('End DateTime UTC:', endDateTimeUTC);
        const pedidosTransito = yield orden_1.default.findAll({
            where: {
                numeroCaja,
                createdAt: {
                    [sequelize_1.Op.gte]: startDateTimeUTC,
                    [sequelize_1.Op.lte]: endDateTimeUTC,
                },
                status: 'transito'
            },
            attributes: ['efectivo', 'nameClient']
        });
        console.log('Pedidos en tránsito encontrados:', pedidosTransito.length);
        res.json(pedidosTransito);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching pedidos en transito' });
    }
});
exports.getPedidosTransitoByCajaAndTimeRange = getPedidosTransitoByCajaAndTimeRange;
const getTotalEfectivoByOrderRange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rangoInicio, rangoFin } = req.query;
    // Obtén la fecha actual
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    try {
        console.log('Rango de órdenes:', rangoInicio, rangoFin);
        console.log('Fecha inicio del día:', startOfDay);
        console.log('Fecha fin del día:', endOfDay);
        // Consulta para sumar el total de efectivo
        const totalEfectivo = yield orden_1.default.sum('efectivo', {
            where: {
                numerOrden: {
                    [sequelize_1.Op.between]: [rangoInicio, rangoFin]
                },
                createdAt: {
                    [sequelize_1.Op.between]: [startOfDay, endOfDay]
                }
            }
        });
        console.log('Total efectivo calculado:', totalEfectivo);
        res.json({
            totalEfectivo: totalEfectivo || 0
        });
    }
    catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ message: 'Error al obtener el total de efectivo', error });
    }
});
exports.getTotalEfectivoByOrderRange = getTotalEfectivoByOrderRange;
