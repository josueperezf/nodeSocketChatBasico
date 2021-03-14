const express = require('express');
const { dbConnection} = require('../database/config');
const fileUpload  = require('express-fileupload');
var cors = require('cors');
const { socketController } = require('../sockets/socket.controller');
class Servidor {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            uploads:   '/api/uploads',
            usuarios:   '/api/usuarios',
        };

        // inicio para el socket
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);
        // fin para el socket

        // Conectar a base de datos
        this.conectarDb();
        // Middlewares
        this.middlewares();
        // Rutas de la aplicacion
        this.routes();

        // ESCUCHAR SOCKET
        this.sockets();
    }
    sockets() {
        this.io.on('connection', (socket)=>{socketController(socket, this.io )} );
    }

    async conectarDb() {
        await dbConnection();
    }
    middlewares() {
        // Hacer publico nuestra carpeta publica
        this.app.use(express.static('public'));

        // lectura y parseo de las peticiones body, eso es para recibir la data json
        this.app.use(express.json());

        // con app.use agrego middleware
        this.app.use(cors());

        // para permitir que adjuntes archivos y subirlos al servidor
        // createParentPath sirve para darle permiso de que si va a subir un archivo en una carpeta que no existe, que cree esa carpeta
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath:true
        }));
    }

    routes() {
        this.app.use(this.paths.auth ,require('../routes/auth.routes') );
        this.app.use(this.paths.buscar ,require('../routes/buscar.routes') );
        this.app.use(this.paths.categorias ,require('../routes/categorias.routes') );
        this.app.use(this.paths.productos ,require('../routes/productos.routes') );
        this.app.use(this.paths.uploads ,require('../routes/uploads.routes') );
        this.app.use(this.paths.usuarios ,require('../routes/usuarios.routes') );
    }

    escuchar(){
        this.server.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`)
          })
    }
}

module.exports = Servidor;