"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cliente_1 = require("../controllers/cliente");
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/', cliente_1.getClientes);
router.get('/search/:query', cliente_1.searchClient); // Nueva ruta para búsqueda
router.delete('/:id', cliente_1.deleteCliente);
router.post('/', cliente_1.postCliente);
router.put('/:id', cliente_1.updateCliente);
exports.default = router;
