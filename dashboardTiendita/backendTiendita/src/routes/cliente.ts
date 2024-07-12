import { deleteCliente,  getClientes, postCliente, updateCliente, searchClient } from '../controllers/cliente';
import { Router } from 'express';

const router = Router();

router.get('/', getClientes);
router.get('/search/:query', searchClient); // Nueva ruta para búsqueda
router.delete('/:id', deleteCliente);
router.post('/', postCliente);
router.put('/:id', updateCliente);

export default router;
