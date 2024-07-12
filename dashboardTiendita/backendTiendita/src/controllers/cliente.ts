import {Request, Response} from 'express';
import Cliente from '../models/cliente';
import { Op } from 'sequelize';

export const getClientes = async (req: Request, res: Response) => {
    const listCliente = await Cliente.findAll()
    res.json(listCliente);
}

export const searchClient = async (req: Request, res: Response) => {
    const { query } = req.params;

    try {
        const cliente = await Cliente.findOne({
            where: {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${query}%` } },
                    { telefono: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        if (cliente) {
            res.json(cliente);
        } else {
            res.status(404).json({ msg: 'No existe el cliente con el nombre o teléfono proporcionado.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Ocurrió un error, intente más tarde' });
    }
};



export const deleteCliente = async (req: Request, res: Response) => {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if(!cliente) {
        res.status(404).json({  msg: 'No existe cliente con la id: ' + id  })
    } else {
       await cliente.destroy();
       res.status(200).json({  msg: 'El cliente ha sido eliminado exitosamente' })
    }
}

export const postCliente = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await Cliente.create(body);
        res.json({ msg: 'Cliente agragado exitosamente' });

    } catch (error) {
        console.log(error);
        res.json({ msg: 'Ocurrió un error, intente más tarde' });

    }
}

export const updateCliente = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const cliente = await Cliente.findByPk(id);

        if(cliente){
            await cliente.update(body);
            res.json({ msg: 'Cliente actualizado con exito' })
    
        } else {
            res.status(404).json({ msg:'No existe el cliente con la id: ' + id })
        }

    } catch (error) {
        console.log(error);
        res.json({ msg: 'Ocurrió un error, intente más tarde' });
    }
}