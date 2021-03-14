const jwt = require('jsonwebtoken')
const generarJWT = async (uid = '')=>{
    return new Promise((resolve, reject)=>{
        const payload = {
            uid
        };
        //uso lo que tengo en la variable de entorno para firmar el token
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY,{ expiresIn: '4h'}, (err, token)=>{
            if(err) {
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve(token);
        } )
    });
}

module.exports ={
    generarJWT
}