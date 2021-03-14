const {response, request} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../modelos/usuario');
const validarJWT = async (req = request, res = response, next)=> {
    const token = req.header('x-token');
    if(!token) {
        return res.status(401).json({
            msg:'No hy token en la peticion'
        });
    }
    try {
        // const payload = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        // console.log(payload);
        // uid es el _id que esta almacenado en la base de datos para ese usuario, con la diferencia que en el modelo decidimos cambiarle el nombre y colocarle uid solo al momento de enviar la data por el json
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if(!usuario) {
            return res.status(401).json({
                msg:'Token no valido - no existe en DB'
            });
        }


        // verificar si el usuario autenticado tiene estado true, o mejor dicho esta activo
        if(!usuario.estado) {
            return res.status(401).json({
                msg:'Token no valido - usuario con estado false'
            });
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg:'Token no valido'
        });
    }
}

module.exports = {
    validarJWT   
}