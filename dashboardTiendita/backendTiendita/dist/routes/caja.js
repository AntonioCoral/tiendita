"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const corte_1 = require("../controllers/corte");
const router = (0, express_1.Router)();
router.post('/', corte_1.createCaja);
router.get('/date/:date', corte_1.getCortesByDate);
exports.default = router;
