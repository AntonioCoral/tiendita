// routes.ts
import { Router } from 'express';
import { getOrdenes, getOrden, deleteOrden, postOrden, updateOrden } from '../controllers/orden';
import { Server as SocketIOServer } from 'socket.io';

export default (io: SocketIOServer) => {
    const router = Router();

    router.get('/', getOrdenes);
    router.get('/:id', getOrden);
    router.delete('/:id', deleteOrden);
    router.post('/', (req, res) => postOrden(req, res, io));
    router.put('/:id', (req, res) => updateOrden(req, res, io));

    return router;
};
