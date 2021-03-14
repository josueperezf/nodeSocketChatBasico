const { Router} = require('express');
const { check } = require('express-validator');
const { validarCampos, validarJWT, esAdminRole } = require('../middlewares/');
const { store, index, show, update, destroy } = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const router = Router();

// listar categorias
router.get('/',index);

// obtener una categoria por id, se necesita crear una validacion personalizada, existecategoria, crearlo en helpers
router.get('/:id', [
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],show);

// crear una categoria, solo para personas que tengan token
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos
], store );

// actualizar categoria por id
router.put('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarJWT,
    check('nombre', 'Nombre es obligatorio').notEmpty(),
    validarCampos
],update);

// Borrar una categoria logicamente - solo ADMINISTRADOR PUEDE BORRAR
router.delete('/:id',[
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarJWT,
    esAdminRole,
    validarCampos
], destroy);

module.exports = router;