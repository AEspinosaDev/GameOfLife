//DECLARACION DE VARIABLES DE UTILIDAD
var canvas = document.getElementById("e");
var ctx = canvas.getContext("2d");
const SIZE = 20;
var count = 0;
var g = 0;
var c;
var width = 60;
var heigth = 40;

//DEFINICION DE CLASES
class cell {
    alive;
    age;
    x;
    y;
    constructor() {
        this.alive = 0;
        this.age = 0;
    }
    draw() {

        if (this.alive == 0) {
            ctx.strokeStyle = "black";
            ctx.clearRect(this.x, this.y, SIZE, SIZE);
            ctx.strokeRect(this.x, this.y, SIZE, SIZE);
        } else {
            ctx.fillRect(this.x, this.y, SIZE, SIZE);
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.x, this.y, SIZE, SIZE);
        }
    }
    setLife() {
        if (this.alive == 0) {
            this.alive = 1;
        } else {
            this.alive = 0;
        }
    }
}



class world {
    heigth;
    width;
    matrix = [];
    constructor(h, w) {
        this.heigth = h;
        this.width = w;
        //SE CREA LA MATRIZ DE CELULAS CON EL NÚMERO DESEADO DE ELLAS
        for (var i = 0; i < w; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < h; j++) {
                this.matrix[i][j] = new cell();
                this.matrix[i][j].x = i * SIZE;
                this.matrix[i][j].y = j * SIZE;

            }
        }
    }


    createCells() {
        //SE DIBUJAN LAS CELULAS Y SE MODIFICA EL CANVAS PARA QUE ESTE CORRESPONDA A EL NUMERO DE CELULAS
        var w = this.width * SIZE;
        var h = this.heigth * SIZE;

        canvas.width = w;
        canvas.height = h;

        for (var i = 0; i < this.width; i++) {

            for (var j = 0; j < this.heigth; j++) {
                this.matrix[i][j].draw();
            }
        }
    }
    evolution() {
        //CREA UNA MATRIX DE CELULAS AUXILIAR COPIA DE LA ORIGINAL QUE MODIFICA RESPETANDO LAS REGLAS DEL JUEGO EL ESTADO DE LAS CELULAS
        var auxMatrix = [];
        for (var i = 0; i < this.width; i++) {
            auxMatrix[i] = [];
            for (var j = 0; j < this.heigth; j++) {
                auxMatrix[i][j] = new cell();
                auxMatrix[i][j].alive = this.matrix[i][j].alive;
                auxMatrix[i][j].x = i * SIZE;
                auxMatrix[i][j].y = j * SIZE;
            }
        }
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.heigth; j++) {
                var nLiving = 0;
                var xDown = i - 1;
                var yDown = j - 1;
                var xUp = i + 1;
                var yUp = j + 1;
                if (i - 1 < 0) {
                    xDown = this.width - 1;
                }
                if (i + 1 == this.width) {
                    xUp = 0;
                }
                if (j - 1 < 0) {
                    yDown = this.heigth - 1;
                }
                if (j + 1 == this.heigth) {
                    yUp = 0;
                }

                nLiving += this.matrix[xDown][yDown].alive;
                nLiving += this.matrix[xDown][j].alive;
                nLiving += this.matrix[xDown][yUp].alive;
                nLiving += this.matrix[i][yDown].alive;
                nLiving += this.matrix[i][yUp].alive;
                nLiving += this.matrix[xUp][yDown].alive;
                nLiving += this.matrix[xUp][j].alive;
                nLiving += this.matrix[xUp][yUp].alive;
                //REGLAS DEL JUEGO
                if (nLiving == 3 & this.matrix[i][j].alive == 0) {
                    auxMatrix[i][j].setLife();
                }
                if (this.matrix[i][j].alive == 1 && nLiving < 2) {
                    auxMatrix[i][j].setLife();
                } else if (this.matrix[i][j].alive == 1 && nLiving > 3) {
                    auxMatrix[i][j].setLife();
                }
                if (this.matrix[i][j].alive == 1) {

                    auxMatrix[i][j].age = this.matrix[i][j].age;
                    auxMatrix[i][j].age++;
                } else if (auxMatrix[i][j].alive==0){
                    auxMatrix[i][j].age = 0;
                }
            }
        }
        //UNA VEZ MODIFICADAS, SE SUSTITUYEN LAS MATRICES Y SE DIBUJA DE NUEVO CON LOS NUEVOS ESTADOS
        //DE NO CREAR UNA MATRIZ AUXILIAR, COMO EL ARRAY SE LEE DE FORMA LINEAL, SE MODIFICAN CELULAS ANTES DE TIEMPO Y NO DA LOS RESULTADOS DESEADOS
        this.matrix = auxMatrix;
        this.createCells();
        
    }


}




//SE INICIA EL MUNDO Y SE DIBUJA LA MATRIZ POR DEFECTO
w = new world(heigth, width);
window.onload = w.createCells();
//SE CREAN LOS EVENTOS PARA MODIFICAR LA VIDA DE LAS CELULAS Y OBTENER SU INFORMACION
canvas.addEventListener("click", setLife, false)
//CUANDO EL CURSOR SE SALE O ENTRA AL CANVAS DE UN AVISO DE QUE EL ELEMENTO NO ESTA DEFINIDO POR QUE SE CREE QUE EL DOCUMENTO ES EL CANVAS. 
//EN CUALQUIER CASO, NO AFECTA A LA COMPILACION DEL CODIGO
canvas.addEventListener("mousemove", getInfo, false)
//SE CREAN LOS EVENTOS CON LAS FUNCIONALIDADES PARA LOS BOTONES
document.getElementById("b1").addEventListener("click", evo);
document.getElementById("b2").addEventListener("click", stop);
document.getElementById("b3").addEventListener("click", reset);
document.getElementById("b4").addEventListener("click", bombardero);


//FUNCION DE UTILIDAD QUE MODIFICA LAS COORDENADAS DEL CURSOR YA QUE AL TRASLADAR EL CANVAS LAS COORDENADS NO SE MODIFICAN, POR TANTO HAY QUE HACERLO MANUALMENTE
function getXY(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
}

//FUNCIONES DE LOS EVENTOS
function setLife(r) {
    if (count == 0) {
        var pos = getXY(canvas, r)
        var i = Math.floor(pos.x / SIZE);
        var j = Math.floor(pos.y / SIZE);
        w.matrix[i][j].setLife();
        w.matrix[i][j].draw();
    }
}
function getInfo(r) {

    var pos = getXY(canvas, r)
    var i = Math.floor(pos.x / SIZE);
    var j = Math.floor(pos.y / SIZE);
    
        document.getElementById("2").innerHTML = "<H3>La celula (" + i + ";" + j + ") lleva viva " + w.matrix[i][j].age + " generaciones</H3>";
    
}


function evo() {
    //SE CREA EL INTERVALO A 10 PASOS POR SEGUNDO
    if (count == 0) {
        c = setInterval(timer, 100);
        function timer() {
            document.getElementById("1").innerHTML = "<H3>Generacion " + g+++"</H3>"
            w.evolution();
            count = 1;


        }

    }

}
function stop() {
    //SE PARA EL INTERVALO
    clearInterval(c);
    count = 0;
}


window.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowDown":
            if (heigth < 150) {
                heigth++;
                reset();
            }
            break;
        case "ArrowUp":
            if (heigth > 30) {
                heigth--;
                reset();
            }
            break;
        case "ArrowLeft":
            if (width > 45) {
                width--;
                reset()
            }
            break;
        case "ArrowRight":
            if (width < 150) {
                width++;
                reset();
            }
            break;

    }
}, false);

function reset() {
    stop()
    g = 0;
    document.getElementById("1").innerHTML = "<H3>Generacion " + g+"</H3>";
    w = new world(heigth, width);
    w.createCells()


}

function bombardero() {
    reset()
    w.matrix[8][6].setLife();
    w.matrix[9][6].setLife();
    w.matrix[8][7].setLife();
    w.matrix[9][7].setLife();
    w.matrix[18][6].setLife();
    w.matrix[18][7].setLife();
    w.matrix[18][8].setLife();
    w.matrix[19][5].setLife();
    w.matrix[19][9].setLife();
    w.matrix[20][4].setLife();
    w.matrix[21][4].setLife();
    w.matrix[20][10].setLife();
    w.matrix[21][10].setLife();
    w.matrix[22][7].setLife();
    w.matrix[22][7].setLife();
    w.matrix[23][5].setLife();
    w.matrix[23][9].setLife();
    w.matrix[24][6].setLife();
    w.matrix[24][7].setLife();
    w.matrix[24][8].setLife();
    w.matrix[25][7].setLife();
    w.matrix[28][4].setLife();
    w.matrix[28][5].setLife();
    w.matrix[28][6].setLife();
    w.matrix[29][4].setLife();
    w.matrix[29][5].setLife();
    w.matrix[29][6].setLife();
    w.matrix[30][3].setLife();
    w.matrix[30][7].setLife();
    w.matrix[32][2].setLife();
    w.matrix[32][3].setLife();
    w.matrix[32][7].setLife();
    w.matrix[32][8].setLife();
    w.matrix[42][4].setLife();
    w.matrix[43][4].setLife();
    w.matrix[42][5].setLife();
    w.matrix[43][5].setLife();
    w.matrix[22][7].setLife();



    w.createCells();


}




