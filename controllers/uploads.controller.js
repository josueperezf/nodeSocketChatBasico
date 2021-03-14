const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
// con la siguiente linea nos autenticamos pasandole la variable de entorno
cloudinary.config(process.env.CLOUDINARY_URL);
const { response } = require("express");
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../modelos');

// cargar archivo en mi servidor local, sin mas,no registra nada en base de datos ni nada
const cargarArchivo = async (req, res = response)=> {
    // la siguiente seccion contenido de esta seccion lo copie y pegue desde el ejemplo del plugin de su repo oficial https://github.com/richardgirges/express-fileupload/blob/master/example/server.js
    
    // este try lo cree por que note que el codigo de fernando si arrojaba un error no lo tomaba para enviarlo al frontend 
    try {
        // subirArchivo recibe tres parametros, los files, las extensiones permitidas y una detalle de la carpeta, sino se indica carpeta guarda en una llamada upload,
        // si se quiere indicar que carpeta, ejemplo uploads/mi-carpeta, pero no quiero mandar las extensiones permitidas, que son imagenes, entonces se enviaria:
        // subirArchivo(req.files, undefined, 'mi-carpeta')
        // subirArchivo(req.files, ['txt', 'doc'], 'mi-carpeta')
        const nombre = await subirArchivo(req.files, ['png', 'jpg', 'jpeg' ,'gif', 'bmp']);
        return res.json({
            nombre
        });
    } catch (error) {
        return res.status(400).json({
            msg:error
        });
    }
}
/*
const actualizarImagen = async (req, res = response)=> {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
            }
            break;
        default:
            return res.json({ msg: 'Se me olvido validar esto' });
            break;
    }
    // Limpiar imagenes existente
    if(modelo.img) {
        // hay que borrar la imageb
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
        if(fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }

    try {
        const nombre = await subirArchivo(req.files, undefined, coleccion );
        modelo.img= nombre;
        await modelo.save();
        return res.json(modelo);
    } catch (error) {
        return res.status(400).json({
            msg:error
        });
    }
}
*/
const mostrarImagen = async (req, res = response)=> {
    const { id, coleccion } = req.params;
    let modelo;
    // este try lo coloque por que cuando el id que envien es no valido envia un error, entonces con el try, lo que hago es si envian un id invalido, le retorno una imagen por default,
    // pero fernando dice que no esta mal dejar el error para q el desarrollador frontend vea que debe corregir algfo en su codigo
    // try {
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id);
                if(!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo) {
                    return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
                }
                break;
            default:
                return res.json({ msg: 'Se me olvido validar esto' });
                break;
        }
        // Limpiar imagenes existente
        if(modelo.img) {
            // hay que borrar la imageb
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img );
            if(fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }
    //} catch (error) {
        const pathImagen = path.join(__dirname, '../assets', 'no-image.jpg' );
        return res.sendFile(pathImagen);
    //}
}


const actualizarImagenCloudinary = async (req, res = response)=> {
    const { id, coleccion } = req.params;
    let modelo;
    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo) {
                return res.status(400).json({ msg: `No existe un usuario con el id: ${id}` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo) {
                return res.status(400).json({ msg: `No existe un producto con el id: ${id}` });
            }
            break;
        default:
            return res.json({ msg: 'Se me olvido validar esto' });
            break;
    }
    // Limpiar imagenes existente
    if(modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre    = nombreArr[nombreArr.length -1];
        // public_id seria el nombre de la imagen sin la extension
        const [public_id]        = nombre.split('.');
        // hay que borrar la imagen
        // console.log(public_id);
        cloudinary.uploader.destroy(public_id);
    }
    const { tempFilePath } = req.files.archivo;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    modelo.img = secure_url;
    await modelo.save();
    res.json(modelo);
}

module.exports = {
    cargarArchivo,
    // actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}