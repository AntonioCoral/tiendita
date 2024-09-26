"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const corte_1 = require("../controllers/corte");
const router = (0, express_1.Router)();
router.post('/', corte_1.createCaja);
router.get('/date/:date', corte_1.getCortesByDate);
router.put('/:cajaId/pedidos/:pedidoId', corte_1.actualizarPedidoTransito);
router.get('/transferencias/:numeroCaja/:date', corte_1.getTransferenciasByCajaAndDate);
router.get('/ultimo-corte/:numeroCaja', corte_1.getUltimoCorteByCaja);
router.put('/:corteId', corte_1.actualizarCorte);
exports.default = router;
