import { Request, Response } from 'express';
import db from '../db/conecction';
import Caja from '../models/caja';
import Denominaciones from '../models/denominaciones';
import Transferencias from '../models/transferencia';
import Retiros from '../models/retiros';
import PagosTarjeta from '../models/pagostarjeta';
import moment from 'moment';
import { Op } from 'sequelize';
import PedidosTransitos from '../models/pedidostransito';

export const createCaja = async (req: Request, res: Response) => {
  const transaction = await db.transaction();

  try {
    const { fecha, nombre, numeroCaja, totalEfectivo, totalTransferencias, totalRetiros, totalPagosTarjeta, totalPedidoTransito, ventaTotal, recargas, denominaciones, transferencias, retiros, pagosTarjeta, pedidosTransitos } = req.body;

    console.log("Datos recibidos:", req.body);

    const nuevaCaja = await Caja.create({
      fecha,
      nombre,
      numeroCaja,
      totalEfectivo,
      totalTransferencias,
      totalRetiros,
      totalPagosTarjeta,
      totalPedidoTransito,
      ventaTotal,
      recargas
    }, { transaction });

    console.log("Caja creada:", nuevaCaja);

    // Validar y procesar denominaciones
    if (denominaciones && denominaciones.length > 0) {
      for (const denom of denominaciones) {
        if (denom && denom.denominacion != null && denom.cantidad != null) {
          console.log("Creando denominacion:", denom);
          await Denominaciones.create({
            cajaId: nuevaCaja.id,
            denominacion: denom.denominacion,
            cantidad: denom.cantidad
          }, { transaction });
        }
      }
    }

    // Validar y procesar transferencias
    if (transferencias && transferencias.length > 0) {
      for (const trans of transferencias) {
        if (trans && trans.monto != null) {
          console.log("Creando transferencia:", trans);
          await Transferencias.create({
            cajaId: nuevaCaja.id,
            monto: trans.monto
          }, { transaction });
        }
      }
    }

    // Validar y procesar retiros
    if (retiros && retiros.length > 0) {
      for (const retiro of retiros) {
        if (retiro && retiro.monto != null) {
          console.log("Creando retiro:", retiro);
          await Retiros.create({
            cajaId: nuevaCaja.id,
            monto: retiro.monto,
            descripcion: retiro.descripcion
          }, { transaction });
        }
      }
    }

    // Validar y procesar pagos con tarjeta
    if (pagosTarjeta && pagosTarjeta.length > 0) {
      for (const pago of pagosTarjeta) {
        if (pago && pago.monto != null) {
          console.log("Creando pago tarjeta:", pago);
          await PagosTarjeta.create({
            cajaId: nuevaCaja.id,
            monto: pago.monto
          }, { transaction });
        }
      }
    }

    // Validar y procesar pedidos en transito
    if (pedidosTransitos && pedidosTransitos.length > 0) {
      for (const transito of pedidosTransitos) {
        if (transito && transito.monto != null) {
          console.log("Creando pedido en transito:", transito);
          await PedidosTransitos.create({
            cajaId: nuevaCaja.id,
            monto: transito.monto,
            descripcion: transito.descripcion ,
            estatus: transito.estatus// Asegúrate de incluir la descripción si está disponible
          }, { transaction });
        }
      }
    }

    await transaction.commit();
    res.status(201).json(nuevaCaja);
  } catch (error: unknown) {
    await transaction.rollback();
    console.error("Error al crear la caja:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
};

export const getCortesByDate = async (req: Request, res: Response) => {
  const { date } = req.params;  // Usa req.params para obtener la fecha de los parámetros de la ruta
  try {
    const startDate = moment(date).startOf('day').toDate();
    const endDate = moment(date).endOf('day').toDate();
    
    const cortes = await Caja.findAll({
      where: {
        fecha: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      include: [
        { model: Denominaciones, as: 'denominaciones' },
        { model: Transferencias, as: 'transferencias' },
        { model: Retiros, as: 'retiros' },
        { model: PagosTarjeta, as: 'pagosTarjeta' },
        { model: PedidosTransitos, as: 'pedidosTransitos' }
      ]
    });
    res.json(cortes);
  } catch (error: unknown) {
    console.error("Error al obtener cortes:", error);
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred.' });
    }
  }
};



export const actualizarPedidoTransito = async (req: Request, res:Response) => {
  const { cajaId, pedidoId } = req.params;
  const { estatus } = req.body;

  try {
    // Busca el pedido en tránsito por su ID y el ID de la caja
    const pedido = await PedidosTransitos.findOne({ 
      where: { 
        id: pedidoId,
        cajaId: cajaId
      } 
    });

    // Si no se encuentra el pedido, devuelve un error 404
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido en tránsito no encontrado' });
    }

    // Actualiza el estado del pedido
    pedido.estatus = estatus;
    await pedido.save(); // Guarda los cambios en la base de datos

    // Devuelve el pedido actualizado como respuesta
    res.json(pedido);
  } catch (error) {
    console.error("Error al actualizar el pedido en tránsito:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

