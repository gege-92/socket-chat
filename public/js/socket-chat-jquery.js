//funciones para modificar y/o renderizar el HTML


var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre');
var sala = params.get('sala');


//referencias HTML
var divUsuarios = document.querySelector('#divUsuarios');
var formEnviar  = document.querySelector('#formEnviar');
var txtMensaje  = document.querySelector('#txtMensaje');
var divChatbox  = document.querySelector('#divChatbox');
var filter      = document.querySelector('#filter');
var txtId       = document.querySelector('#txtId');



const renderizarUsuarios = (personas) => {  //  [{}, {}, {}]

    var html = '';

    var randomUser = Math.floor(Math.random() * (8 - 1) ) + 1;

    html += `<li>
                <a href="javascript:void(0)" class="active"> Chat de <span> ${ sala }</span></a>
            </li>
            `;          

    personas.forEach( persona => {  // ({ id, nombre, sala})

        html += `<li>
                    <a data-id="${ persona.id }" href="javascript:void(chatClick('${ persona.id}'))"><img src="assets/images/users/${randomUser}.jpg" alt="user-img" class="img-circle"> <span>${ persona.nombre }<small class="text-success">online</small></span></a>
                </li>
                `;

    });

    divUsuarios.innerHTML = html;

}


//renderizar Chat
const renderizarChat = ( mensaje, yo ) => {  
    
    var chatHtml = '';

    var randomUser = Math.floor(Math.random() * (8 - 1) ) + 1;

    var chatTime = new Date(mensaje.fecha);
    var hour = chatTime.getHours();
    var minutes = chatTime.getMinutes();

    var user = mensaje.nombre;

    var info = 'info';


    if(user === 'Admin'){
        info = 'danger';
    }

    if( yo ){

        chatHtml += `<li class="reverse">
                        <div class="chat-content">
                            <h5>${ mensaje.nombre }</h5>
                            <div class="box bg-light-inverse">${ mensaje.mensaje }</div>
                        </div>
                        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                        <div class="chat-time">${ hour }:${ minutes }</div>
                    </li>
                    `;
    } else {

        if(user === 'Admin'){

        chatHtml += `<li class="animated fadeIn">
                        <div class="chat-content">
                            <h5>${ mensaje.nombre }</h5>
                            <div class="box bg-light-${info}">${ mensaje.mensaje }</div>
                        </div>
                        <div class="chat-time">${ hour }:${ minutes }</div>
                    </li>
                `;

        } else {

        chatHtml += `<li class="animated fadeIn">
                        <div class="chat-img"><img src="assets/images/users/${randomUser}.jpg" alt="user" /></div>
                            <div class="chat-content">
                                <h5>${ mensaje.nombre }</h5>
                                <div class="box bg-light-info">${ mensaje.mensaje }</div>
                            </div>
                        <div class="chat-time">${ hour }:${ minutes }</div>
                    </li>
                    `;
        }
    }

    divChatbox.innerHTML += chatHtml;

}


//Listeners jQuery


const chatClick = (id) => {

    txtId.value = id;

}


const scrollBottom = () => {

    divChatbox.scrollTop = divChatbox.scrollHeight - divChatbox.clientHeight;
}


//filtrar usuarios
const search = () => {

    var valueFilter = filter.value.toUpperCase();
    var divUsuariosArr = divUsuarios.getElementsByTagName('li')

    for(let i = 1 ; i < divUsuariosArr.length ; i++){

        let li = divUsuariosArr[i].getElementsByTagName('span')[0];

        if( li ){

            let textValue = li.textContent;

            if( textValue.toUpperCase().indexOf( valueFilter ) > -1 ){
                divUsuariosArr[i].style.display = '';
            }else{
                divUsuariosArr[i].style.display = 'none';
            }

        }
        
    }

}


formEnviar.addEventListener('submit', (evento) => {

    evento.preventDefault();

    var mensaje = txtMensaje.value;

    if( mensaje.trim().length === 0 ){
        return;
    }

    var payload = { 
        nombre: nombre,
        msg: mensaje,
    }


    if( !id.trim() ){
        socket.emit('enviar-mensaje', payload, (resp) => {
                //console.log('Respuesta server: ', resp);
                txtMensaje.value = ''
                txtMensaje.focus();

                renderizarChat(resp, true);
                scrollBottom();
            });

    } else {

        socket.emit('mensaje-privado', payload, (resp) => {

            txtMensaje.value = ''
            txtMensaje.focus();
            txtId.value = '';
    
            renderizarChat(resp, true);
            scrollBottom();
        });

    }

})



module.exports = {
    renderizarUsuarios
}