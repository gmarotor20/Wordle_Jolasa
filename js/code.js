let state;

async function pedirPalabra(longitud) {
    const respuesta = await fetch(`https://words-api-sy2x.onrender.com/api/word?lang=es&length=${longitud}&number=1`);
    const datos = await respuesta.json();
    const palabra = datos[0].toUpperCase();
    return palabra;
}

const formulario = document.getElementById("formulario");
const divTablero = document.getElementById("tablero");
const divTeclado = document.getElementById("teclado");
const mensaje = document.getElementById("mensaje");
const botonReiniciar = document.getElementById("reiniciar");

formulario.addEventListener("submit", async (evento) =>{
    evento.preventDefault();
    formulario.style.display = "none";

    const intentos = document.getElementById("intentos").value;
    const letras = document.getElementById("opciones").value;

    state = {
        intentos: Number(intentos),
        letras: Number(letras)
    };

    state.filaActual = 0;
    state.intentoActual = "";
    state.intentosRealizados = [];

    crearTablero(state.intentos, state.letras);
    state.casillas = document.querySelectorAll(".casilla");
    crearTeclado(state);

    state.palabra = await pedirPalabra(state.letras);
    console.log(state);

});

function crearTablero(intentos, letras){
    divTablero.innerHTML = "";
    divTablero.style.setProperty("--columnas", letras);

    for (let fila = 0; fila < intentos; fila++) {
        for (let col = 0; col < letras; col++) {
            const casilla = document.createElement("div");
            casilla.className = "casilla";
            divTablero.appendChild(casilla);
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
    divTeclado.innerHTML = "";

    filasTeclado.forEach((fila) => {
        const filaDiv = document.createElement("div");
        filaDiv.className = "fila-teclado";

        fila.forEach((letra) => {
            const tecla = document.createElement("button");
            tecla.textContent = letra;
            tecla.className = "tecla";
            tecla.dataset.letra = letra;

            tecla.addEventListener("click", () => {
                procesarTecla(letra, state);
            });

            filaDiv.appendChild(tecla);
        });

        divTeclado.appendChild(filaDiv);
    });
}

function guardarPartida(state, resultado) {
    const partida = {
        palabra: state.palabra,
        intentos: state.intentosRealizados,
        fecha: new Date().toLocaleString(),
        resultado: resultado
    };

    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.unshift(partida);
    historial.splice(10);

    localStorage.setItem("historial", JSON.stringify(historial));
}

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem("historial")) || [];
    const contenedor = document.getElementById("historial");
    contenedor.innerHTML = "";

    historial.forEach((partida) => {
        const item = document.createElement("p");
        item.textContent = `${partida.fecha} — ${partida.palabra} — ${partida.resultado} — intentos: ${partida.intentos.join(", ")}`;
        contenedor.appendChild(item);
    });
}

function terminarJuego(texto, resultado) {
    mensaje.textContent = texto;
    divTablero.style.display = "none";
    divTeclado.style.display = "none";
    guardarPartida(state, resultado);
    mostrarHistorial();
    botonReiniciar.style.display = "block";
}

function calcularIndice(state, offset) {
    return state.filaActual * state.letras + offset;
}

function procesarTecla(letra, state) {
    if (letra === "ENTER") {
        if (state.intentoActual.length !== state.letras) {
            console.log("faltan letras");
            return;
        }

        const resultado = comprobarIntento(state.intentoActual, state.palabra);

        for (let i = 0; i < state.letras; i++) {
            const indice = calcularIndice(state, i);
            state.casillas[indice].classList.add(resultado[i]);

            const teclaPulsada = document.querySelector(`[data-letra="${state.intentoActual[i]}"]`);
            teclaPulsada.classList.add(resultado[i]);
        }

        state.intentosRealizados.push(state.intentoActual);

        if (state.intentoActual === state.palabra) {
            terminarJuego("¡Has ganado!", "ganado");
            return;
        }

        state.filaActual++;

        if (state.filaActual === state.intentos) {
            terminarJuego("Has perdido. La palabra era: " + state.palabra, "perdido");
            return;
        }

        state.intentoActual = "";
        return;
    }

    if (letra === "DEL") {
        if (state.intentoActual.length === 0) return;

        const indice = calcularIndice(state, state.intentoActual.length - 1);
        state.casillas[indice].textContent = "";

        state.intentoActual = state.intentoActual.slice(0, -1);
        return;
    }

    if (state.intentoActual.length >= state.letras) return;

    const indice = calcularIndice(state, state.intentoActual.length);
    state.casillas[indice].textContent = letra;

    state.intentoActual += letra;
}

function comprobarIntento(intento, palabra) {
    const resultado = [];
    const restantes = {};

    for (const letra of palabra) {
        restantes[letra] = (restantes[letra] || 0) + 1;
    }

    for (let i = 0; i < intento.length; i++) {
        if (intento[i] === palabra[i]) {
            resultado[i] = "ok";
            restantes[intento[i]]--;
        } else {
            resultado[i] = null;
        }
    }

    for (let i = 0; i < intento.length; i++) {
        if (resultado[i] !== null) continue;

        const letra = intento[i];
        if (restantes[letra] > 0) {
            resultado[i] = "existe";
            restantes[letra]--;
        } else {
            resultado[i] = "no";
        }
    }
    return resultado;
}

document.addEventListener("keydown", (evento) => {
    if (!state) return;

    let tecla = evento.key.toUpperCase();

    if (tecla === "ENTER") {
        procesarTecla("ENTER", state);
        return;
    }

    if (tecla === "BACKSPACE" || tecla === "DELETE") {
        procesarTecla("DEL", state);
        return;
    }

    if (tecla.length !== 1) return;

    procesarTecla(tecla, state);
});

botonReiniciar.addEventListener("click", () => {
    location.reload();
});