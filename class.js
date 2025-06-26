class Ship{
    constructor(length,hits,sunk){
        this.length = length;
        this.hits = hits;
        this.sunk = sunk;
    }
    hit() {
        this.hits++;
    }
    isSunk(){
        if(this.hits==this.length)
            this.sunk=true;
        return this.sunk;
    }
}

class Gameboard{
    constructor(){
        this.matrix = []
        for (let i = 0; i < 10; i++) {
            this.matrix[i] = new Array(10);
            for (let j = 0; j < 10; j++) {
                this.matrix[i][j] = new Cell(null,false);
            }
        }
    }
    placeShip(ship,arr){
        if(true){
            arr.forEach(element => {
            this.matrix[element[0]][element[1]].ship = ship;
            this.matrix[element[0]][element[1]].old = false
        });}
    }
    receiveAttack(arr){
        if(this.matrix[arr[0]][arr[1]].ship !=null){
            this.matrix[arr[0]][arr[1]].ship.hit();
        }
        else
            this.matrix[arr[0]][arr[1]].old = true;
    }
    checkWin(){
        var win = true;
        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                if(this.matrix[i][j].ship != null && this.matrix[i][j].ship.isSunk() == false)
                    win = false;
            }
        }
        return win;
    }
}

class Cell{
    constructor(ship,old){
        this.ship = ship;
        this.old = old;
    }
}

class Player{
    constructor(type){
        this.gb = new Gameboard;
        this.type = type;
    }
}

export {Ship,Gameboard,Cell,Player}