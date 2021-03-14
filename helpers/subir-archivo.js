const path = require('path');
// en la siguiente linea se requiere uuid, de su contenido sacamos la propiedad v4, y le damos un alias, o le cambiamos el nombre a la variable que estamos creando, por uuidv4
const { v4: uuidv4 } = require('uuid');
const subirArchivo = (files, extensionesPermitidas = ['png', 'jpg', 'jpeg' ,'gif', 'bmp'], carpeta = '' )=> {
    return new Promise((resolve, reject)=>{
        const { archivo} = files;
        const nombreCortado =  archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length -1 ];

        if(!extensionesPermitidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, ${extensionesPermitidas}`);
        }
        // console.log(archivo);
        // debe existir la carpeta uploads, sino existe la debo crear
        // la siguiente linea la mejoro fernando para obtener 

        const nombreTemporal = uuidv4() + '.'+ extension;
        uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, (err)=>{
            if (err) {
                console.log(err);
                return reject(err);
            }
            // resolve(uploadPath);
            resolve(nombreTemporal);
        });
    });
};


module.exports = {
    subirArchivo
};