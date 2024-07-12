import { Router } from 'express';
import { actualizarPedidoTransito, createCaja, getCortesByDate } from '../controllers/corte';

const router = Router();

    router.post('/', createCaja);
    router.get('/date/:date', getCortesByDate);
    router.put('/:cajaId/pedidos/:pedidoId', actualizarPedidoTransito);

export default router;
