const canvas = document.querySelector('#gameField');
const field = canvas.getContext('2d');

let canvasSize;
let elementSize;

window.addEventListener('load', setCanvasSize);
// El evento load en window, permite saber cuando el html se ah cargado por completo
// para poder iniciar caulquier otro tipo de código.

window.addEventListener('resize', setCanvasSize);
// El evento resize permite saber cuando las dimensiones de la ventana del navegador
// cambian, para poder ejecutar alguna ación.

function setCanvasSize() {
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

    elementSize = canvasSize / 10;

    startGame();
}

function startGame() {
    field.font = 0.9*elementSize + 'px Verdana';
    field.textBaseline = 'top';

    const map = maps[2];
    const mapRows = map.trim().split('\n');
    const mapRowCols = mapRows.map(row => row.trim().split(''));
    // El método trim se utiliza para limpiar todos los espacios en blanco de una
    // cadena de texto.
    // El método split por su parte, separa una cadena de texto dependiedo de un
    // carácter separador designado y crea un arreglo con los diferentes elementos
    // obtenidos.

    // for (row = 1; row <= 10; row++) {
    //     for (col = 1; col <=10; col++) {
    //         let emoji = mapRowCols[row-1][col-1];
    //         field.fillText(emojis[emoji],elementSize*col,elementSize*row);
    //     }
    // }

    // Forma alternativa de renderizar el mapa:
    mapRowCols.forEach((row, rowIndx) => {
        row.forEach((col,colIndx) => {
            field.fillText(emojis[col],elementSize*colIndx,elementSize*rowIndx);
        });
    });
}