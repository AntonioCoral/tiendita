import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import Orden from '../models/orden';

export const getOrdenes = async (req: Request, res: Response) => {
    const listOrden = await Orden.findAll();
    res.json(listOrden);
};

export const getOrden = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const orden = await Orden.findByPk(id);

        if (orden) {
            res.json(orden);
        } else {
            res.status(404).json({ msg: 'No existe la orden con la id: ' + id });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
};

export const deleteOrden = async (req: Request, res: Response) => {
    const { id } = req.params;
    const orden = await Orden.findByPk(id);

    if (!orden) {
        res.status(404).json({ msg: 'No existe usuario con la id: ' + id });
    } else {
        await orden.destroy();
        res.status(200).json({ msg: 'El usuario ha sido eliminado exitosamente' });
    }
};

export const postOrden = async (req: Request, res: Response, io: SocketIOServer) => {
    const { body } = req;

    try {
        const newOrder = await Orden.create(body);
        io.emit('orderAdded', newOrder); // Emitir evento de orden agregada
        res.json({ msg: 'Orden agregada exitosamente', order: newOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
};

export const updateOrden = async (req: Request, res: Response, io: SocketIOServer) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const orden = await Orden.findByPk(id);

        if (orden) {
            await orden.update(body);
            io.emit('orderUpdated', orden); // Emitir evento de orden actualizada
            res.json({ msg: 'Orden actualizada con éxito', order: orden });
        } else {
            res.status(404).json({ msg: 'No existe la orden con la id: ' + id });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
};
