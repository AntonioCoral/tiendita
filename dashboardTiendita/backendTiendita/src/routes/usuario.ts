import { Router } from 'express';
import { postUser } from '../controllers/usuario';


const router = Router();
router.post('/', postUser);

export default router;