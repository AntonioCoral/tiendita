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
exports.updateCliente = exports.postCliente = exports.deleteCliente = exports.getCliente = exports.getClientes = void 0;
const cliente_1 = __importDefault(require("../models/cliente"));
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listCliente = yield cliente_1.default.findAll();
    res.json(listCliente);
});
exports.getClientes = getClientes;
const getCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const cliente = yield cliente_1.default.findByPk(id);
        if (cliente) {
            res.json(cliente);
        }
        else {
            res.status(404).json({ msg: 'No existe el cliente con la id: ' + id });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.getCliente = getCliente;
const deleteCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const cliente = yield cliente_1.default.findByPk(id);
    if (!cliente) {
        res.status(404).json({ msg: 'No existe cliente con la id: ' + id });
    }
    else {
        yield cliente.destroy();
        res.status(200).json({ msg: 'El cliente ha sido eliminado exitosamente' });
    }
});
exports.deleteCliente = deleteCliente;
const postCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    try {
        yield cliente_1.default.create(body);
        res.json({ msg: 'Cliente agragado exitosamente' });
    }
    catch (error) {
        console.log(error);
        res.json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.postCliente = postCliente;
const updateCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const { id } = req.params;
    try {
        const cliente = yield cliente_1.default.findByPk(id);
        if (cliente) {
            yield cliente.update(body);
            res.json({ msg: 'Cliente actualizado con exito' });
        }
        else {
            res.status(404).json({ msg: 'No existe el cliente con la id: ' + id });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ msg: 'Ocurrió un error, intente más tarde' });
    }
});
exports.updateCliente = updateCliente;
