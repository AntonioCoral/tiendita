import { Router } from 'express';
import { getOrdenes, getOrden, deleteOrden, postOrden, updateOrden, checkOrderNumberExists, getTransferenciasByCajaAndTimeRange, getPedidosTransitoByCajaAndTimeRange, getTotalEfectivoByOrderRange } from '../controllers/orden';
import { getOrdenesByDelivery, getOrdenesByDate, getLastOrderNumber } from '../controllers/orden';

import { Server as SocketIOServer } from 'socket.io';
import { getTransferenciasByCajaAndDate } from '../controllers/corte';

export default (io: SocketIOServer) => {
    const router = Router();
    router.get('/total-efectivo', getTotalEfectivoByOrderRange);
    router.get('/', getOrdenes);
    router.get('/:id', getOrden);
    router.delete('/:id', deleteOrden);
    router.post('/', (req, res) => postOrden(req, res));
    router.put('/:id', (req, res) => updateOrden(req, res));
    router.get('/delivery/:nameDelivery', getOrdenesByDelivery);
    router.get('/date/:date', getOrdenesByDate);
    router.get('/lastOrderNumber/:date', getLastOrderNumber);
    router.get('/checkOrderNumber/:orderNumber', checkOrderNumberExists);
    router.get('/transferencias/:numeroCaja/:date/:startTime/:endTime', getTransferenciasByCajaAndTimeRange);
    router.get('/transito/:numeroCaja/:date/:startTime/:endTime', getPedidosTransitoByCajaAndTimeRange);
    
    


    return router;
};
