## node SocketChatBasico

En este proyecto se realiza un sistema de chat basico, el mismo fue contruido en base al proyecto  <https://github.com/josueperezf/restserver-basica-node> por ende existen cierto archivos js, que no son usados para el chat como tal

el cual almacena los mensajes se realiza en un json, 
dicho proyecto cuenta con:

1. inicio de sesion de google y por login y password

2. envio de mensajes a todos los usuarios

3. envio de mensajes privado, para ello se debe colocar en el campo id, el id del usuario destino

si al iniciar session no redirecciona, probar, hacerlo manualmente a chat.html


## infomacion general

remote host ``` https://restserver-basica-node.herokuapp.com/api/usuarios?limite=1 ```

si entramos a nuestra url de heroku y no esta o aparece unas ZzZz es que heroku pauso nuestra app no estarla usando desde hace tiempo, para ello debemos ingresar a nuestra cuenta de heroku, ir a nuestra aplicacion y seleccionar open app, con ello se activa nuestra app nuevamente

informacion del consumo con postman <https://documenter.getpostman.com/view/1818339/Tz5jeLZY#d92832ed-08c4-4c7a-9446-4c65530b05d2>

## VER LOGS HEROKU

1. Para ver los ultimos 100 logs: ``` heroku logs -n 100 ```

2. Para ver los ultimos 100 logs y se mantenga esuchando para que enseñe los nuevos logs que vayan generandose ``` heroku logs -n 100 --tail ```

## Notas

1. *Middleware:* en node identificamos que hay un middleware, cuando se utiliza lo siguiente app.use(xxx), lo que esta dentro de los parentesis es un middleware

2. *heroku*, si realizaste un cambio y no se ve reflejado en produccion heroku, se recomienda

    - heroku config:set NPM_CONFIG_PRODUCTION=false
    - heroku config:set NODE_MODULES_CACHE=false
    - git commit -am 'disable node_modules cache' --allow-empty
    - git push heroku master

3. *heroku* cuando hacemos un deploy nuevo, 'subimos nuestro codigo a heroku' va a borrar todo lo que no sea parte del repositorio, mejor dicho a lo que git no le haga seguimiento, si esto lo hacemos en un servidor no heroku, no tendriamos problemas, ya que las imagenes no se borrarian, para este ejemplo usaremos 

## plugins basicos

si se instala un paquete indicando que es de tipo save, sera un paquete de produccion, si decimos que es de tipo *--save-dev* es que ese paquete nos sirve solo cuando estemos programando, que cuando subamos codigos al servidor no se instalaran alla, ejemplo nodemon, nos sirve para que compile y demas, pero en produccion no nos sirve de nada

1. *npm i dotenv* es una para poder manejar de una manera facil las variables de entorno, como por ejemplo el puerto 'require('dotenv').config(); const port = process.env.PORT;'

2. *npm install cors* sirve para controlar las peticiones de origen cruzado

3. *npm install mongoose* sirve para manejar la base de datos mongo, ya tiene metodos que nos ayuda a realizar a realizar query y demas 

4. *npm install bcryptjs* sirve para realizar la encriptacion de la contraseña

5. *npm install express-validator* tiene gran cantidad de validaciones, las cuales se pueden usar como middleware

6. *npm install jsonwebtoken*: para el manejo de token

7. *npm install google-auth-library --save* para realizar la validacion de autenticacion con google

8. *npm i express-fileupload* sirve para la carga del archivo, posee un middleware, lo colocamos en el servidor.js, recordemos que todo plugin que tenga el app.use() es un middleware

9. *npm install uuid* permite generar id unicos, se instala y se usa como 'CommonJS syntax' para requerirlo

10. *npm i cloudinary* sirve para alojar y personalizar las imagenes que suban lo usuarios sobre los productos o imagenes de perfil. la documentacion oficial esta en <https://cloudinary.com/>

11. *npm i socket.io* nos permite controlar los socket, si es socket en angular y no en nodejs, alli seria socket client

## Conexion de base de datos mongo remota

este proyecto realiza conexion con mongo atlas desde la pagina <https://www.mongodb.com/cloud/atlas> accedi como con mi cuenta google.

 1. *creamos un custer*, y esperamos a que cargue 'como 3 minutos', la configuracion es la por default, solo se le coloco un nombre personalizado.

 2. luego fuimos a la seccion de *acceso a base de datos*, donde creamos un usuario con su password

 3. en la seccion de cluster, presionamos *conectar*, alli nos va a realizar preguntas, entre las que destaca, que debemos seleccionar, que nos conectaremos con mongo pass, esto nos generara una *la cadena de conexión, luego abra MongoDB Compass.*, 'mongodb+srv://josueperezf:<password>@clustercursonodecafe.jrjer.mongodb.net/test' la cual debemos de pegar en muestro programa de mongo pass que debemos tener instalado en nuestra maquina, colocando  en password la clave que creamos en el paso 2. y donde esta test, colocamos cafeDb que es la que usaremos

 ## Autenticacion por token

el inicio de sesion para maximo 5000 usuarios, esta bien, requiere un mejor equipo, pero funciona, destaca que en la autenticacion basada en sesiones, el servidor controla cada equipo que este logueado, mientras que con los tokens no, esto ayuda al rendimiento de nuestro servidor

### partes de un token

1. *header:* contiene la infomacion del algoritmo usado para la encriptacion junto con el tipo de token, ejemplo 'JWT'

1. *payload:* Contiene la informacion que queremos que esté en nuestro token

3. *firma:* es el mecanismo que nos permite identificar si el token es valido o no


## autenticacion con google

<https://developers.google.com/identity/sign-in/web/sign-in>

- Integracion backend

<https://developers.google.com/identity/sign-in/web/backend-auth>

1. En la documentacion nos va a pedir que creemos credenciales, en la seccion de crear URI, colocaremos las url desde las cuales daremos acceso a nuestro app, para este caso es localhost y https://restserver-basica-node.herokuapp.com/

2. en *URI de redireccionamiento autorizados* no colocamos nada

3. luego de estos le damos crear y nos aparecera un modal con las credenciales, Vamos al archivo .env de nuestro proyecto y creamos una variable llamada: GOOGLE_CLIENT_ID= con un valor de client id que nos da google

4. <https://console.developers.google.com/apis/credentials/oauthclient/1011905550160-gss04070g4lk42nm3tbqdooati99mpr8.apps.googleusercontent.com?project=opticav>

5. en nuestro backend debemos crear un endpoint

6. se creo un endpoint para el logea, 

6. creamos un helper *helpers/google-verify.js* con la sugerencia que da google para node, ademas usamos las variables que definimos en los .env y unas mejoras para exportarlo

- Integracion Fontend

<https://developers.google.com/identity/sign-in/web/sign-in>

 cuando la persona inicia session google da un token

## Manejo de cloudinary para subir nuestras images a su servidor

Pasos

1. hay muchas formas pero para este ejemplo instalaremos *npm i cloudinary*

2. crearemos una cuenta en <https://cloudinary.com/> si no la tenemos

3.  luego de estar registrados nos llevara a esta ventana <https://cloudinary.com/console/c-6b509865b49f0e2c03d7aba9e32891/welcome>, donde nos enseñara nuestras credenciales

        
        Cloud name: --> Nombre de la nube:	    josueperezf
        API Key:	--> Clave API:              144764244564265
        API Secret:	-> Secreto de API:          liAql-624pHxPw27uqwitIl0VAk
        API Environment variable:	--> Variable de entorno API
        CLOUDINARY_URL=cloudinary:

        -  API Environment variable: nos sirve para la autenticacion y asi mismo subir el contenido a dicho hosting, por ente, estas credenciales las debemos de pegar en nuestro .env del backend
        