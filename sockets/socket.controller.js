const { Socket } = require("socket.io");
const { comprobarJWT } = require('../helpers');
const {ChatMensajes} = require('../modelos')
const chatMensajes = new ChatMensajes();

/**
 * si quiero que el chat haga envio de archivos,
 * lo que tengo que hacer es usar el endpoint para subir archivos,
 * y al momentos de emitir mensaje el servidor,
 * pues es sus datos de retorno iria la url donde va la imagen y ya para que la vea la persona a la que se la envian
 */

// = new Socket() esto se coloca solo en desarrollo, se hace para que VS Code de sugerencias de codigo mientras escribimos
// io tiene el control absoluto, por ende le puede enviar mensaje a quien desee
const socketController = async (socket = new Socket(), io )=>{
    // console.log('cliente conectado:'+ socket.id);
    // console.log(socket.handshake.headers['x-token']);

    const token =  socket.handshake.headers['x-token'];
    // console.log(token);
    const usuario = await comprobarJWT(token);
    if(!usuario) {
        return socket.disconnect();
    }
    // cuando una persona se conecta debo decirle a la demas persona que alguien se conecto
    // io es para todo el mundo
    chatMensajes.conectarUsario(usuario);
    console.log(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr);
    // la siguiente linea es por que cuando se conecte alguien nuevo, le voy a enviar los ultimos mensajes que estaban en la sala de chat para ese momento
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // conectarlo a una sala especial
    /**
     * cada persona que se conecte va a tener 3 salas
     * 1. la global 'io'
     * 2. socket.id
     * 3. es una que podemos crear nosotros dandole de nombre el id del usuario que la crea
     */
    // la siguiente linea indicamos que el usuario puede recibir mensajes privados
    socket.join(usuario.id );

    // borrar cuando alguien se desconecta
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        // informarle a todo el mundo que alguien se desconecto
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });
    socket.on('enviar-mensaje', ({uid, mensaje})=>{
        if(uid) {
            // es un mensaje privado
            socket.to(uid).emit('mensaje-privado', {de: usuario.nombre, mensaje});
        } else {
            // mensaje publico
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre,mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    });
}

module.exports = {
    socketController
}