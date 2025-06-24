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
    constructor(matrix){
        this.matrix = Array[10][10];
    }
    placeShip(ship,arr){
        if(isValid(ship,arr)){
            arr.forEach(element => {
            matrix[element[0]][element[1]].ship = ship;
            matrix[element[0]][element[1]].old = false
        });}
    }
}

class Cell{
    constructor(ship,old){
        this.ship = ship;
        this.old = false;
    }
}
module.exports = {
    Ship,
    Gameboard,
    Cell
};