const url = window.location.hostname.includes('localhost')
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-basica-node.herokuapp.com/api/auth/';


// Referencias a los elementos html
const txtUid = document.querySelector('#txtUid');
const txtMensaje = document.querySelector('#txtMensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const btnSalir = document.querySelector('#btnSalir');

// con la siguiente linea creamos la instancia de socket, el mismo lo da node luego de instalar socke.io http://localhost:8080/socket.io/socket.io.js
// si es con angular seria socket client
let usuario = null;
let socket  = null;


const validarJWT = async()=> {
    const token = localStorage.getItem('token');
    if(!token ) {
        window.location = 'index.html';
        throw new Error('No hay un token en el servidor');
    }
    const respuesta = await fetch(url,{
        headers: {'x-token': token },
    })
    const { usuario:usuarioDB, token:tokenDB } = await  respuesta.json();
    // renovamos el token que teniamos antes en el navegador
    localStorage.setItem('token', tokenDB);
    usuario = usuarioDB;
    // console.log({usuarioDB, tokenDB});
    document.title =  usuario.nombre;
    conectarSocket();
}

const conectarSocket = async ()=> {
    // aqui ademas de conectarnos, le enviamos un token al socket para autenticarnos
    socket =  io({
        extraHeaders: {
            'x-token': localStorage.getItem('token')
        }
    });
    // eventos que voy a estar escuchando, los eventos los genera el backend archivo, sockets/socket-controller.js
    socket.on('connect',()=>{
        console.log('usuario conectado');
    });
    socket.on('disconnect',()=>{
        console.log('usuario desconectado');
    });

    socket.on('recibir-mensajes',(payload)=>{
        console.log(payload);
        dibujarMensajes(payload);
    });

    socket.on('usuarios-activos',(payload)=>{
        // console.log(payload);
        dibujarUsuarios(payload);
    });

    socket.on('mensaje-privado',(payload)=>{
        console.log('privado', payload);
    });
}

// muestra los usuarios conectados
const dibujarUsuarios = (usuarios = [])=>{
    let usersHtml = '';
    ulUsuarios.innerHTML = usersHtml;
    usuarios.forEach(({nombre, uid }) => {
        usersHtml+= `
            <li>
                <p>
                    <h5 class="text-success" >${nombre}</h5>
                    <span class="fs-6 text-muted"> ${uid} </span>
                </p>
            </li>
            `;
    });
    ulUsuarios.innerHTML = usersHtml;
}

const dibujarMensajes = (mensajes = [])=>{
    let mensajesHtml = '';
    ulMensajes.innerHTML = mensajesHtml;
    mensajes.forEach(({nombre, mensaje }) => {
        mensajesHtml+= `
            <li>
                <p>
                    <span class="text-primary" >${nombre}</span>
                    <span > ${mensaje} </span>
                </p>
            </li>
            `;
    });
    ulMensajes.innerHTML = mensajesHtml;
}

// para saber especificamente que tencla presiono el usuario
txtMensaje.addEventListener('keyup',({keyCode})=>{
    const mensaje = txtMensaje.value;
    const uid = txtUid.value;

    if(keyCode!== 13) {return ;}
    if(mensaje.length === 0) {return ;}
    // cuando la tecla que presione sea enter, entonces envie el mensaje
    // es mejor enviar un objeto que solo el string
    socket.emit('enviar-mensaje', {uid, mensaje});
    txtMensaje.value = '';
} );

const main = async()=>{
    //validar jwt
    await validarJWT();
};

main();

// socket.on('');