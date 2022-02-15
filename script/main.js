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
        .then(response => {estilos(DOM.encontrado); estilos(DOM.ingredientes);})
        .catch(e => alert(e.message))
});

function mostrarBatido(batido){
    DOM.encontrado.appendChild(crearNodo('div', `Batido de ${batido.frutas} con extras de ${batido.extras}`, [], []))
}

function getIngredientes(response){
    response = response.slice(1);
    response = response.slice(0,-1);
    let ingredientesObtenidos = response.split(', ');
    encontrarFrutas(ingredientesObtenidos);
}

async function encontrarFrutas(ingredientes){
    borrarNodos(DOM.ingredientes)
    await ingredientes.forEach(ingrediente =>{
        fetch(`./script/frutas.json`)
            .then(checkResponse)
            .then(response => response.json())
            .then(response => response.find(fruta => fruta.name == ingrediente.trim()))
            .then(response => mostrarFruta(response.image))
            .catch(e => alert(e.message))
    })
}

function mostrarFruta(imgURL){
    fetch(imgURL)
        .then(checkResponse)
        .then(response => response.blob())
        .then(createImgFromBlob)
        .then(addToContentElement)
        .catch(e => alert(e.message))
}

const createImgFromBlob = blob => {
    const img = new Image();
    img.src = URL.createObjectURL(blob);
    return img;
}

const addToContentElement = element => {
    let divContainer = crearNodo('div', "", ['ingrediente'], []);
    divContainer.appendChild(element)
    DOM.ingredientes.appendChild(divContainer);
}

const checkResponse = response => {
    if(!response.ok) throw new Error('Status code not found');
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