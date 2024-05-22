"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orden_1 = require("../controllers/orden");
const orden_2 = require("../controllers/orden");
exports.default = (io) => {
    const router = (0, express_1.Router)();
    router.get('/', orden_1.getOrdenes);
    router.get('/:id', orden_1.getOrden);
    router.delete('/:id', orden_1.deleteOrden);
    router.post('/', (req, res) => (0, orden_1.postOrden)(req, res));
    router.put('/:id', (req, res) => (0, orden_1.updateOrden)(req, res));
    router.get('/delivery/:nameDelivery', orden_2.getOrdenesByDelivery);
    router.get('/date/:date', orden_2.getOrdenesByDate);
    router.get('/lastOrderNumber/:date', orden_2.getLastOrderNumber);
    return router;
};
