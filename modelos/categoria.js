const { Schema, model } = require("mongoose");
const categoriaSchema = Schema({
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
});


// vamos a sobre escribir el metodo toJSON
categoriaSchema.methods.toJSON = function() {
    const {__v, ...categoria} = this.toObject();
    return categoria;
}

module.exports = model('Categoria', categoriaSchema)