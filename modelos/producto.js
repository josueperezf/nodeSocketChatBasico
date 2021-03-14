const { Schema, model } = require("mongoose");
// disponible es que esta agotado, que la tienda vende, pero no hay
const productoSchema = Schema({
    nombre:{
        type:String,
        required: [true, 'El nombre del rol es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:true,
    },
    precio:{
        type:Number,
        default:0,
        required:true
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:true,
    },
    descripcion:{
        type:String
    },
    disponible:{
        type:Boolean,
        default:true
    },
    img:{
        type:String
    }
});


// vamos a sobre escribir el metodo toJSON
productoSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    // quiero mandarle al frontend el estado
    return data;
}

module.exports = model('Producto', productoSchema)