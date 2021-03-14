const validarArchivoParaSubir  = require('../middlewares/validar-archivo');
const validarCampos = require('../middlewares/validar-campos');
const validarJWT    = require('../middlewares/validar-jwt');
const validarRoles  = require('../middlewares/validar-roles');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

// los tres puntos es para decir que todo lo que exporte cada uno de los middleware y este en las variables, ejemplo, validarRoles, tambien va a ser exportado
module.exports = {
    ...validarArchivoParaSubir,
    ...validarCampos,
    ...validarJWT,
    ...validarRoles
}