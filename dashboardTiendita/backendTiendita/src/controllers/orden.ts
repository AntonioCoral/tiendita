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

export const checkOrderNumberExists = async (req: Request, res: Response) => {
    const { orderNumber } = req.params;
    try {
        const order = await Orden.findOne({
            where: {
                numerOrden: orderNumber
            }
        });

        if (order) {
            res.json(true);
        } else {
            res.json(false);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error checking order number' });
    }
};

export const getTransferenciasByCajaAndTimeRange = async (req: Request, res: Response) => {
    const { numeroCaja, date, startTime, endTime } = req.params;

    try {
       // Combina la fecha y las horas específicas para formar los DateTime correctos en la zona horaria local
       const startDateTimeLocal = moment.tz(`${date} ${startTime}`, TIMEZONE);
       const endDateTimeLocal = moment.tz(`${date} ${endTime}`, TIMEZONE);

       // Convierte a UTC para hacer la consulta en la base de datos
       const startDateTimeUTC = startDateTimeLocal.clone().utc().toDate();
       const endDateTimeUTC = endDateTimeLocal.clone().utc().toDate();

       console.log('Start DateTime UTC:', startDateTimeUTC);
       console.log('End DateTime UTC:', endDateTimeUTC);

        const transferencias = await Orden.findAll({
            where: {
                numeroCaja,
                createdAt: {
                    [Op.gte]: startDateTimeUTC,
                    [Op.lte]: endDateTimeUTC,
                },
                transferenciaPay: {
                    [Op.gt]: 0 // Sólo selecciona órdenes con transferencias mayores a 0
                }
            },
            attributes: ['transferenciaPay']
        });

        res.json(transferencias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching transferencias' });
    }
};


export const getPedidosTransitoByCajaAndTimeRange = async (req: Request, res: Response) => {
    const { numeroCaja, date, startTime, endTime } = req.params;

    try {
        // Combina la fecha y las horas específicas para formar los DateTime correctos en la zona horaria local
        const startDateTimeLocal = moment.tz(`${date} ${startTime}`, TIMEZONE);
        const endDateTimeLocal = moment.tz(`${date} ${endTime}`, TIMEZONE);

        // Convierte a UTC para hacer la consulta en la base de datos
        const startDateTimeUTC = startDateTimeLocal.clone().utc().toDate();
        const endDateTimeUTC = endDateTimeLocal.clone().utc().toDate();

        console.log('Start DateTime UTC:', startDateTimeUTC);
        console.log('End DateTime UTC:', endDateTimeUTC);

        const pedidosTransito = await Orden.findAll({
            where: {
                numeroCaja,
                createdAt: {
                    [Op.gte]: startDateTimeUTC,
                    [Op.lte]: endDateTimeUTC,
                },
                status: 'transito'
            },
            attributes: ['efectivo', 'nameClient']
        });

        console.log('Pedidos en tránsito encontrados:', pedidosTransito.length);
        res.json(pedidosTransito);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching pedidos en transito' });
    }
};

export const getTotalEfectivoByOrderRange = async (req: Request, res: Response) => {
    const { rangoInicio, rangoFin } = req.query;

    // Obtén la fecha actual
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    try {
        console.log('Rango de órdenes:', rangoInicio, rangoFin);
        console.log('Fecha inicio del día:', startOfDay);
        console.log('Fecha fin del día:', endOfDay);

        // Consulta para sumar el total de efectivo
        const totalEfectivo = await Orden.sum('efectivo', {
            where: {
                numerOrden: {
                    [Op.between]: [rangoInicio, rangoFin]
                },
                createdAt: {
                    [Op.between]: [startOfDay, endOfDay]
                }
            }
        });

        console.log('Total efectivo calculado:', totalEfectivo);

        res.json({ 
            totalEfectivo: totalEfectivo || 0
        });
    } catch (error) {
        console.error('Error en la consulta:', error);
        res.status(500).json({ message: 'Error al obtener el total de efectivo', error });
    }
};


