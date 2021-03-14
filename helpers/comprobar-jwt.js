const jwt = require('jsonwebtoken');
const {Usuario} = require('../modelos');
const comprobarJWT = async (token = '')=>{
    try {
        if(!token || token == '') {
            return null;
        }
        const {uid} =  jwt.verify(token, process.env.SECRETORPRIVATEKEY );
        const usuario =  await Usuario.findById(uid);
        if (usuario) {
            if(usuario.estado) {
                return usuario;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

module.exports = {
    comprobarJWT
}