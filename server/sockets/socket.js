const { io } = require('../server');

const Usuarios = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');


const usuario = new Usuarios();

io.on('connection', (client) => {

    //console.log('Usuario conectado: ', client.id);
    
    //cliente se conecta
    client.on('entrar-chat', (payload, callback) => {
        
        //console.log('cliente ', payload);

        if(!payload.nombre || !payload.sala){
            callback({
                ok: false,
                msg: 'El nombre y la sala son obligatorios'
            })
        } else {

            client.join(payload.sala);

            //const persona = usuario.agregarPersona(client.id, payload.nombre, payload.sala);
            usuario.agregarPersona(client.id, payload.nombre, payload.sala);

            const personasPorSala = usuario.getPersonasPorSala( payload.sala );

            client.broadcast.to(payload.sala).emit('lista-usuarios', usuario.getPersonasPorSala( payload.sala ) ); //actualizo la info cuando alguien se conecta a la misma sala

            client.broadcast.to(payload.sala).emit('enviar-mensaje', crearMensaje( 'Admin', `${ payload.nombre } se ha conectado` ) );

            callback(personasPorSala);
            
            //Notificacion al server
            console.log('\nUn usuario ingreso al server: ', '\n', payload, '\nID: ', client.id, '\n');
        }
        
    })

    //cliente se desconecta
    client.on('disconnect', ()  => {

        const personaBorrada = usuario.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('enviar-mensaje', crearMensaje( 'Admin', `${ personaBorrada.nombre } se ha desconectado` ) );

        client.broadcast.to(personaBorrada.sala).emit('lista-usuarios', usuario.getPersonasPorSala( personaBorrada.sala ) ); //actualizo la info cuando se desconecta un user en la sala

        //Notificacion al server
        console.log('\nUn usuario salio del server:\n', personaBorrada);

    })

    //enviar mensaje
    client.on('enviar-mensaje', (data, callback) => {

        let persona = usuario.getPersona(client.id);

        let mensaje = crearMensaje( persona.nombre, data.msg );

        client.broadcast.to(persona.sala).emit('enviar-mensaje', mensaje);

        callback(mensaje);
    })

    //mensajes privados
    client.on('mensaje-privado', (data, callback) => {

        let persona = usuario.getPersona( client.id );

        let mensaje = crearMensaje( persona.nombre, data.msg );

        client.broadcast.to(data.enviarPrivado).emit('mensaje-privado', mensaje);

        callback(mensaje);

    })

});