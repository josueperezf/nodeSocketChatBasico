const dbValidators  = require('./db-validators');
const generarJWT    = require('./generar-jwt');
const googleVerify  = require('./google-verify');
const subirArchivo  = require('./subir-archivo');
const comprobarJWT  = require('./comprobar-jwt');

// los ... es para exparsir todo su contenido
module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...comprobarJWT
}