const { Router} = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');
const { store, index, show, update, destroy } = require('../controllers/productos.controller');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const router = Router();
// listar productos
router.get('/',index);

// obtener una Producto por id, se necesita crear una validacion personalizada, existeProducto, crearlo en helpers
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],show);

// crear una Producto, solo para personas que tengan token
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('categoria', 'No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId ),
    validarCampos
], store );

// actualizar Producto por id
router.put('/:id',[
    check('id').custom(existeProductoPorId),
    check('categoria', 'categoria No es un id valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId ),
    validarJWT,
    validarCampos
],update);

// Borrar una Producto logicamente - solo ADMINISTRADOR PUEDE BORRAR
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], destroy);


module.exports = router;