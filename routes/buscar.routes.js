const { Router} = require('express');
const { buscar } = require('../controllers/buscar.controller');
const router = Router();
// coleccion es la tabla, termino es el detalle de lo que quiero buscar
router.get('/:coleccion/:termino', buscar);

module.exports = router;