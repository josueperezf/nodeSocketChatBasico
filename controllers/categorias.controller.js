const { response, request } = require("express");
const { Categoria} = require("../modelos");

// obtenerCategorias, paginado, total llamar a populate para el usuario, seria el ultimo usuario que ha modificado la categoria

// show con populate

// actualizar categoria

// borrar categoria - estado a false
const index = async (req = request, res=response) => {
    // parametros que puedan pasar, ejemplo ?pag=2 etc
    // el skip es para decir que quiero del cero al dos, si el desde fuera un 10, entonces quiero que la base de datos me traiga del 10 al 12,
    const {limite=2, desde = 0} = req.query;
    const query = {estado:true};
    
    const [categorias, total] = await Promise.all([
        Categoria.find(query).skip(desde).limit(Number(limite)).populate('usuario', 'nombre'),
        Categoria.countDocuments(query)
    ]);
    res.json({
        total,
        categorias,
    });
}

const store = async (req = request, res=response) => {
    const nombre  = req.body.nombre.toUpperCase();
    // verificar si ya existe una categoria con ese nombre
    const categoriaExiste = await Categoria.findOne({nombre});
    if(categoriaExiste) {
        return res.status(400).json({
            msg: `La categoria ${nombre} ya existe`
        });
    }
    // generar la data para guardar
    // por si se me olvida, req.usuario._id es que cuando valido si el token existe, veo de quien es, y se lo agrego manualmente al objeto req, en el middleware validar-jwt.js
    const data = {
        nombre,
        estado:true,
        usuario:req.usuario._id
    }
    const categoria = new Categoria(data);
    await categoria.save();
    // retornar al frontend
    res.status(201).json({
        categoria
    });
}

const show = async (req = request, res=response) => {
    const {id} =  req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');
    res.status(200).json({
        categoria
    });
}

const update = async (req, res=response) => {
    const { id} =  req.params;
    const { nombre} = req.body;
    const categoria = await Categoria.findById(id);
    categoria.nombre = nombre.toUpperCase();
    categoria.usuario = req.usuario._id;
    await categoria.save();

    res.status(200).json({
        categoria
    });
}

const destroy = async (req, res=response) => {
    const { id} =  req.params;
    const query = {estado:false};
    const categoria = await Categoria.findByIdAndUpdate(id,query, {new:true});
    res.status(200).json({
        categoria
    });
}

module.exports = {
    index,
    store,
    show,
    update,
    destroy
};