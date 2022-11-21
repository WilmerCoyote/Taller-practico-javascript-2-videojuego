const canvas = document.querySelector('#gameField');
const field = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const pLevel = document.querySelector('#level');
const pTexts = document.querySelector('#texts');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const keys = {
    Up:    38,
    Left:  37,
    Right: 39,
    Down:  40
}

let canvasSize;
let elementSize;
let fieldLimit;

let mapCounter = 0;
let livesCounter = 3;

let timeStart;
let timeInterval;
let timePlayer;

const playerPosition = {
    x: undefined,
    y: undefined
};

const giftPosition = {
    x: undefined,
    y: undefined
} 

const bombPositions = [];
// Cuando un objeto o arreglo se define como una constante en JavaScript, es posible
// modificar sus elementos internos, dado que, asi es como funcionan este tipo de
// variables. Lo que no se puede hacer es intentar cambiar en sí el tipo de variable,
// es decir, tratar de convertir un objeto a un arreglo, a un booleano, etc.

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
    field.font = 0.89*elementSize + 'px Verdana';
    field.textBaseline = 'top';

    pLevel.innerText = 'Nivel: ' + (mapCounter + 1);
    pTexts.innerText = '';

    showLives();

    if (timeStart == undefined) {
        timeStart = Date.now();
        timeInterval = setInterval(showTime,100);
    }

    if (localStorage.record) {
        spanRecord.innerText = timeConverter(localStorage.record);
    } else {
        spanRecord.innerText = '--:--';
    }

    const map = maps[mapCounter];
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
    bombPositions.length = 0;

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
            } else if (col == 'I') {
                giftPosition.x = posX;
                giftPosition.y = posY;
            } else if (col == 'X') {
                bombPositions.push({
                    x: posX,
                    y: posY
                })
            }

            field.fillText(emoji,posX,posY);
        });
    });

    movePlayer();
}

// Renderizado del movimiento del jugador:
function movePlayer() {
    field.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y);

    const giftCollisionX = playerPosition.x.toFixed(5) == giftPosition.x.toFixed(5);
    const giftCollisionY = playerPosition.y.toFixed(5) == giftPosition.y.toFixed(5);
    // El método toFixed se encuantra disponible para todo dato que sea de tipo número, se
    // utiliza para limpiar los decimales del mismo y tomar en cuenta solamente la cantidad
    // designada de los digitos.

    if (giftCollisionX && giftCollisionY) {
        levelWin();
    }

    const bombCollision = bombPositions.find(bomb => {
        const bombCollisionX = playerPosition.x.toFixed(5) == bomb.x.toFixed(5);
        const bombCollisionY = playerPosition.y.toFixed(5) == bomb.y.toFixed(5);
        return bombCollisionX && bombCollisionY;
    });

    if (bombCollision) {
       levelFail();
    }
}

// Cambiar de mapa al ganar el nivel:
function levelWin() {
    if (mapCounter != maps.length - 1) {
        mapCounter++;

        playerPosition.x = undefined;
        playerPosition.y = undefined;

        startGame();
    } else {
        clearInterval(timeInterval);

        const currentRecord = Number(localStorage.record);

        if (!localStorage.record) {
            localStorage.setItem('record',timePlayer);
            pTexts.innerText = '¡¡¡Felicidades, completaste todos los niveles!!!';
        } else if (timePlayer < currentRecord) {
            localStorage.setItem('record',timePlayer);
            pTexts.innerText = '!!!Felicidades, lograste un nuevo récord!!!'
        } else {
            pTexts.innerText = 'No superaste el récord actual, se mas rápido la próxima :('
        }
    }
}

// Reiciar pisición al perder:
function levelFail() {
    clearElement();
    field.fillText(emojis['BOMB_COLLISION'],playerPosition.x,playerPosition.y);
    
    playerPosition.x = undefined;
    playerPosition.y = undefined;

    if (livesCounter > 1) {
        livesCounter --;

        setTimeout(startGame,500);
    } else if (livesCounter == 1) {
        clearInterval(timeInterval);

        pTexts.innerText = 'Te quedaste sin vidas 😞';
        spanTime.innerText = '0';

        mapCounter = 0;
        livesCounter = 3;
        timeStart = undefined;

        setTimeout(startGame,2000);
    }
}

// Información de la sección de mensajes:
function showLives() {
    spanLives.innerText = emojis['HEART'].repeat(livesCounter);
}

function showTime() {
    timePlayer = Date.now() - timeStart;
    spanTime.innerText = timeConverter(timePlayer);
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

// Función para limpiar elementos:
function clearElement () {
    const posX = playerPosition.x;
    const posY = playerPosition.y - 0.07*elementSize;
    const limitX = 1.1*elementSize;
    const limitY = elementSize;

    field.clearRect(posX,posY,limitX,limitY);
}

// Conversor de milisegundos a minutos y segundos:
function timeConverter (miliseconds) {
    const milisecondNumber = Number(miliseconds);
    const seconds = Number((milisecondNumber/1000).toFixed(0));

    if (seconds >= 60) {
        const minuts = Math.floor(seconds/60);
        const residue = seconds%60;
        if (residue < 10) {
            return String(minuts + ':0' + residue);
        } else {
            return String(minuts + ':' + residue);
        }
    } else {
        return String(seconds);
    }
}