import { Router } from 'express';
import { actualizarPedidoTransito, createCaja, getCortesByDate, getTransferenciasByCajaAndDate } from '../controllers/corte';

const router = Router();

    router.post('/', createCaja);
    router.get('/date/:date', getCortesByDate);
    router.put('/:cajaId/pedidos/:pedidoId', actualizarPedidoTransito);
    router.get('/transferencias/:numeroCaja/:date', getTransferenciasByCajaAndDate);

export default router;
