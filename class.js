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
            this.matrix[arr[0]][arr[1]].old = true;
            return true;
        }
        else{
            this.matrix[arr[0]][arr[1]].old = true;
            return false;
        }
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

class Controller{
    constructor(player,computer){
        this.player = player;
        this.computer=computer;
    }
    
    playerWrapper = document.querySelector("#player-wrapper")
    computerWrapper = document.querySelector("#computer-wrapper")
    pB = document.querySelector("#player-wrapper .board")
    cB = document.querySelector("#computer-wrapper .board")

    init(){
        this.createBoard();
        this.populatePreDet();
        this.renderAllBoards();
    }

    createBoard(){
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
        this.computerWrapper.appendChild(board.cloneNode(true));
        this.playerWrapper.appendChild(board);
        
    
    }
    
    renderBoard(board,player){
        var boxes = board.childNodes;
        for(var i=0;i<10;i++){
            for(var j=0;j<10;j++){
                if(player.gb.matrix[i][j].ship !=null && player.type==true)
                    boxes[i].childNodes[j].classList.add("ship");
                if(player.gb.matrix[i][j].ship !=null && player.type==false)
                    boxes[i].childNodes[j].classList.add("enemy-ship");
                if(player.gb.matrix[i][j].old == true)
                    boxes[i].childNodes[j].classList.add("mark");
            }   
        }
    }

    renderAllBoards(){
        this.pB = document.querySelector("#player-wrapper .board")
        this.cB = document.querySelector("#computer-wrapper .board")
        this.renderBoard(this.pB,this.player)
        this.renderBoard(this.cB,this.computer)
    }
    
    checkWinner(){
        if(this.player.gb.checkWin())
            return this.player;
        else if(this.computer.gb.checkWin())
            return this.computer;
        else 
            return false;
    }

    clickToCords(event){
        var target = event.target
        var i = Array.from(target.parentElement.parentElement.children).indexOf(target.parentElement);
        var j = Array.from(target.parentElement.children).indexOf(target);
        if(target.classList.contains("ship") ||target.classList.contains("enemy-ship") )
            target.style.backgroundColor = "red"
        return [i,j];
    }
    validCords(player,cords){
        if(player.gb.matrix[cords[0]][cords[1]].old == true)
            return false
        return true
    }

    generateCords(){
        var cords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        return cords
    }

    hitTarget(player,[i,j]){
        return player.gb.receiveAttack([i,j])
    }
    
    populatePreDet(){
        var s1 = new Ship(4,0,false);
        var s2 = new Ship(4,0,false);
    
        var s3 = new Ship(2,0,false);
        var s4 = new Ship(2,0,false);
    
        this.player.gb.placeShip(s1,[[0,1],[0,2],[0,3],[0,4]]);
        this.computer.gb.placeShip(s2,[[0,1],[0,2],[0,3],[0,4]]);
    
        this.player.gb.placeShip(s3,[[0,9],[1,9]]);
        this.computer.gb.placeShip(s4,[[0,9],[1,9]]);
    }
    
    playTurn(player){
        var target = player==this.player?this.computer:this.player;
        var board = player==this.player?this.cB:this.pB;

        return new Promise((resolve)=>{
            if(target==this.computer){
                board.addEventListener("click",async(event)=>{
                    var cords = this.clickToCords(event);
                    if(this.validCords(target,cords)){
                        if(this.hitTarget(target,cords)){
                            this.renderAllBoards();
                            await this.playTurn(player);
                            
                        }
                        resolve();
                        board.replaceWith(board.cloneNode(true))

                    }
                })
            }   
            else{
                var cords = this.generateCords();
                while(!this.validCords(target,cords))
                    cords = this.generateCords();
                if(this.hitTarget(target,cords)){
                    this.renderAllBoards();
                    this.playTurn(player);
                    
                }
                board.replaceWith(board.cloneNode(true));
                resolve();
            }
        })

    }

    async playGame(){
        
        while(!this.checkWinner()){
            var current = current==this.player?this.computer:this.player;
            await this.playTurn(current);
            this.renderAllBoards();

        }
        console.log(current)
        
    }

}

export {Ship,Gameboard,Cell,Player,Controller}