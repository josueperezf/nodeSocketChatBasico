const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../modelos/usuario');

// el response es como agregar la interfaz en typescript ejemplo persona:Persona
const index = async (req = request, res = response) => {
    // parametros que puedan pasar, ejemplo ?pag=2 etc
    // el skip es para decir que quiero del cero al dos, si el desde fuera un 10, entonces quiero que la base de datos me traiga del 10 al 12,
    const {limite=2, desde = 0} = req.query;
    const query = {estado:true};
    // las siguientes 2 constantes hacen consulta a la base de datos, como usan el await, si la primera consulta toma 2 segundpos y la otra dura 1 segundo, entonces por completo tardaria 3, si se una una promesa haria las consultas de manera paralela y seria mas rapidp
    /*
    const usuarios = await Usuario.find(query )
                                .skip(desde)
                                .limit(Number(limite));
    const total = await Usuario.countDocuments(query);
    */
   //se hace una destructuracion de array
   // lo siguiente hace dos consultas a la base de datos de manera optimizada, mejor que el bloque comentado
   const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query ).skip(desde).limit(Number(limite))
   ]);
    res.json({
        total,
        usuarios});
}
// crear usuario
const store = async (req = request, res = response) => {
    const {nombre, correo, password, img, rol, estado,google} =  req.body;
    const usuario = new Usuario({nombre, correo,password,rol});

    // encriptar la contraseña
    // genSaltSync es el numero de vueltas de que hara bcryptjs para encriptar nuestra contraseña
    salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password,salt);
    // guardar en la base de datos
    await usuario.save();
    res.json({usuario});
}

const update = async (req, res) => {
    // con la siguiente linea saco de la data que me enviaron, el password y el google, ya que este ultimo solo se toma en cuenta para la creacion del usuario
    const {_id,password, google, correo, ...resto} =  req.body;
    const {id} =  req.params;
    // validar id con la base de datos

    if(password) {
        // encriptar la contraseña
        // genSaltSync es el numero de vueltas de que hara bcryptjs para encriptar nuestra contraseña
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password,salt);
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto,{new:true});
    res.json({
        usuario
    });
}

const destroy = async (req, res) => {
    const {id} =  req.params;
    // cuando se valida el token, al notar que es valido, la funcion validarJWT agrega al req el id del usuario, lo hace con el nombre uid
    // const uid = req.uid; ---> esto existia pero fernando luego lo quito para que no retornara el id del usuario sino todos sus datos
    // para eliminar fisicamente
    // const usuario = await Usuario.findByIdAndDelete(id);
    // const usuarioAutenticado = req.usuario;
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    res.json({
        mensaje:'soy destroy',
        usuario
    });
}

module.exports = {
    index,
    store,
    update,
    destroy
}