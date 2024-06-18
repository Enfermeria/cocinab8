"use strict";

//Para mostrar u ocultar el menu hamburguer
document.getElementById("icon_menu").addEventListener("click", function(){ //alterna entre mostrar el menu o dejarlo hamburguer
    document.querySelector("nav").classList.toggle("menu_mostrado"); 
});



//Para ejecutar funcion al hacer click en un "nav a" (link href) y cargar html con partial render
const main = document.querySelector("main");
const links = document.querySelectorAll("nav a");
links.forEach(unLink => {
    unLink.addEventListener("click", function(evento){
        evento.preventDefault();
        let paginaACargar = this.getAttribute("href");

        cargarPagina(paginaACargar);
    }); //addEventListener
}); //links.forEach





//Para alternar entre modo oscuro y modo normal
const chkBoxModoOscuro = document.querySelector("#chkBoxModoOscuro");
const raiz = document.querySelector(":root");
if (localStorage.modoOscuro == "true") { //veo el localStorage como estaba y pongo el checkbox acorde a este.
    chkBoxModoOscuro.checked = true;
    raiz.classList.add("modoOscuro");
} else {
    chkBoxModoOscuro.checked = false;
    raiz.classList.remove("modoOscuro");
}
chkBoxModoOscuro.addEventListener("click", function(){//al clickear el checkbox Modo Oscuro alterno entre colores normales y modoOscuro
    if (chkBoxModoOscuro.checked) {
        localStorage.modoOscuro = true; 
        raiz.classList.add("modoOscuro");
    } else {
        localStorage.modoOscuro = false;
        raiz.classList.remove("modoOscuro");
    }
}); //chkBoxModoOscuro




//cargo la página principal
cargarPagina("principal.html");




//funcion que carga html con partial render
function cargarPagina(paginaACargar){
    //cargo la página
    main.innerHTML = "<h1><br><br><br><br>Cargando...<br><br><br><br></h1>";
    fetch(paginaACargar)
        .then(response => {
            if (response.ok)
                return response.text(); // devuelvo otra promesa: el procesamiento de ese texto html
            else {
                main.innerHTML = "<h1><br><br><br><br>Error - URL falló!"+response.status+"</h1>";
                console.log("Error - URL falló en cargarPagina: " + response.status)
            }
        }) //then response
        .then(html => {
            main.innerHTML = html;
            // en caso de necesitarlo, ejecuto los scripts html de esas páginas
            if (paginaACargar == "alumnos.html")
                alumnos();
            else if (paginaACargar == "inscripcion.html")
                inscripcion();

            // vinculo todos los links de la página main para que usen partial render
            linksMain();
        }) //then html
        .catch(error => {
            main.innerHTML = "<h1><br><br><br><br>Error - Conexión falló!</h1>" + error;
        }); //catch
} // cargarPagina




//Para ejecutar funcion al hacer click en un "main a" (link href) y cargar html con partial render
//Nota: se excluyen los vínculos a páginas exteriores, que se abrirán en una pestaña nueva.
function linksMain(){
    const linksDelMain = document.querySelectorAll("main a");
    linksDelMain.forEach(unLink => {
        if (!unLink.classList.contains("externo")){
            unLink.addEventListener("click", function(evento){
                evento.preventDefault();
                let paginaACargar = this.getAttribute("href");
                cargarPagina(paginaACargar);
            }); //addEventListener
        } //if
    }); //links.forEach
} // linksMain




/************************************************************************************************/
/********                          FUNCION PARA INSCRIPCION.HTML        *************************/
/************************************************************************************************/

//validación del formulario de inscripción
function inscripcion(){
    const formulario = document.getElementById("formulario");
    const nombre = document.getElementById("nombre");
    const email = document.getElementById("email");
    const captcha = document.querySelector(".captcha");
    const reloadBtn = document.querySelector("#reload-btn");
    const inputCaptcha = document.querySelector(".input-captcha input");
    const statusCaptcha = document.querySelector(".status-captcha");
    armarCaptcha();
    


    //defino la funcionaliad del formulario al hacer click en boton submit
    formulario.addEventListener("submit", (e) => { //funcionalidad del boton submit
        e.preventDefault();
        const expRegNombre = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        const expRegEmail = /^(([^<>()\[\]\\.,;:\s@”]+(\.[^<>()\[\]\\.,;:\s@”]+)*)|(“.+”))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
    
        if ( !expRegNombre.test(nombre.value)) {
            return alert("Nombre no válido");
        }
    
        if (!expRegEmail.test(email.value)) {
            return alert("Formato email no válido");
        }
        
        //validación de captcha
        // statusCaptcha.style.display = "block"; //Lo saco porque no respeta las buenas prácticas
        let inputVal = inputCaptcha.value.split('').join(' ');
        if (inputVal == captcha.innerText){
            console.log("Formulario enviado con éxito");
            statusCaptcha.innerText = "Formulario enviado con éxito."
        }
        else {
            statusCaptcha.innerText = "Captcha incorrecto. Inténtelo de nuevo."
        }    
    }); //formulario
    



    //defino la funcionalidad del boton reload
    reloadBtn.addEventListener("click", ()=>{ //funcionalidad del boton reload
        borrarCaptcha();
        armarCaptcha();
    }); //reloadBtn
    
    
    

    // blanquea el captcha
    function borrarCaptcha(){
        inputCaptcha.value = "";
        captcha.innerText = "";
        //statusCaptcha.computedStyleMap.display = "none"; // lo saco porque no respeta las buenas prácticas
        statusCaptcha.innerTet = "";
    } //borrarCaptcha
    

    

    // arma el captcha con 6 caracteres/dígitos al azar
    function armarCaptcha(){
        //armo arreglo con caracteres permitidos 'A'..'Z', 'a'..'z', '0'..'9'
        let caracteres = [];
        for (let caracter='A'; caracter<='Z'; caracter++)
            caracteres.push(caracter);
        for (let caracter='a'; caracter<='z'; caracter++)
            caracteres.push(caracter);
        for (let caracter='0'; caracter<='9'; caracter++)
            caracteres.push(caracter);
    
        
        //elijo 6 caracteres al azar
        for (let i = 0; i<6; i++){
            let caracter = caracteres[Math.floor(Math.random() * caracteres.length)];
            captcha.innerText += ` ${caracter}`;
        }
    } //armarCaptcha
} //inscripcion






/************************************************************************************************/
/********                         FUNCION PARA ALUMNOS.HTML                 *********************/
/************************************************************************************************/

function alumnos(){
    "use strict";
    
    // definicion de constantes, arreglos y variables
    const url = "https://666f2da5f1e1da2be5223295.mockapi.io/api/v1/alumnos";
    let urlFiltrada = new URL(url); // inicialmente sin filtros
    let apellidos = listaDeApellidos();
    let nombres = listaDeNombres();
    let basesMail = listaDeBasesMail();
    const tabla = document.querySelector("#tabla");
    const mensaje = document.querySelector("#mensaje");
    let id_actual = 0; // el id que se está editando o borrando
    let pagina_actual = 1; //pagina que estamos viendo
    const itemsPorPagina = 8; // cuantos alumnos vemos por pagina
    
    // defino botones y los asocio a los eventos
    const btnAlta = document.querySelector(".btn_alta");
    const btnAltaAleatorio = document.querySelector(".btn_alta_aleatorio");
    const btnPrevio = document.querySelector(".btn_previo");
    const btnSgte = document.querySelector(".btn_sgte");
    const cbFiltrar = document.querySelector("#cbfiltrar");
    const txtFiltro = document.querySelector("#txtfiltro");
    const btnFiltrar = document.querySelector(".btn_filtrar");
    btnAlta.addEventListener("click", ingresoNuevoAlumno);
    btnAltaAleatorio.addEventListener("click", nuevoAlumnoAleatorio);
    btnSgte.addEventListener("click", paginaSiguiente);
    btnPrevio.addEventListener("click", paginaPrevia);
    cbFiltrar.addEventListener("change", eligioQueFiltrar);
    btnFiltrar.addEventListener("click", filtrar);
    
    leerAlumnos(); // leo los alumnos de mockapi y muestro la tabla
    
    
    
    
    /****************************** FUNCIONES ****************************************/
    function eligioQueFiltrar(){ // del combo box cbFiltrar eligió una opción de filtrado
        let opcionElegida = this.options[this.selectedIndex];
        if (opcionElegida.value != "no filtrar"){
            //habilito el input y boton de filtrado
            txtFiltro.disabled = false;
            btnFiltrar.disabled = false;
        } else { //eligio no filtrar
            txtFiltro.disabled = true;
            txtFiltro.value = "";
            btnFiltrar.disabled = true;
            pagina_actual=1;
            leerAlumnos();
        }
    } //eligioQueFiltrar
    
    


    //cuando se hace click en btnFiltrar.
    function filtrar(){
        pagina_actual = 1;
        leerAlumnos();
    } // filtrar
    

    

    // en caso que se haya seleccionado filtrar por nombre, email o dni, arma el filtro con el input txtFiltro
    function definirFiltro(){
        urlFiltrada = new URL(url); //filtro en limpio
        let opcionElegida = cbFiltrar.options[cbFiltrar.selectedIndex];
        if (opcionElegida.value == "por nombre")
            urlFiltrada.searchParams.append('nombre', txtFiltro.value);
        else if (opcionElegida.value == "por email")
            urlFiltrada.searchParams.append('email', txtFiltro.value);
        else if (opcionElegida.value == "por dni")
            urlFiltrada.searchParams.append('dni', txtFiltro.value);
    } // definirFiltro
    
    
    
    
    //avanza a la siguiente página con un grupo de alumnos
    function paginaSiguiente(){
        pagina_actual++;
        mensaje.innerHTML = "";
        leerAlumnos();
    } //paginaSiguiente
    

    
    
    // retrocede a la página previa de alumnos
    function paginaPrevia(){
        if (pagina_actual>1){
            pagina_actual--;
            mensaje.innerHTML = "";
            leerAlumnos();
        }
    } //paginaPrevia
    
    

    //permite ingreso de datos de nuevo alumno en un nuevo renglón de la tabla
    function ingresoNuevoAlumno(){ //invocado al hacer click en botón Nuevo Alumno
        deshabilitarBotones();
    
        //creo un nuevo renglón en blanco al final de la tabla y permito ingreso de datos
        tabla.innerHTML += 
        `<tr>
            <td data-label="Nombre"><input type="text"   id="nombre" name="nombre" value=""  required</td>
            <td data-label="Email"> <input type="email"  id="email"  name="email"  value=""  required</td>
            <td data-label="DNI">   <input type="number" id="dni"    name="dni"    value="0" required min="0"</td>
            <td data-label="Nota">  <input type="number" id="nota"   name="nota"   value="0" required min="0" max="100"</td>
            <td data-label="Acciones">
                <button class="btn_alumno btn_ok"><i class="fa fa-check" aria-hidden="true"></i></button>
                &nbsp; 
                <button class="btn_alumno btn_cancel"><i class="fa fa-times" aria-hidden="true"></i></button>
            </td>
        </tr> `;
    
        //asigno los botones ok y cancel
        mensaje.innerHTML = "";
        const btnCancel = document.querySelector(".btn_cancel");
        btnCancel.addEventListener("click", leerAlumnos);
        const btnOk = document.querySelector(".btn_ok");
        btnOk.addEventListener("click", nuevoAlumno);
    } //nuevoAlumno
 
    


    //define las funcionalidad de todos los btn_edicion de la tabla para cuando se les haga click
    function asignarBotonesEdicion(){
        const botones_edicion = document.querySelectorAll(".btn_edicion");
        botones_edicion.forEach(btn => {
            btn.addEventListener("click", (evento) => { // Esta es la funcionalidad del btn_edicion
                let tr = btn.parentNode.parentNode;
                deshabilitarBotones(); //si estoy editando una fila, deshabilito todos los otros botones
    
                //paso al modo edicion
                let nodosEnTr = tr.getElementsByTagName('td');
                let nombre = nodosEnTr[0].textContent; 
                let email  = nodosEnTr[1].textContent;
                let dni    = nodosEnTr[2].textContent; 
                let nota   = nodosEnTr[3].textContent;
                id_actual = tr.getAttribute("que_id");
                
                //en esa fila defino los inputs para que modifique los valores
                let nuevoCodigoHtml = 
                `
                    <td data-label="Nombre"><input type="text"   id="nombre" name="nombre" value="${nombre}" required</td>
                    <td data-label="Email"> <input type="email"  id="email"  name="email"  value="${email}"  required</td>
                    <td data-label="DNI">   <input type="number" id="dni"    name="dni"    value="${dni}"    required min="0"</td>
                    <td data-label="Nota">  <input type="number" id="nota"   name="nota"   value="${nota}"   required min="0" max="100"</td>
                    <td data-label="Acciones">
                        <button class="btn_alumno btn_ok"><i class="fa fa-check" aria-hidden="true"></i></button>
                        &nbsp; 
                        <button class="btn_alumno btn_cancel"><i class="fa fa-times" aria-hidden="true"></i></button>
                    </td>
                `;
                tr.innerHTML = nuevoCodigoHtml;
        
                //asigno los botones ok y cancel
                mensaje.innerHTML = "";
                const btnCancel = document.querySelector(".btn_cancel");
                btnCancel.addEventListener("click", leerAlumnos);
                const btnOk = document.querySelector(".btn_ok");
                btnOk.addEventListener("click", modificarAlumno);
            })
        });
    } //asignarBotonesEdicion
    
    
    
    
    //define las funcionalidad de todos los btn_borrar de la tabla para cuando se les haga click
    function asignarBotonesBorrado(){
        const botones_borrado = document.querySelectorAll(".btn_borrar");
        botones_borrado.forEach(btn => {// Esta es la funcionalidad del btn_borrar
            btn.addEventListener("click", (evento) => {
                let tr = btn.parentNode.parentNode;     //obtengo el elemento fila que contiene al botón
                id_actual = tr.getAttribute("que_id");  //averiguo el id de esta fila
                borrarAlumno();                         //elimino al alumno correspondiente al id
            })
        });
    } // asignarBotonesBorrado
    
    
    

    // deshabilita todos los botones btn_alumno para que no interfieran cuando se está editando una fila
    function deshabilitarBotones(){
        const botones = document.querySelectorAll(".btn_alumno");
        botones.forEach(boton => {
            boton.disabled = true;
        });
    } // deshabilitarBotones
    
    
    

    //lee datos rest, arma la tabla y asigna los botones de cada item de la tabla
    async function leerAlumnos(){
        tabla.innerHTML = ""; // borro la tabla
        let itemsLeidos = 0;  //cantidad de items leidos
        try {
            definirFiltro();  //defino el filtro de busqueda
            // agrego filtro de paginado
            urlFiltrada.searchParams.append('page', pagina_actual);
            urlFiltrada.searchParams.append('limit', itemsPorPagina);
    
            let res = await fetch(urlFiltrada); // pido varios alumnos
            //let res = await fetch(url+"?page="+pagina_actual+"&limit="+itemsPorPagina);
            if (!res.ok) { // no pudo obtenerlos --> error!!!
                mensaje.innerHTML = "Error al obtener datos!!!";
                console.log(res);
                return;
            }
    
            let json = await res.json(); // con esa respuesta obtengo el json con los alumnos
    
            itemsLeidos = json.length;   // para saber cuántos alumnos me envió mockapi
            //armo la tabla con los datos leidos
            for (const alumno of json) {
                tabla.innerHTML += 
                `
                    <tr que_id="${alumno.id}">
                        <td data-label="Nombre">${alumno.nombre}</td>
                        <td data-label="Email">${alumno.email}</td>
                        <td data-label="DNI">${alumno.dni}</td>
                        <td data-label="Nota">${alumno.nota}</td>
                        <td data-label="Acciones">
                            <button class="btn_alumno btn_edicion"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>
                            &nbsp; 
                            <button class="btn_alumno btn_borrar"><i class="fa fa-trash-o" aria-hidden="true"></i></button>
                        </td>
                    </tr>
                `;
            }
            asignarBotonesEdicion(); // en esa nueva tabla asigno la funcionalidad de los botones de c/fila
            asignarBotonesBorrado();
        } catch (error) {
            console.log(error);
            mensaje.innerHTML = "Error de comunicación: " + error;
        }
    
        //habilito el boton de alta, altaAleatorio, cbFiltrar, siguiente y previo
        btnAlta.disabled = false;
        btnAltaAleatorio.disabled = false;
        cbFiltrar.disabled = false;
    
        btnPrevio.disabled = (pagina_actual<=1);             //deshabilito si ya esta en primer pagina
        btnSgte.disabled   = (itemsLeidos < itemsPorPagina); //deshabilito si ya esta en ultima pagina
    }// leerAlumnos
       
    

    
    // crea un alumno con datos aleatorios y lo da de alta
    function nuevoAlumnoAleatorio(){
        for (let i=1;i<=1;i++)
            altaAlumno(alumnoAleatorio());
        // tabla.innerHTML = "";
        // setTimeout(leerAlumnos(),3000);
    }// nuevoAlumnoAleatorio
    
    
    
    
    // hace el alta rest de los inputs
    function nuevoAlumno(){
        //armo el JSON con el alumno en base a los inputs
        let nombre = document.querySelector("#nombre").value;
        let email  = document.querySelector("#email").value;
        let dni    = document.querySelector("#dni").value;
        let nota   = document.querySelector("#nota").value;
    
        let alumno = {
            "nombre" : nombre,
            "email"  : email,
            "dni"    : dni, 
            "nota"   : nota
        }
    
        //invoco a alta con ese alumno
        altaAlumno(alumno);
        //leerAlumnos();
    } //nuevoAlumno
    
    
    
    
    // al alumno pasado como parámetro lo da de alta rest en mockapi
    async function altaAlumno(alumno){
        try{
            let res = await fetch(url, {
                "method"    : "POST", 
                "headers"   : {"Content-type": "application/json"},
                "body"      : JSON.stringify(alumno)
            });
            if (res.status === 201) {
                mensaje.innerHTML = "Creado!";
                leerAlumnos();
            } 
            else 
                mensaje.innerHTML = "Error al dar alta a alumno: " + res.status;
        } catch (error) {
            console.log(error);
            mensaje.innerHTML = "Error de comunicación!!!" + error;
        }
    } //altaAlumno
    
    
    
    
    // hace el borrado rest del id_actual
    async function borrarAlumno() {
        try{
            let res = await fetch(`${url}/${id_actual}`, {
                "method"    : "DELETE"
            });
            if (res.status === 200) {
                mensaje.innerHTML = "Borrado!";
                leerAlumnos();
            } 
            else 
                mensaje.innerHTML = "Error al borrar alumno: " + res.status;
        } catch (error) {
            console.log(error);
            mensaje.innerHTML = "Error de comunicación!!!" + error;
        }
    } //borrarAlumno
    
    
    

    // hace el alta rest de los inputs de la fila que se está editando
    async function modificarAlumno(){
        // armo el JSON con el alumno en base a los inputs
        let nombre = document.querySelector("#nombre").value;
        let email  = document.querySelector("#email").value;
        let dni    = document.querySelector("#dni").value;
        let nota   = document.querySelector("#nota").value;
    
        let alumno = {
            "nombre" : nombre,
            "email"  : email,
            "dni"    : dni, 
            "nota"   : nota
        }
    
        // modifico el alumno en mockapi
        try{
            let res = await fetch(`${url}/${id_actual}`, {
                "method"    : "PUT", 
                "headers"   : {"Content-type": "application/json"},
                "body"      : JSON.stringify(alumno)
            });
            if (res.status === 200) {
                mensaje.innerHTML = "Modificado!";
                leerAlumnos();
            }
            else 
                mensaje.innerHTML = "Error al modificar alumno: " + res.status;
        } catch (error) {
            console.log(error);
            mensaje.innerHTML = "Error de comunicación!!!" + error;
        }
    } //modificarAlumno
    
    
    
    
    
    /********************** GENERACION DE DATOS ALEATORIOS  **************************/
    
    function azar(desde, hasta){// devuelve número al azar entre desde y hasta
        return Math.floor((Math.random()*(hasta-desde+1)) + desde);
    } //azar
    
    

    function dniAleatorio(){ // devuelve un dni aleatorio entre 10M y 99M
        return azar(10000000, 99999999);
    } //dniAleatorio
    

    
    function notaAleatoria(){ // devuelve una nota aleatoria entre 1 y 100
        return azar(1, 100);
    } // notaAleatoria
    
    

    function emailAleatorio(nombre, apellido){ //devuelve un email aleatorio basado en nombre y apellido
        let tipoMail = azar(1,4); //elijo 1 de 4 estilos de mail
        let mail = "";
        if (tipoMail==1)        // solo nombre
            mail = nombre;
        else if (tipoMail==2)   // solo apellido
            mail = apellido;
        else if (tipoMail==3)   // 1er letra nombre y apellido
            mail = nombre.charAt(0) + apellido;
        else if (tipoMail==4)   // nombre y 1er letra apellido
            mail = nombre.charAt(0) + apellido;
        
        if (azar(1,5)==1)       // en 1 de c/5 mails le agrego 2 digitos aleatorios al final
            mail += azar(1,99);
    
        return mail + basesMail[azar(0,basesMail.length-1)];
    } // mailAleatorio
    
    

    function nombreAleatorio(){ // devuelve un nombre aleatorio de una lista de casi 100 nombres
        return nombres[azar(0,nombres.length-1)];
    } // nombreAleatorio
    
    

    function apellidoAleatorio(){ // devuelve un apellido aleatorio de una lista de casi 70 apellidos
        return apellidos[azar(0,apellidos.length-1)];
    } //apellidoAleatorio
    

    
    function minusculaYSinTildes(s){ // saca todos los signos diacriticos (tildes, etc) y lo transforma a minúsculas
        return s
                .toLowerCase()
                .normalize('NFD')
                .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
                .normalize();
    } //minusculaYSinTildes
    

    
    function alumnoAleatorio(){ // devuelve un JSON con los datos aleatorios de un alumno
        let nombre = nombreAleatorio();
        let apellido = apellidoAleatorio();
        let alumno = {
            "nombre" : nombre + " " + apellido,
            "email"  : emailAleatorio(minusculaYSinTildes(nombre), minusculaYSinTildes(apellido)),
            "dni"    : dniAleatorio(), 
            "nota"   : notaAleatoria()
        }
        return alumno;
    } // alumnoAleatorio
    
    


    /***************** LISTA DE NOMBRES, APELLIDOS Y BASES MAIL PARA GENERACION ALEATORIA ****************/
    function listaDeApellidos(){
        return [
            "Acosta",
            "Aguirre",
            "Álvarez",
            "Arias",
            "Benitez",
            "Bianchi",
            "Cabrera",
            "Cáceres",
            "Cardoso",
            "Carrizo",
            "Castillo",
            "Castro",
            "Coronel",
            "Domínguez",
            "Fernández",
            "Ferreira",
            "Flores",
            "García",
            "Giménez",
            "Godoy",
            "Gómez",
            "González",
            "Gutierrez",
            "Hernández",
            "Herrera",
            "Juárez",
            "Ledesma",
            "López",
            "Luna",
            "Martínez",
            "Medina",
            "Molina",
            "Morales",
            "Moreno",
            "Muñoz",
            "Navarro",
            "Nuñez",
            "Ojeda",
            "Ortiz",
            "Peralta",
            "Pereyra",
            "Pérez",
            "Quiroga",
            "Ramírez",
            "Ramos",
            "Ríos",
            "Rodríguez ",
            "Rojas",
            "Romero",
            "Ruiz",
            "Sánchez",
            "Sánchez",
            "Silva",
            "Sosa",
            "Suárez",
            "Torres",
            "Vargas",
            "Vásquez",
            "Vega",
            "Vera",
            "Villalba",
        ];
    } // listaDeApellidos
    



    function listaDeNombres(){
        return [
            "Adam ",
            "Adrián",
            "Agustín",
            "Alba",
            "Alejandro",
            "Alex",
            "Alexander",
            "Álvaro",
            "Andrea",
            "Andrés",
            "Antonio",
            "Armando",
            "Arnau",
            "Benjamín",
            "Camila",
            "Carla",
            "Carlos",
            "Carmen ",
            "Catalina",
            "Christopher",
            "Claudia",
            "Daniel",
            "Daniel",
            "Daniela",
            "David",
            "Delfina",
            "Diego",
            "Emiliano",
            "Felipe",
            "Fernanda",
            "Francisco",
            "Gonzalo",
            "Hugo",
            "Iker",
            "Irene",
            "Isabel",
            "Isabella",
            "Isidora",
            "Janeth",
            "Javier",
            "Jayden",
            "Joan",
            "Joaquín",
            "José",
            "Juan",
            "Julia",
            "Julieta",
            "Justin",
            "Laia",
            "Laura",
            "Lautaro",
            "Lázaro",
            "Leonardo",
            "Lucía ",
            "Marc",
            "María",
            "Mariana",
            "Mario",
            "Marta",
            "Martina",
            "Mateo",
            "Mateo",
            "Matías",
            "Maximilano",
            "Mía",
            "Mohamed",
            "Morena",
            "Nerea",
            "Nicolás",
            "Oscar",
            "Pablo",
            "Pau",
            "Paula",
            "Pol",
            "Renata",
            "Roberto",
            "Romina",
            "Salma",
            "Santiago",
            "Santino",
            "Sara",
            "Sebastián",
            "Sergio",
            "Sofía",
            "Thiago",
            "Tomás",
            "Valentina",
            "Valentino",
            "Victoria",
            "Ximena",
            "Yanet",
            "Yoanis",
            "Yuri",
            "Yusimí",
            "Zulema"
        ];
    } //listaDeNombres
    



    function listaDeBasesMail(){
        return [
            "@gmail.com",
            "@yahoo.com",
            "@hotmail.com",
            "@exa.unicen.edu.ar",
            "@sisptandil.gob.ar", 
        ];
    } // listaDeBasesMail
    
    
    

    const unaListaDeAlumnos=[ // No usada, solo usada para pruebas.
        {
            nombre:"Juan Pérez",
            email: "juan@exa.unicen.edu.ar",
            dni:   "123456789", 
            nota:  "85",
        },
        {
            nombre:"Maria López",
            email: "maria@exa.unicen.edu.ar",
            dni:   "987654321", 
            nota:  "92",
        },
        {
            nombre:"Pedro Ramirez",
            email: "pedro@exa.unicen.edu.ar",
            dni:   "555123456", 
            nota:  "78",
        },
        {
            nombre:"Ana Martínez",
            email: "ana@exa.unicen.edu.ar",
            dni:   "444987654", 
            nota:  "88",
        },
        {
            nombre:"Luis González",
            email: "luis@exa.unicen.edu.ar",
            dni:   "333456789", 
            nota:  "95",
        },
        {
            nombre:"Laura Sánchez",
            email: "laura@exa.unicen.edu.ar",
            dni:   "222987654", 
            nota:  "87",
        },
        {
            nombre:"Carlos Fernandez",
            email: "carlos@exa.unicen.edu.ar",
            dni:   "111456789", 
            nota:  "80",
        },
        {
            nombre:"Sara Jiménez",
            email: "sara@exa.unicen.edu.ar",
            dni:   "999987654", 
            nota:  "91",
        },
        {
            nombre:"Javier López",
            email: "javier@exa.unicen.edu.ar",
            dni:   "888456789", 
            nota:  "82",
        },
        {
            nombre:"Elena Rodríguez",
            email: "elena@exa.unicen.edu.ar",
            dni:   "777987654", 
            nota:  "89",
        },
        {
            nombre:"Diego Pérez",
            email: "diego@exa.unicen.edu.ar",
            dni:   "666456789", 
            nota:  "84",
        },
        {
            nombre:"Marta Ruiz",
            email: "marta@exa.unicen.edu.ar",
            dni:   "555987654", 
            nota:  "93",
        },
        {
            nombre:"Julia García",
            email: "julia@exa.unicen.edu.ar",
            dni:   "444456789", 
            nota:  "86",
        },
        {
            nombre:"Pablo Martín",
            email: "pablo@exa.unicen.edu.ar",
            dni:   "333987654", 
            nota:  "79",
        },
        {
            nombre:"Silvia Hernández",
            email: "silvia@exa.unicen.edu.ar",
            dni:   "222456789", 
            nota:  "90",
        },
    ]; // unaListaDeAlumnos
    

} // alumnos    

