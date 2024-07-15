import { Request, Response } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import Orden from '../models/orden';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

// Configurar la zona horaria
const TIMEZONE = 'America/Mexico_City';

export const getOrdenes = async (req: Request, res: Response) => {
    try {
        const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');
        const startOfDay = moment.tz(today, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment.tz(today, TIMEZONE).endOf('day').toDate();

        const listOrden = await Orden.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            }
        });

        res.json(listOrden);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener las órdenes' });
    }
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
    const io: SocketIOServer = req.app.get('socketio');
    const orden = await Orden.findByPk(id);

    if (!orden) {
        res.status(404).json({ msg: 'No existe usuario con la id: ' + id });
    } else {
        await orden.destroy();
        io.emit('orderDeleted', id); // Emitir evento de orden eliminada
        res.status(200).json({ msg: 'El usuario ha sido eliminado exitosamente' });
    }
};

export const postOrden = async (req: Request, res: Response) => {
    const { body } = req;
    const io: SocketIOServer = req.app.get('socketio');

    try {
        const newOrder = await Orden.create(body);
        io.emit('orderAdded', newOrder); // Emitir evento de orden agregada
        res.json({ msg: 'Orden agregada exitosamente', order: newOrder });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
};

export const updateOrden = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    const io: SocketIOServer = req.app.get('socketio');

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

export const getOrdenesByDelivery = async (req: Request, res: Response) => {
    const { nameDelivery } = req.params;
    const today = moment().tz(TIMEZONE).format('YYYY-MM-DD');
    const startOfDay = moment.tz(today, TIMEZONE).startOf('day').toDate();
    const endOfDay = moment.tz(today, TIMEZONE).endOf('day').toDate();

    try {
        const ordenes = await Orden.findAll({
            where: {
                nameDelivery,
                createdAt: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            }
        });
        res.json(ordenes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
};

export const getOrdenesByDate = async (req: Request, res: Response) => {
    const { date } = req.params;

    try {
        const startOfDay = moment.tz(date, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment.tz(date, TIMEZONE).endOf('day').toDate();

        const orders = await Orden.findAll({
            where: {
                createdAt: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching orders' });
    }
};

export const getLastOrderNumber = async (req: Request, res: Response) => {
    const { date } = req.params;

    try {
        const startOfDay = moment.tz(date, TIMEZONE).startOf('day').toDate();
        const endOfDay = moment.tz(date, TIMEZONE).endOf('day').toDate();

        const lastOrder = await Orden.findOne({
            where: {
                createdAt: {
                    [Op.gte]: startOfDay,
                    [Op.lte]: endOfDay
                }
            },
            order: [['numerOrden', 'DESC']]
        });
        const lastOrderNumber = lastOrder ? lastOrder.numerOrden : 0;
        res.json({ lastOrderNumber });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching last order number' });
    }
};
