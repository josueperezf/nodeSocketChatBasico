const { response, request } = require("express");
const { Producto } = require("../modelos");

// borrar categoria - estado a false
const index = async (req = request, res=response) => {
    // parametros que puedan pasar, ejemplo ?pag=2 etc
    // el skip es para decir que quiero del cero al dos, si el desde fuera un 10, entonces quiero que la base de datos me traiga del 10 al 12,
    const {limite=2, desde = 0} = req.query;
    const query = {estado:true};
    
    const [productos, total] = await Promise.all([
        Producto.find(query).skip(desde).limit(Number(limite)).populate('usuario', 'nombre').populate('categoria', 'nombre'),
        Producto.countDocuments(query)
    ]);
    res.json({
        total,
        productos,
    });
}

const store = async (req = request, res=response) => {
    // con la siguiente linea saco los parametros que puede que me envien pero no necesito, ya que yo se los asigno por el token
    const { estado, usuario, ...body}  = req.body;

    // verificar si ya existe 
    const productoExiste = await Producto.findOne({nombre:req.body.nombre?.toUpperCase()});
    if(productoExiste) {
        return res.status(400).json({
            msg: `El Prodcuto ${nombre} ya existe`
        });
    }
    // generar la data para guardar
    // por si se me olvida, req.usuario._id es que cuando valido si el token existe, veo de quien es, y se lo agrego manualmente al objeto req, en el middleware validar-jwt.js
    // los ... es para que agregue el resto de propiedades que tenga ese objeto
    const data = {
        ...body,
        usuario:req.usuario._id,
        nombre:req.body.nombre?.toUpperCase(),
        descripcion:req.body.descripcion?.toUpperCase()
    }
    const producto = new Producto(data);
    await producto.save();
    // retornar al frontend
    res.status(201).json({
        producto
    });
}

const show = async (req = request, res=response) => {
    const {id} =  req.params;
    const producto = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    res.status(200).json({
        producto
    });
}

const update = async (req, res=response) => {
    const { id} =  req.params;
    
    const data = {
        usuario: req.usuario._id,
        categoria:req.body.categoria,
        precio:req.body.precio ? req.body.precio: 0,
        nombre:req.body.nombre.toUpperCase(),
        descripcion:req.body.descripcion?.toUpperCase()
    }
    const producto = await Producto.findByIdAndUpdate(id, data,{new:true});

    res.status(200).json({
        producto
    });
}

const destroy = async (req, res=response) => {
    const { id} =  req.params;
    const query = {estado:false};
    const producto = await Producto.findByIdAndUpdate(id,query, {new:true});
    res.status(200).json({
        producto
    });
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};