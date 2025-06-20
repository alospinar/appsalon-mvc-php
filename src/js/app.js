let paso = 1;
const pasoInicial =1;
const pasoFinal =3;

const cita = {
    id:'',
    nombre:'',
    fecha:'',
    hora:'',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function(){
    iniciarApp();
});


function iniciarApp (){
    mostrarSeccion();// muestra y oculta la seccion
    tabs ();//cambia la seccion cuando se presionen los tabs
    botonesPaginador(); //agregar o quita al paginador
    paginaSiguiente();
    paginaAnterior();

    consultarAPI();//consulta la API en el backend en PHP

    idCliente();
    nombreCliente();//añade el nombre del cliente al objeto de cita
    seleccionarFecha();//añade la fecha de la cita en el objeto 
    seleccionarHora(); //añade la hora  de la cita en el objeto 

    mostrarResumen(); //muestra el resumen de la cita
}

function mostrarSeccion(){

    //ocultar la seccion que tenga la clase de mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');
    }
    
    //seleccionar la seccion con el paso...
    const pasoSelector = `#paso-${paso}`;
    const seccion = document.querySelector(pasoSelector);
    seccion.classList.add('mostrar');

    //quita la clase de actual al tab anterior
    const tabAnterior = document.querySelector('.actual');
    if(tabAnterior){
        tabAnterior.classList.remove('actual');
    }


    //resalta el tab actual
    const tab = document.querySelector(`[data-paso="${paso}"]`);
    tab.classList.add('actual');
}

function tabs (){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach(boton=>{
        boton.addEventListener('click',function(e){
            paso=parseInt(e.target.dataset.paso);
            mostrarSeccion();

            botonesPaginador();
            
        });
    })
}

function botonesPaginador(){
    const paginaAnterior =document.querySelector('#anterior');
    const paginaSiguiente =document.querySelector('#siguiente');

    if(paso===1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso===3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}
function paginaSiguiente(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', function(){
        if(paso<=pasoInicial) return ;    
        paso--;

        botonesPaginador();
    })
}

function paginaAnterior(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', function(){
        if(paso>=pasoFinal) return ;    
        paso++;

        botonesPaginador();
    })
}

async function consultarAPI(){

    try {
        //para copiar podemos cambiar `location.origin` cuando tenemos el backend y fronted separados
        const url='/api/servicios';
        const resultado= await fetch(url);
        const servicios = await resultado.json();
        mostrarServicios(servicios);
    } catch (error) {
        
    }
}

function mostrarServicios(servicios){
    servicios.forEach(servicio=>{
        const {id,nombre,precio} = servicio;

        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent=nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent= precio;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick= function(){
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    })
}
function seleccionarServicio(servicio){
    const { id } = servicio;
    const { servicios }=cita;
    //identificar el elemento al que se le da click
    const divServicio= document.querySelector(`[data-id-servicio="${id}"]`)
    //comprobar si un servicio ya fue seleccionado 
    if(servicios.some( agregado=> agregado.id=== id)){
        //eliminarlo
        cita.servicios=servicios.filter(agregado => agregado.id !==id);
        divServicio.classList.remove('seleccionado')
    }else{
        //agregarlo
        cita.servicios= [...servicios,servicio];//en este codigo estamos copiando la informacion de servicios a un nuevo objeto llamado servicio para que me muestre la informacion consecutiva sin tener arrays vacios.
        divServicio.classList.add('seleccionado')
    }


}

function idCliente(){
    const Id= document.querySelector('#id').value ;
    cita.id = Id ;   
}

function nombreCliente(){
    const nombre= document.querySelector('#nombre').value ;
    cita.nombre = nombre ;

}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input',function(e){

        const dia = new Date(e.target.value).getUTCDay();
        if([6,0].includes(dia)){
            e.target.value='';
            mostrarAlerta('fines de semana no permitidos','error','.formulario');
        }else {
            cita.fecha=e.target.value ;
        }
    })
}

function seleccionarHora(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input',function(e){
        const horaCita = e.target.value ;
        const hora = horaCita.split(":")[0];
        if (hora<10 || hora>18){
            e.target.value='';
            mostrarAlerta('Hora no valida','error','.formulario');
        } else {
            cita.hora =e.target.value ;
        }

    })
}

function mostrarAlerta(mensaje, tipo, elemento,desaparece=true){
    
    //previene que se generen mas de 1 alerta
    const alertaPrevia =document.querySelector('.alerta');
    if(alertaPrevia) {
        alertaPrevia.remove();
    }

    //scripting para crear la alerta
    const alerta = document.createElement('DIV');
    alerta.textContent=mensaje ;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia =document.querySelector(elemento);
    referencia.appendChild(alerta);
    if(desaparece){
        //eliminar la alerta
        setTimeout(() => {
            alerta.remove();
        }, 3000);       
    }

}

function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');
    
    //LIMPIAR EL CONTENIDO DE Resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }
    if(Object.values(cita).includes('')|| cita.servicios.length===0){
        mostrarAlerta('falta datos de servicios, fecha u Hora','error','.contenido-resumen',false);
        return ;
    } 

    //Formatear el div de resumen

    const {nombre,fecha,hora, servicios} =cita;



    //Heading para servicios en resumen
    const headingServicios =document.createElement('H3');
    headingServicios.textContent= 'Resumen de Servicios';
    resumen.appendChild(headingServicios);

    //iterando y mostrando los servicios
    servicios.forEach(servicio => {
        const {id,precio,nombre} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent= nombre;

        const precioServicio = document.createElement('P');
        precioServicio.innerHTML =`<span> Precio : </span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        resumen.appendChild(contenedorServicio);
    })
    //Heading para cita en resumen
    const headingCita =document.createElement('H3');
    headingCita.textContent= 'Resumen de Cita';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML= `<span>Nombre:</span> ${nombre}`;

    //formatear la fecha en espanol
    const fechaObj = new Date(fecha);
    const mes = fechaObj.getMonth();
    const dia = fechaObj.getDate()+2;
    const year = fechaObj.getFullYear();

    const fechaUTC = new Date(Date.UTC(year,mes,dia));

    const opciones = {weekday:'long',year:'numeric',month: 'long',day:'numeric'}
    const fechaFormateada = fechaUTC.toLocaleDateString('es-CO',opciones);

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML= `<span>fecha:</span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML= `<span>hora:</span> ${hora} Horas`;

    //boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.classList.add('boton');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.onclick = reservarCita;

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita() {
    const {nombre,fecha,hora, servicios,id} = cita;
    const idServicios = servicios.map(servicio => servicio.id);

    const datos = new FormData();
    
    datos.append('fecha',fecha);
    datos.append('hora',hora);
    datos.append('usuarioId',id);
    datos.append('servicios',idServicios);

    try {
        //peticion hacia la api
        const url = '/api/citas'

        const respuesta = await fetch(url,{
            method: 'POST',
            body:datos
        });

        const resultado = await respuesta.json();
        if(resultado.resultado){
            Swal.fire({
                icon: "success",
                title: "Cita creada",
                text: "Tu cita fue creada correctamente",
                button: 'OK'
            }).then(()=> {
                setTimeout(()=>{
                    window.location.reload();
                },3000);
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Hubo un error a guardar la citas",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
    }
    

    //console.log([...datos]) para ver lo que se envia en el navegador
}