"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUser = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const db = require('../db');
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Consultar la base de datos para obtener el usuario con el email proporcionado
        const query = 'SELECT * FROM usuarios WHERE email = ? AND password = ?';
        const [rows] = yield db.query(query, [email, password]);
        // Verificar si se encontraron resultados
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas' });
        }
        // Credenciales válidas
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    }
    catch (error) {
        console.error('Error en la consulta:', error);
        return res.status(500).json({ error: 'Error en la consulta' });
    }
});
exports.postUser = postUser;
