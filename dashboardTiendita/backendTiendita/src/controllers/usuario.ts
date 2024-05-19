import express, { Request, Response } from 'express';
const router = express.Router();
const db = require('../db');

export const postUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Consultar la base de datos para obtener el usuario con el email proporcionado
    const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
    const [rows] = await db.query(query, [email, password]);

    // Verificar si se encontraron resultados
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }

    // Credenciales válidas
    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error('Error en la consulta:', error);
    return res.status(500).json({ error: 'Error en la consulta' });
  }
};

  
  
