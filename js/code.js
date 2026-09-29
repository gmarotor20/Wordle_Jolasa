async function pedirPalabra(longitud) {
    const respuesta = await fetch(`https://words-api-sy2x.onrender.com/api/word?lang=es&length=${longitud}&number=1`);
    const datos = await respuesta.json();
    const palabra = datos[0].toUpperCase();
    return palabra;
}

const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", async (evento) =>{
    evento.preventDefault();
    formulario.style.display = "none";

    const intentos = document.getElementById("intentos").value;
    const letras = document.getElementById("opciones").value;

    let state = {
        intentos: Number(intentos),
        letras: Number(letras)
    };

    state.filaActual = 0;
    state.intentoActual = "";
    
    crearTablero(state.intentos, state.letras);
    crearTeclado(state);

    state.palabra = await pedirPalabra(state.letras);
    console.log(state);
 
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

function crearTeclado(state) {
    const teclado = document.getElementById("teclado");
    teclado.innerHTML = "";

    filasTeclado.forEach((fila) => {
        const filaDiv = document.createElement("div");
        filaDiv.className = "fila-teclado";

        fila.forEach((letra) => {
            const tecla = document.createElement("button");
            tecla.textContent = letra;
            tecla.className = "tecla";

            tecla.addEventListener("click", () => {

               if (letra === "ENTER") {
                 if (state.intentoActual.length !== state.letras) {
                    console.log("faltan letras");
                    return;
                }

                console.log("fila completa, lista para comprobar:", state.intentoActual);
                 return;
                }
                
                
                if (letra === "DEL") {
                    if (state.intentoActual.length === 0 ) return;

                    const casillas = document.querySelectorAll(".casilla");
                    const indice = state.filaActual * state.letras + state.intentoActual.length -1;
                    casillas[indice].textContent = "";

                    state.intentoActual = state.intentoActual.slice(0, -1);
                    return;
                }
                
                if (state.intentoActual.length >= state.letras) return;

                const casillas = document.querySelectorAll(".casilla");
                const indice = state.filaActual * state.letras + state.intentoActual.length;
                casillas[indice].textContent = letra;

                state.intentoActual += letra;
                console.log(state.intentoActual);
            });
            
            filaDiv.appendChild(tecla);
        });

        teclado.appendChild(filaDiv);
    });
}
   