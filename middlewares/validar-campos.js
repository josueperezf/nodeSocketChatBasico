const { validationResult } = require('express-validator');
// todos los middleware pueden recibir req y response como parametros
const validarCampos = (req, res, next)=>{
    /**
     * validationResult retorna los errores que haya encontrado en el middleware que se coloco en el router, este middleware tambien es de express-validator
     */
    const errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json(errores);
    }
    // si pasa la validacion, entonces avance a la siguiente fase o el controller
    next();
}

module.exports = {
    validarCampos
}