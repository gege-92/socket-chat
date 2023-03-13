
var socket = io();

var params = new URLSearchParams( window.location.search )

if(!params.has('nombre') || !params.has('sala') ){
    window.location = 'index.html';
    throw new Error('El nombre/sala es necesario.');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}


socket.on('connect', () => {
    console.log('Conectado al servidor');

    socket.emit('entrar-chat', usuario, (respServer) => {

            console.log('Usuarios conectados a la sala: ', respServer);
            renderizarUsuarios(respServer);
    })

});


socket.on('disconnect', () => {

    console.log('Perdimos conexión con el servidor');

});


socket.on('enviar-mensaje', ( mensaje ) => {

    console.log('Desde el Server: ', mensaje);
    renderizarChat(mensaje, false);
    scrollBottom();

});


socket.on('lista-usuarios', ( usuarios ) => {

    console.log('Users: ', usuarios);
    renderizarUsuarios(usuarios);

});


//mensajes privados
socket.on('mensaje-privado', (mensaje) => {
    //console.log(mensaje);
    renderizarChat(mensaje, false);
    scrollBottom();
})
