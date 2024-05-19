"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes.ts
const express_1 = require("express");
const orden_1 = require("../controllers/orden");
exports.default = (io) => {
    const router = (0, express_1.Router)();
    router.get('/', orden_1.getOrdenes);
    router.get('/:id', orden_1.getOrden);
    router.delete('/:id', orden_1.deleteOrden);
    router.post('/', (req, res) => (0, orden_1.postOrden)(req, res, io));
    router.put('/:id', (req, res) => (0, orden_1.updateOrden)(req, res, io));
    return router;
};
