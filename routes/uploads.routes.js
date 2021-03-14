const { Router} = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivoParaSubir } = require('../middlewares/');
const { cargarArchivo,
    // actualizarImagen,
    mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas} = require('../helpers');

const router = Router();

router.post('/', validarArchivoParaSubir, cargarArchivo);
// permite cambiar la imagen de una coleccion o tabla, bien sea usuarios o productos
router.put('/:coleccion/:id', [
    validarArchivoParaSubir,
    check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom((c)=>coleccionesPermitidas(c, ['usuarios','productos']) ),
    validarCampos
],
// actualizarImagen
actualizarImagenCloudinary );


router.get('/:coleccion/:id',[
    // check('id', 'No es un id valido').isMongoId(),
    check('coleccion').custom((c)=>coleccionesPermitidas(c, ['usuarios','productos']) ),
    validarCampos
], mostrarImagen);

router.get(':coleccion/:id');
module.exports = router;