import { Request, Response } from 'express';
import db from '../db/conecction';
import Caja from '../models/caja';
import Denominaciones from '../models/denominaciones';
import Transferencias from '../models/transferencia';
import Retiros from '../models/retiros';
import PagosTarjeta from '../models/pagostarjeta';
import moment from 'moment-timezone';
import { Op } from 'sequelize';
import PedidosTransitos from '../models/pedidostransito';
import Orden from '../models/orden';


// Configurar la zona horaria
const TIMEZONE = 'America/Mexico_City';

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
  const { date } = req.params;  
  try {
    const startDate = moment.tz(date, TIMEZONE).startOf('day').toDate();
    const endDate = moment.tz(date, TIMEZONE).endOf('day').toDate();
    
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

export const getLastCajaNumber = async (req: Request, res: Response) => {
  const { date } = req.params;

  try {
    const startOfDay = moment.tz(date, TIMEZONE).startOf('day').toDate();
    const endOfDay = moment.tz(date, TIMEZONE).endOf('day').toDate();

    const lastCaja = await Caja.findOne({
      where: {
        fecha: {
          [Op.gte]: startOfDay,
          [Op.lte]: endOfDay
        }
      },
      order: [['numeroCaja', 'DESC']]
    });
    const lastCajaNumber = lastCaja ? lastCaja.numeroCaja : 0;
    res.json({ lastCajaNumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error fetching last caja number' });
  }
};

export const checkCajaNumberExists = async (req: Request, res: Response) => {
  const { cajaNumber } = req.params;
  try {
    const caja = await Caja.findOne({
      where: {
        numeroCaja: cajaNumber
      }
    });

    if (caja) {
      res.json(true);
    } else {
      res.json(false);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error checking caja number' });
  }
};

export const actualizarPedidoTransito = async (req: Request, res:Response) => {
  const { cajaId, pedidoId } = req.params;
  const { estatus } = req.body;

  try {
    const pedido = await PedidosTransitos.findOne({ 
      where: { 
        id: pedidoId,
        cajaId: cajaId
      } 
    });

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido en tránsito no encontrado' });
    }

    pedido.estatus = estatus;
    await pedido.save(); 

    res.json(pedido);
  } catch (error) {
    console.error("Error al actualizar el pedido en tránsito:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


export const getTransferenciasByCajaAndDate = async (req: Request, res: Response) => {
  const { numeroCaja, date } = req.params;

  try {
      const startOfDay = moment.tz(date, TIMEZONE).startOf('day').toDate();
      const endOfDay = moment.tz(date, TIMEZONE).endOf('day').toDate();

      const transferencias = await Orden.findAll({
          where: {
              numeroCaja,
              createdAt: {
                  [Op.gte]: startOfDay,
                  [Op.lte]: endOfDay
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

// Controlador para obtener el último corte de una caja
export const getUltimoCorteByCaja = async (req: Request, res: Response) => {
  const { numeroCaja } = req.params; // Obtener el número de caja desde los parámetros de la URL

  try {
    // Buscar el último corte de la caja, ordenado por fecha de creación en orden descendente
    const ultimoCorte = await Caja.findOne({
      where: { numeroCaja },
      order: [['createdAt', 'DESC']] // Ordenar por fecha descendente para obtener el último
    });

    // Si no se encontró ningún corte para esa caja
    if (!ultimoCorte) {
      return res.status(404).json({ message: `No se encontró ningún corte anterior para la caja ${numeroCaja}` });
    }

    // Enviar el último corte encontrado
    res.json(ultimoCorte);
  } catch (error) {
    console.error('Error al obtener el último corte:', error);
    res.status(500).json({ message: 'Error al obtener el último corte', error });
  }
};



export const actualizarCorte = async (req: Request, res: Response) => {
  const { corteId } = req.params;
  const { denominaciones, transferencias, retiros, ...otrosDatosCorte } = req.body;

  try {
    // Primero, encontrar el corte por ID
    const corte = await Caja.findByPk(corteId);

    if (!corte) {
      return res.status(404).json({ message: 'Corte no encontrado' });
    }

    // Actualizar los datos principales del corte (sin las denominaciones, transferencias y retiros)
    await corte.update(otrosDatosCorte);

    // Actualizar las denominaciones
    if (denominaciones && Array.isArray(denominaciones)) {
      for (const denom of denominaciones) {
        if (denom.id) {
          const denominacionExistente = await Denominaciones.findByPk(denom.id);
          if (denominacionExistente) {
            await denominacionExistente.update({
              cantidad: denom.cantidad,
              denominacion: denom.denominacion.id,
            });
          }
        } else {
          await Denominaciones.create({
            cantidad: denom.cantidad,
            denominacion: denom.denominacion,
            cajaId: corte.id,
          });
        }
      }
      const idsEnviados = denominaciones.map((denom: any) => denom.id);
      await Denominaciones.destroy({
        where: {
          cajaId: corte.id,
          id: { [Op.notIn]: idsEnviados },
        },
      });
    }

    // Actualizar las transferencias
    if (transferencias && Array.isArray(transferencias)) {
      for (const trans of transferencias) {
        if (trans.id) {
          const transferenciaExistente = await Transferencias.findByPk(trans.id);
          if (transferenciaExistente) {
            await transferenciaExistente.update({
              monto: trans.monto,
            });
          }
        } else {
          await Transferencias.create({
            monto: trans.monto,
            cajaId: corte.id,
          });
        }
      }
      const idsTransEnviados = transferencias.map((trans: any) => trans.id);
      await Transferencias.destroy({
        where: {
          cajaId: corte.id,
          id: { [Op.notIn]: idsTransEnviados },
        },
      });
    }

    // Actualizar los retiros
    if (retiros && Array.isArray(retiros)) {
      for (const retiro of retiros) {
        if (retiro.id) {
          const retiroExistente = await Retiros.findByPk(retiro.id);
          if (retiroExistente) {
            await retiroExistente.update({
              monto: retiro.monto,
              descripcion: retiro.descripcion,
            });
          }
        } else {
          await Retiros.create({
            monto: retiro.monto,
            descripcion: retiro.descripcion,
            cajaId: corte.id,
          });
        }
      }
      const idsRetirosEnviados = retiros.map((retiro: any) => retiro.id);
      await Retiros.destroy({
        where: {
          cajaId: corte.id,
          id: { [Op.notIn]: idsRetirosEnviados },
        },
      });
    }

    res.status(200).json(corte);
  } catch (error) {
    console.error('Error al actualizar el corte:', error);
    res.status(500).json({ message: 'Error al actualizar el corte', error });
  }
};


