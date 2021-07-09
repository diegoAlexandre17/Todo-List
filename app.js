/* -----VARIABLES------ */

const formulario = document.getElementById('formulario');
const listaTareas = document.getElementById('lista-tareas');
const template = document.getElementById('template').content;
const fragment = document.createDocumentFragment();

let tareas = {}


/* -----EVENTOS------ */


document.addEventListener('DOMContentLoaded', e => {
    if (localStorage.getItem('tareas')) { //Consultamos a ver si hay tareas en el local storage, y si las hay, al cargar de nuevo el documento, nuestro objeto vacio tareas, tendra ahora las tareas que se encuentran en el local storage.
        tareas = JSON.parse(localStorage.getItem('tareas'));
    }
    pintarTareas()
})

listaTareas.addEventListener('click', (e) => {
    btnAccion(e);
})

formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    setTarea(e)

})

/* -----FUNCIONES------ */

const btnAccion = (e) => {
    if (e.target.classList.contains('fa-check-circle')) {
        tareas[e.target.dataset.id].estado = true;
        pintarTareas(); //Llamamos el metodo para actualizar la tarea en el dom
        console.log(tareas);
    } //Cuando hacemos click en los botones de la tarea, le cambiamos el estado a true, y si no la eliminamos.

    if (e.target.classList.contains('fa-minus-circle')) {
        delete tareas[e.target.dataset.id];
        //Borramos el elemento con el id que hizo click, y luego pintamos de nuevo las tareas, para actualizar el dom
        pintarTareas();
    }

    if (e.target.classList.contains('fa-undo-alt')) {
        //Si el usuario presiona el boton undo-alt, le cambia el estado por false.
        tareas[e.target.dataset.id].estado = false;
        pintarTareas(); //Llamamos el metodo para actualizar la tarea en el dom
    }

    e.stopPropagation();
};

const setTarea = e => {
    if (e.target.querySelector('input').value.trim() === '') {
        return
    }

    const tarea = {
        id: Date.now(), //Para generar un id unico con el objeto Date
        texto: e.target.querySelector('input').value,
        estado: false
    }

    tareas[tarea.id] = tarea; //Le agregamos la tarea con lo que escribio el usuario y creamos una propiedad nueva en el ovbjeto Tareas.(Si no tiene ese indice, lo va a crear, y si existe pero tiene otros elementos, lo va a sobreescribir)

    console.log(tareas)

    formulario.reset() //Para resetear el formulario cuando el usuario haya dado click.

    e.target.querySelector('input').focus() //Para colocar el focus en el input cuando el usuario haya dado click.

    pintarTareas();
};

const pintarTareas = () => {

    localStorage.setItem('tareas', JSON.stringify(tareas));//Almacenamos en el local storage, las tareas que tenemos, primeramente parseandolas a un string con el metodo JSON.stringify()

    if (Object.values(tareas).length === 0) {//Si no tenemos tareas en el objeto tareas, colocamos este html 
        listaTareas.innerHTML = `
            <div class="alert alert-dark">
                No hay tareas pendientes ✌
            </div>`;

        return
    }

    listaTareas.innerHTML = ''; //Limpiamos el DOM para inyectar nuestra nueva coleccion de objetos(tareas).

    Object.values(tareas).forEach(tarea => { //Object.values() devuelve un array cuyos elementos son valores de propiedades enumarables que se encuentran en el objeto. Luego lo recorremos con un forEach.

        const clone = template.cloneNode(true); //Clonamos el template para poder utilizarlo.

        clone.querySelector('p').textContent = tarea.texto;

        if (tarea.estado) { //Aca verificamos si el estado de la tarea es true
            clone.querySelector('.alert').classList.replace('alert-warning', 'alert-primary');

            clone.querySelectorAll('.fas')[0].classList.replace('fa-check-circle', 'fa-undo-alt');

            clone.querySelector('p').style.textDecoration = 'line-through';

        }

        clone.querySelectorAll('.fas')[0].dataset.id = tarea.id;
        clone.querySelectorAll('.fas')[1].dataset.id = tarea.id;

        fragment.appendChild(clone) //Agregamos al fragment nuestro clon del template.
    })

    listaTareas.appendChild(fragment) //Ahora fuera del foreach para evitar el reflow, le colocamos a listaTareas nuestro fragment.

};



