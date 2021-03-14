const { Router} = require('express');
const { check } = require('express-validator');
const { index, store, update, destroy} = require('../controllers/usuarios.controller');
const { existeRol, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

// lo anterior que esta comentado es lo mismo a la siguiente linea
const { validarCampos,validarJWT, tieneRole } = require('../middlewares/');
const router = Router();
// se coloca index, para pasar la referencia, no para ejecutar la funcion index
router.get('/', index );
/**
 * check sirve para indicar que quiero que revise, 
 * .not() es para negar, ejemplo, si se coloca ().not().isEmpty() estoy diciendo que no este vacio, creo que puedo decir directamente notEmpty()
 *  SI NO QUIERE TOMAR LA VALIDACIONES PODEMOS BAJAR EL SERVIDOR CON 'CONTROL C' Y LO LEVANTAMOS DE NUEVO 'node app.js'
 */
router.post('/', [
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('password', 'El password es obligatorio y contener mas de 6 caracteres').isLength({min:6, max:10}),
    check('correo', 'El correo es obligatorio').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol valido').isIn(['ADMINISTRADOR','BASICO']),
    // la siguiente linea y decir que: check('rol').custom((rol)=> existeRol(rol) ), es LO MISMO en ES6
    check('rol').custom(existeRol),
    validarCampos
], store );

router.put('/:id',[
// valida si el id que enviaron por parametro existe en la base de datos, esa validacion la hace express-validator
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(existeRol),
    validarCampos
], update);

router.delete('/:id',[
    validarJWT,
    // esAdminRole,
    tieneRole('ADMINISTRADOR','VENTAS'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], destroy);

module.exports = router;