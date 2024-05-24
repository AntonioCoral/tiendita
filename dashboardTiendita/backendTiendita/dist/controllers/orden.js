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
exports.getLastOrderNumber = exports.getOrdenesByDate = exports.getOrdenesByDelivery = exports.updateOrden = exports.postOrden = exports.deleteOrden = exports.getOrden = exports.getOrdenes = void 0;
const orden_1 = __importDefault(require("../models/orden"));
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
const getOrdenes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listOrden = yield orden_1.default.findAll();
    res.json(listOrden);
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
    const startOfDay = (0, moment_1.default)().startOf('day').toDate();
    const endOfDay = (0, moment_1.default)().endOf('day').toDate();
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
        const orders = yield orden_1.default.findAll({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: (0, moment_1.default)(date).startOf('day').toDate(),
                    [sequelize_1.Op.lte]: (0, moment_1.default)(date).endOf('day').toDate()
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
        const lastOrder = yield orden_1.default.findOne({
            where: {
                createdAt: {
                    [sequelize_1.Op.gte]: (0, moment_1.default)(date).startOf('day').toDate(),
                    [sequelize_1.Op.lte]: (0, moment_1.default)(date).endOf('day').toDate()
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
