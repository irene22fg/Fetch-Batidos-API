let baseURL = 'http://20.123.169.43:8080/BatidosRestAuto-1.0-SNAPSHOT/api';

const DOM = {
    input: document.getElementById('id'),
    buscar: document.getElementById('buscar'),
    encontrado: document.getElementById('encontrado'),
    ingredientes: document.getElementById('ingredientes'),
}

DOM.buscar.addEventListener('click', async (event) => {
    event.preventDefault();
    borrarNodos(DOM.encontrado);
    estilos(DOM.encontrado);
    estilos(DOM.ingredientes);
    let id = DOM.input.value
    await fetch(`${baseURL}/batidos/${id}`)
        .then(checkResponse)
        .then(response => response.json())
        .then(response => {mostrarBatido(response);getIngredientes(response.frutas)})
        .catch(e => alert(`${e.message} - Error al encontrar el batido`))
});

function mostrarBatido(batido){
    estilos(DOM.encontrado)
    let ingredientes = arrayIngredientes(batido.frutas)
    DOM.encontrado.appendChild(crearNodo('p', `Batido de ${ingredientes} con extras de ${batido.extras}.`, [], []))
}

function crearContainers(fruta){
    DOM.ingredientes.appendChild(crearNodo('div', '', ['ingrediente', 'buscando'], [{name:'id', value:fruta.trim()}]));
}

function arrayIngredientes(response){
    response = response.slice(1);
    response = response.slice(0,-1);
    return response.split(', ');
}

function getIngredientes(response){
    estilos(DOM.ingredientes)
    let ingredientesObtenidos = arrayIngredientes(response);
    encontrarFrutas(ingredientesObtenidos);
    ingredientesObtenidos.forEach(element => crearContainers(element));
}

async function encontrarFrutas(ingredientes){
    borrarNodos(DOM.ingredientes)
    await ingredientes.forEach(ingrediente =>{
        fetch(`./script/frutas.json`)
            .then(checkResponse)
            .then(response => response.json())
            .then(response => response.find(fruta => fruta.name == ingrediente.trim()))
            .then(response => mostrarFruta(response.image, response.name))
            .catch(e => alert(`${e.message} - Error al encontrar las frutas`))
    })
}

function mostrarFruta(imgURL, name){
    fetch(imgURL)
        .then(checkResponse)
        .then(response => response.blob())
        .then(createImgFromBlob)
        .then(response => addToContentElement(response, name))
        .catch(e => alert(`${e.message} - Error al mostrar la imagen`))
}

const createImgFromBlob = blob => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    return img;
}

function addToContentElement(element, name) {
    let divContainer = document.getElementById(name)
    estilos(divContainer);
    divContainer.appendChild(element)
}

const checkResponse = response => {
    if(!response.ok) throw new Error('No encontramos conexión con el servidor');
    return response;
}

function estilos(nodo){
    nodo.classList.toggle('buscando');
}

function crearNodo(tipo, texto, clases, atributos) {     //función CREAR NODO
    let nodo = document.createElement(tipo);
    if (texto != "" && texto != null) {
        nodo.appendChild(document.createTextNode(texto));
    }
    if (clases.length > 0) {
        clases.forEach(clase => nodo.classList.add(clase));
    }
    if (atributos.length > 0) {
        atributos.forEach(atributo => nodo.setAttribute(atributo.name, atributo.value));
    }
    return nodo;
}

function borrarNodos(nodo){
    while (nodo.firstChild) {
        nodo.removeChild(nodo.lastChild);
    }
}