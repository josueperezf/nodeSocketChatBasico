const { Schema, model } = require("mongoose");
const rolSchema = Schema({
    nombre:{
        type:String,
        required: [true, 'El nombre del rol es obligatorio']
    },
});

module.exports = model('Role', rolSchema)