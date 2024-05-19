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
exports.updateOrden = exports.postOrden = exports.deleteOrden = exports.getOrden = exports.getOrdenes = void 0;
const orden_1 = __importDefault(require("../models/orden"));
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
    const orden = yield orden_1.default.findByPk(id);
    if (!orden) {
        res.status(404).json({ msg: 'No existe usuario con la id: ' + id });
    }
    else {
        yield orden.destroy();
        res.status(200).json({ msg: 'El usuario ha sido eliminado exitosamente' });
    }
});
exports.deleteOrden = deleteOrden;
const postOrden = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
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
const updateOrden = (req, res, io) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
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
