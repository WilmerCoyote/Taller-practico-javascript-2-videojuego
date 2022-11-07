const canvas = document.querySelector('#gameField');
const field = canvas.getContext('2d');

window.addEventListener('load', startGame);
// El evento load en window, permite saber cuando el html se ah cargado por completo
// para poder iniciar caulquier otro tipo de código.

function startGame() {
    let canvasSize;

    if (window.innerHeight > window.innerWidth) {
        canvasSize = window.innerWidth * 0.75;
    } else {
        canvasSize = window.innerHeight * 0.75;
    }
    // Los atributos innerWidth e innerHeight, representan el ancho y el alto respectivamente
    // de algun objeto en concreto.
    // Window es un objeto por defecto del navegador que representa la pestaña del mismo en
    // la que se está trabajando.

    canvas.setAttribute('width',canvasSize);
    canvas.setAttribute('height',canvasSize);

    const elementSize = canvasSize / 10;

    field.font = elementSize + 'px Verdana';
    // field.textBaseline = 'top';
    field.textAlign = 'end';

    for (i = 1; i<=10; i++) {
        field.fillText(emojis['X'],elementSize*i,elementSize*i);
    }
}