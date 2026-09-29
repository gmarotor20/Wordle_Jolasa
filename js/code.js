async function pedirPalabra(longitud) {
    const respuesta = await fetch(`https://words-api-sy2x.onrender.com/api/word?lang=es&length=${longitud}&number=1`);
    const datos = await respuesta.json();
    const palabra = datos[0].toUpperCase();
    return palabra;
}

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async (evento) =>{
    evento.preventDefault();

    const intentos = document.getElementById("intentos").value;
    const letras = document.getElementById("opciones").value;

    let state = {
        intentos: Number(intentos),
        letras: Number(letras)
    };
    
    state.palabra = await pedirPalabra(state.letras);
    console.log(state);

    crearTablero(state.intentos, state.letras);
    crearTeclado();
  
});
 
function crearTablero(intentos, letras){
    const tablero = document.getElementById("tablero");
    tablero.innerHTML = "";
    tablero.style.setProperty("--columnas", letras);

    for (let fila = 0; fila < intentos; fila++) {
        for (let col = 0; col < letras; col++) {
            const casilla = document.createElement("div");
            casilla.className = "casilla";
            tablero.appendChild(casilla);
        }
    }
}

const filasTeclado = [
  ["Á", "É", "Í", "Ó", "Ú"],
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "DEL"]
];

function crearTeclado() {
    const teclado = document.getElementById("teclado");
    teclado.innerHTML = "";

    filasTeclado.forEach((fila) => {
        const filaDiv = document.createElement("div");
        filaDiv.className = "fila-teclado";

        fila.forEach((letra) => {
            const tecla = document.createElement("button");
            tecla.textContent = letra;
            tecla.className = "tecla";
            filaDiv.appendChild(tecla);
        });

        teclado.appendChild(filaDiv);
    });
}
   