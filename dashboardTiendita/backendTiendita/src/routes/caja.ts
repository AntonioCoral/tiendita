import { Router } from 'express';
import { actualizarCorte, actualizarPedidoTransito, createCaja, getCortesByDate, getTransferenciasByCajaAndDate, getUltimoCorteByCaja } from '../controllers/corte';

const router = Router();

    router.post('/', createCaja);
    router.get('/date/:date', getCortesByDate);
    router.put('/:cajaId/pedidos/:pedidoId', actualizarPedidoTransito);
    router.get('/transferencias/:numeroCaja/:date', getTransferenciasByCajaAndDate);
    router.get('/ultimo-corte/:numeroCaja',getUltimoCorteByCaja);
    router.put('/:corteId', actualizarCorte);
    
export default router;
