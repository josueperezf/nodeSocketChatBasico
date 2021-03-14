const validarArchivoParaSubir = (req, res, next)=>{
    // archivo es la variable que envia en frontend
    // el || !req.files.archivo se le agrego para aprovechar el if, y preguntar si enviaron desde el fronend una variable llamada archivo, la cual contendra lo que envien img o lo que sea
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(400).json({msg:'No hay archivos en la peticion'});   
    }
    next();
}
module.exports = {
    validarArchivoParaSubir
}