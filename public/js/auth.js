//Referencia al formulario para el logueo sin google
const miFormulario =  document.querySelector('form');


// la siguiente linea la coloco fernando para verificar con que servidor loguearse, es de recordar que en la pagina de google se le dijo que se podria loguear desde localhost con el puerto 8080 y desde https://restserver-basica-node.herokuapp.com
const url = window.location.hostname.includes('localhost')
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-basica-node.herokuapp.com/api/auth/';

//  para el login manual
miFormulario.addEventListener('submit',(ev)=>{
    // con la siguiente linea evita hacer un refresh del navegador cada vez que se presion ingresar emn el login sin google
    ev.preventDefault();
    const formData = {};
    for (let element of  miFormulario.elements ) {
        if(element.name.length > 0 ) {
            formData[element.name] = element.value;
        }
    }
    fetch(url+'login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {'Content-Type':'application/json' }
    })
    .then((res)=> res.json())
    .then(({token})=>{
        // console.log(token);
        localStorage.setItem('token', token);
        window.location = 'chat.html';
    }).catch((e)=>{console.log(e); });
});




// para el logueo de google
function onSignIn(googleUser) {
    // var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var id_token = googleUser.getAuthResponse().id_token;
    // console.log(id_token);
    // como el ejemplo es javascript nativo, entonces usaremos fetch
    const data = { id_token};
    fetch(url+'google',{
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    })
    .then((res)=> res.json())
    .then(({token})=>{
        // guardo el token en localStorage, esto le falta que validemos y demas pero eso lo hare yo luego
        localStorage.setItem('token', token);
        // window.location = 'chat.html';
        console.log('nuestros servidor', token);
    })
    .catch((e)=>console.log(e));

}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
}