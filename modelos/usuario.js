const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
    nombre:{
        type:String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique:true
    },
    password:{
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        required: true,
        default:'BASICO',
        enum:['ADMINISTRADOR','BASICO']
    },
    estado:{
        type: Boolean,
        default:true,
    },
    google:{
        type: Boolean,
        default:false,
    }
});

// no debe ser funcion de flecha ya que usare el this. la siguiente linea es para que luego de crear un usuario, no retorne el password al frontend
// con lo siguiente estamos sobreescribiendo metodos como find y demas de mongose, podemos sobre escribir o crear un nuevo metod
// vamos a sobre escribir el metodo toJSON
UsuarioSchema.methods.toJSON = function(){
    /**
     * en la siguiente seccion convierto el this en un objeto, ese resultado lo asigno a las constantes que creare
     * la primera es __v para la version, lo cual no se quiere enviar al frontend, lo segundo es el password que tampoco se quiere enviar
     * los ...usuario significa que despues de extrarle el __v y el password, lo que quede lo asigne a una variable llamada usuario
     */
    const {__v, password, _id, ...usuario} = this.toObject();
    // mongo me genera el id, llamado _id, pero no quiero enviar ese nombre al frontend, para ello, remuevo la propiedad y agrego una nueva pero con otro nombre
    usuario.uid=_id;
    return usuario;
}


// el  modelo se pone en singular, cuando crea la base de datos, la tabla o coleccion la crea en plural
module.exports = model('Usuario',UsuarioSchema)