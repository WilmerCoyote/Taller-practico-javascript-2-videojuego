const canvas = document.querySelector('#gameField');
const field = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
let keys = {
    Up: 38,
    Left: 37,
    Right: 39,
    Down: 40
}

let canvasSize;
let elementSize;
let fieldLimit;

let playerPosition = {
    x: undefined,
    y: undefined
};

window.addEventListener('load', setCanvasSize);
// El evento load en window, permite saber cuando el html se ah cargado por completo
// para poder iniciar caulquier otro tipo de código.

window.addEventListener('resize', setCanvasSize);
// El evento resize permite saber cuando las dimensiones de la ventana del navegador
// cambian, para poder ejecutar alguna ación.

// Dimensionamiento y responsive del canvas:
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
    fieldLimit = canvasSize - 1;
    
    console.log(canvasSize,elementSize);
    startGame();
}

// Renderizado del mapa:
function startGame() {
    field.font = 0.9*elementSize + 'px Verdana';
    field.textBaseline = 'top';

    const map = maps[0];
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
    field.clearRect(0,0,canvasSize,canvasSize);

    mapRowCols.forEach((row, rowIndx) => {
        row.forEach((col,colIndx) => {
            const posX = elementSize*colIndx;
            const posY = elementSize*rowIndx;
            const emoji = emojis[col];

            if (col == 'O') {
                if ((playerPosition.x && playerPosition.y) == undefined){
                    playerPosition.x = posX;
                    playerPosition.y = posY;
                }
            }

            field.fillText(emoji,posX,posY);
        });
    });

    movePlayer();
}

// Renderizado del movimiento del jugador:
function movePlayer() {
    field.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);
}

// Implementación de botones:
btnUp.addEventListener('click', moveUp);
btnLeft.addEventListener('click', moveLeft);
btnRight.addEventListener('click', moveRight);
btnDown.addEventListener('click', moveDown);
document.addEventListener('keyup', movement);

function movement(event) {
    switch (event.keyCode) {
        case keys.Up:
            moveUp();
            break;
        case keys.Left:
            moveLeft();
            break;
        case keys.Right:
            moveRight();
            break;
        case keys.Down:
            moveDown();
            break;
        default:
            break;
    }
}

function moveUp() {
    if ((playerPosition.y - elementSize) > -1) {
        playerPosition.y -= elementSize;
        startGame();
        console.log(playerPosition);
    }
}

function moveLeft() {
    if ((playerPosition.x - elementSize) > -1) {
        playerPosition.x -= elementSize;
        startGame();
        console.log(playerPosition);
    }
}

function moveRight() {
    if ((playerPosition.x + elementSize) < fieldLimit) {
        playerPosition.x += elementSize;
        startGame();
        console.log(playerPosition);
    }
}

function moveDown() {
    if ((playerPosition.y + elementSize) < fieldLimit) {
        playerPosition.y += elementSize;
        startGame();
        console.log(playerPosition);
    }
}