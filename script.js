import { Ship, Gameboard, Cell,Player } from "./class.js";

const wrapper = document.querySelector("#wrapper");
const playerWrapper = document.querySelector("#player-wrapper")
const computerWrapper = document.querySelector("#computer-wrapper")


const player  = new Player(true);
var s = new Ship(4,0,false);
player.gb.placeShip(Ship,[[0,1],[0,2],[0,3]])

function createBoard(){
    var board =  document.createElement("div");
    board.classList.add("board");
    for(var i=0;i<10;i++){
        var row = document.createElement("div");
        row.classList.add("row")
        for(var j=0;j<10;j++){
            var box = document.createElement("div")
            box.classList.add("box")
            row.appendChild(box);
        }
        board.appendChild(row);
    }
    computerWrapper.appendChild(board.cloneNode(true));
    playerWrapper.appendChild(board);
}

function renderBoard(board,player){
    var boxes = board.childNodes;
    for(var i=0;i<10;i++){
        for(var j=0;j<10;j++){
            if(player.gb.matrix[i][j].ship !=null)
                boxes[i].childNodes[j].classList.add("ship");
            if(player.gb.matrix[i][j].old == true)
                boxes[i].childNodes[j].classList.add("mark");
        }   
    }
}

createBoard();


var pB = playerWrapper.querySelector(".board")
renderBoard(pB,player);



