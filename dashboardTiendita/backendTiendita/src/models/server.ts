import express, { Request, Response } from 'express';
import https from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import db from '../db/conecction';
import routesOrden from '../routes/orden';
import routesCliente from '../routes/cliente';
import routesCaja from '../routes/caja';
import { syncDatabase } from '.';

dotenv.config();

class Server {
    private app: express.Application;
    private port: string;
    private server: https.Server;
    private io: SocketIOServer;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '500';
        this.server = https.createServer(this.app);
        this.io = new SocketIOServer(this.server, {
            path: '/socket.io',
            wsEngine: ['ws','wss'],
            transports: ['websocket','polling'],
                cors: {
                origin: [
                    '*'
                ],
                methods: ['GET', 'POST', 'PUT', 'DELETE'],
            },
        });

        // Agregar io al contexto de la aplicación
        this.app.set('socketio', this.io);

        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
        this.sockets();
    }

    listen() {
        syncDatabase().then(() =>{
            this.server.listen(this.port, () => {
                console.log('Aplicación corriendo en el puerto:', this.port);
        })
        });
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({ msg: 'API trabajando' });
        });

        // Pasar io como parte del contexto a las rutas
        this.app.use('/api/ordenes', routesOrden(this.io));
        this.app.use('/api/clientes', routesCliente);
        this.app.use('/api/caja', routesCaja)
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await db.authenticate();
            console.log('Conexión exitosa a la base de datos');
        } catch (error) {
            console.log(error);
            console.log('Error al intentar conectarse a la base de datos');
        }
    }

    sockets() {
        this.io.on('connection', (socket) => {
            console.log('Usuario conectado');

            socket.on('disconnect', () => {
                console.log('Usuario desconectado');
            });
        });
    }
}

export default Server;
