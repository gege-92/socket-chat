//clase para el manejo de usuarios

// {
//     id: "",
//     nombre: ""
// }


class Usuarios{

    constructor(){

        this.personas = [];

    }

    agregarPersona( id, nombre, sala ){

        let persona = {
            id: id,
            nombre: nombre,
            sala: sala
        }

        this.personas.push( persona );

        return this.personas; //devuelvo el array de TODAS las personas
    }

    getPersona( id ){

        const persona = this.personas.filter( persona => {
            return persona.id === id;
        })[0]; //filter() devuelve un array. posicion 0

        return persona;

    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala( sala ){

        const personasPorSala = this.personas.filter( persona => {
            return persona.sala === sala;
        })

        return personasPorSala;
    }

    borrarPersona( id ){

        let personaBorrada = this.getPersona( id );

        this.personas = this.personas.filter( persona => {
            return persona.id != id;
        })

        return personaBorrada;

    }

}


module.exports = Usuarios;