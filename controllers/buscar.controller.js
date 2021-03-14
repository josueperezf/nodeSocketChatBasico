const { response, request } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto, Role } = require('../modelos');
 
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles',
];

const buscarUsuarios = async(termino = '', res = response)=> {
    // el termino es la opcion que queremos usar para buscar, puede ser un id o un string, para ello debemos validar su es un id valido
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const usuario = await Usuario.findById(termino).populate('usuario', 'nombre');
        // si el usuario existe se envia usuario como array, sino existe se envia un array vacio
        return res.json({
            results: (usuario) ? [usuario] : []
        });
    }
    // con la siguiente linea se hace que lo que escriba la persona, lo busque en la base de datos de manera insensible para mayusculas o minusculas
    const regx = new RegExp(termino, 'i');
    // $or: es como un or de SQL que le puedes decir que se cumpla una condicion o la otra, es de destacar que esto funciona como un LIKE en sql like ='%%'
    const usuarios = await Usuario.find({
        $or: [
            {nombre:regx},
            {correo:regx}
        ],
        $and: [
            {estado:true}
        ]
        }).populate('usuario', 'nombre');
    return res.json({
        results: (usuarios) ? [usuarios] : []
    });
}

const buscarCategorias = async(termino = '', res = response)=> {
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const categoria = await Categoria.findById(termino);
        // si la categoria existe se envia usuario como array, sino existe se envia un array vacio
        return res.json({
            results: (categoria) ? [categoria] : []
        });
    }
    const regx = new RegExp(termino, 'i');
    // $or: es como un or de SQL que le puedes decir que se cumpla una condicion o la otra, es de destacar que esto funciona como un LIKE en sql like ='%%'
    const categorias = await Categoria.find({
        $and: [
            {nombre:regx},
            {estado:true}
        ]
        });
    return res.json({
        results: (categorias) ? [categorias] : []
    });
}

const buscarProductos = async(termino = '', res = response)=> {
    /**
     * NOTA
     * 
     * SI QUEREMOS BUSCAR DICHOS PRODUCTOS QUE PERTENECEN A UNA CATEGORIA DETERMINADA, EN MONGO HARIAMOS AL COMO:
     * Producto.find({categoria: ObjectId("ID-DE-LA-CATEGORIA")})
     * const p = await Producto.find({categoria: ObjectId("60438e28ce9aa62830facde3")});
     * console.log(p);
     * 
     */
    
    const esMongoID = ObjectId.isValid(termino);
    if(esMongoID) {
        const producto = await Producto.findById(termino).populate('usuario', 'nombre').populate('categoria', 'nombre');
        // si la categoria existe se envia usuario como array, sino existe se envia un array vacio
        return res.json({
            results: (producto) ? [producto] : []
        });
    }
    const regx = new RegExp(termino, 'i');
    // $or: es como un or de SQL que le puedes decir que se cumpla una condicion o la otra, es de destacar que esto funciona como un LIKE en sql like ='%%'
    const productos = await Producto.find({
        $or: [
            {nombre:regx},
            // {precio:regx},
            {descripcion:regx},
        ],
        $and: [
            {estado:true}
        ]
        }).populate('usuario', 'nombre').populate('categoria', 'nombre');
    return res.json({
        results: (productos) ? [productos] : []
    });
}

const buscar = (req = request, res=response)=> {
    const { coleccion, termino} = req.params;
    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg:`Coleccion ${coleccion} no permitida`,
        });
    }
    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg:`Se le olvido esta opcion de busqueda`,
            });
            break;
    }
    /*
    res.json({
        msg:'Buscar ...',
        coleccion,
        termino,
    });*/
}

module.exports = {
    buscar
}