const Role = require('../modelos/role');
const { Usuario, Categoria, Producto } = require('../modelos');
const existeRol = async (rol = '')=>{
    const existeRol = await Role.findOne({nombre:rol});
    if(!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }
}
const emailExiste = async (correo = '')=>{
    // verificar si el correo existe, notemos que en la siguiente linea se usa Usuario con la 'U' mayuscula porque usamos el modelo, no la constante
    const existeCorreo = await Usuario .findOne({correo});
    if(existeCorreo) {
        throw new Error(`El correo: ${correo} ya esta en uso en la DB`);
    }
}

const existeUsuarioPorId = async (id = '')=>{
    // verificar si el correo existe, notemos que en la siguiente linea se usa Usuario con la 'U' mayuscula porque usamos el modelo, no la constante
    const existeUsuario = await Usuario .findById(id);
    if(!existeUsuario) {
        throw new Error(`ID: ${id} no existe en la DB`);
    }
}

const existeCategoriaPorId = async (id = '')=>{
    const existe = await Categoria.findById(id);
    if(!existe) {
        throw new Error(`ID: ${id} no existe en la DB`);
    }
}

const existeProductoPorId = async (id = '')=>{
    const existe = await Producto.findById(id);
    if(!existe) {
        throw new Error(`ID: ${id} no existe en la DB`);
    }
}

// validar colecciones permitidas
const coleccionesPermitidas = async (coleccion = '', colecciones = [])=>{
    if(!colecciones.includes(coleccion)) {
        throw new Error(`La coleccion ${coleccion} no es una coleccion permitida`);
    }
    // podriamos colocar return true en todas las funciones
    return true;
}

module.exports = {
    existeRol,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
};