import { deleteCliente, getCliente, getClientes, postCliente, updateCliente } from './../controllers/cliente';
import { getOrden } from './../controllers/orden';
import { deleteOrden } from './../controllers/orden';
import {Router} from 'express';

const router = Router();

    router.get('/', getClientes)
    router.get('/:id', getCliente)
    router.delete('/:id', deleteCliente)
    router.post('/', postCliente)
    router.put('/:id', updateCliente)

export default router;