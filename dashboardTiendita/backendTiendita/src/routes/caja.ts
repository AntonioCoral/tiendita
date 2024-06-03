import { Router } from 'express';
import { createCaja, getCortesByDate } from '../controllers/corte';

const router = Router();

    router.post('/', createCaja);
    router.get('/date/:date', getCortesByDate);

export default router;
