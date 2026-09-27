const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", (evento) =>{
    evento.preventDefault();

    const intentos = document.getElementById("intentos").value;
    const letras = document.getElementById("opciones").value;

    let state = {
        intentos: Number(intentos),
        letras: Number(letras)
    };
    console.log(state);
  
});
    
    

   