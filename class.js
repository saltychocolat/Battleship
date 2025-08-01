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
        this.playerWrapper = document.querySelector("#player-wrapper")
        this.computerWrapper = document.querySelector("#computer-wrapper")
        this.player = player;
        this.computer=computer;
        this.CoordinateManager = new CoordinateManager(player,computer);
        this.UIBoardManager = new UIBoardManager(player,computer);
    }

    async init(){
        localStorage.setItem("direction","orizontal")
        this.UIBoardManager.createBoard();
        this.pB = document.querySelector("#player-wrapper .board")
        this.cB = document.querySelector("#computer-wrapper .board")

        document.addEventListener("keydown",(event)=>this.CoordinateManager.rotateHandler(event))
        var messageDiv = document.querySelector(".messageDiv");
        this.UIBoardManager.showMessage("Press R to rotate!");
        await this.initPlayer();
        this.UIBoardManager.showMessage("");
        document.removeEventListener("keydown",(event)=>this.CoordinateManager.rotateHandler(event));

        this.initComputer();
        this.UIBoardManager.renderAllBoards();
    }

    checkWinner(){
        if(this.player.gb.checkWin()){
            alert("Computer has won!")
            return this.computer;
        }
        else if(this.computer.gb.checkWin()){
            alert("Player has won!")
            return this.player;
        }
        else 
            return false;
    }

    hitTarget(player,[i,j]){
        if(!player.type){
            var row = this.cB.childNodes[i];
            var targetbox = row.childNodes[j];
            if(targetbox.classList.contains("enemy-ship") )
                targetbox.style.backgroundColor = "red"
    
        }
        else if(player.type){
            var row = this.pB.childNodes[i];
            var targetbox = row.childNodes[j];
            if(targetbox.classList.contains("ship"))
                targetbox.style.backgroundColor = "red"
        }
        return player.gb.receiveAttack([i,j])
    }

    initComputer(){
        this.initShipRandom(5);
        this.initShipRandom(4);
        this.initShipRandom(3);
        this.initShipRandom(3);
        this.initShipRandom(2);

    }


    async initPlayer(){
        await this.initShip(5);
        await this.initShip(4);
        await this.initShip(3);
        await this.initShip(3);
        await this.initShip(2);
    }

    initShip(size){
        return new Promise((resolve)=>{
            let isPlacing = false;
            const handleHover = async(event)=>{
                if(isPlacing) return;
                
                var target = event.target;
                var cords = this.CoordinateManager.clickToCords(event);
                var board = this.pB;
                if (!target.classList.contains("box")) return;
    
                var arr = this.CoordinateManager.cordsToArr(cords,localStorage.getItem("direction"),size);
                var validArr = this.CoordinateManager.validArr(this.player,arr);
                if (!validArr) return;
    
                isPlacing = true    
                var placed = await this.UIBoardManager.showHoverAndWaitForClick(board, cords,localStorage.getItem("direction"), size,this.player);
                isPlacing = false
    
                if(placed){
                    this.UIBoardManager.renderAllBoards();
                    this.pB.removeEventListener("mouseover", handleHover);
                    resolve();
                }
    
    
            }
            this.pB.addEventListener("mouseover",handleHover)
        })
    }
    initShipRandom(size){
        var bool = Math.random() < 0.5;
        var cords =  this.CoordinateManager.generateCords();

        var direction = bool == true ? "vertical" : "orizontal"
        var arr = this.CoordinateManager.cordsToArr(cords,direction,size)

        while(!this.CoordinateManager.validArr(this.computer,arr)){
            cords =  this.CoordinateManager.generateCords();
            while(!this.CoordinateManager.validCords(this.computer,cords)){
                cords = this.CoordinateManager.generateCords();
            }
            var arr = this.CoordinateManager.cordsToArr(cords,direction,size)
        }
        var s = new Ship(size,0,false);
        this.computer.gb.placeShip(s,arr);
        
    }
    playTurn(player){
        this.pB = document.querySelector("#player-wrapper .board")
        this.cB = document.querySelector("#computer-wrapper .board")
        var target = player==this.player?this.computer:this.player;
        var board = player==this.player?this.cB:this.pB;

        return new Promise((resolve)=>{
            if(target==this.computer){
                board.addEventListener("click",async(event)=>{
                    var cords = this.CoordinateManager.clickToCords(event);
                    if(this.CoordinateManager.validCords(target,cords,"hit")){
                        if(this.hitTarget(target,cords)){

                            this.UIBoardManager.showMessage(this.CoordinateManager.cordsToLetter(cords) +" is a hit!✅")
                            this.UIBoardManager.renderAllBoards();
                            if(!this.checkWinner())
                                await this.playTurn(player);
                        }
                        this.UIBoardManager.showMessage(this.CoordinateManager.cordsToLetter(cords) +" is a miss!❌")
                        resolve();
                        board.replaceWith(board.cloneNode(true))
                    }
                })
            }   
            else{
                setTimeout(()=>{
                    var cords = this.CoordinateManager.generateCords();
                    while(!this.CoordinateManager.validCords(target,cords,"hit"))
                        cords = this.CoordinateManager.generateCords();
                    if(this.hitTarget(target,cords)){
                        this.UIBoardManager.showMessage(this.CoordinateManager.cordsToLetter(cords) +" is a hit!✅")
                        this.UIBoardManager.renderAllBoards();
                        this.playTurn(player);
                    }
                    this.UIBoardManager.showMessage(this.CoordinateManager.cordsToLetter(cords) +" is a miss!❌")
                    resolve();
                    board.replaceWith(board.cloneNode(true));
                },900)
            }
        })
    }

    async playGame(){
        while(!this.checkWinner()){
            var current = current==this.player?this.computer:this.player;
            this.UIBoardManager.showTurn(current);
            await this.playTurn(current);
            this.UIBoardManager.renderAllBoards();
        
        }

    }
}

class CoordinateManager{
    constructor(player,computer){
        this.player = player;
        this.computer = computer;
    }
    cordsToLetter(cords){
        var letters = {
            1: "A",
            2: "B",
            3: "C",
            4: "D",
            5: "E",
            6: "F",
            7: "G",
            8: "H",
            9: "I",
            10: "J"
        };
        let row = cords[0]+1;
        let column = letters[cords[1]+1]
        return row+column
    }
    rotateHandler(event){
        if(event.key == "r"){
            var direction = localStorage.getItem("direction") == "orizontal" ? "vertical" :"orizontal"
            localStorage.setItem("direction",direction);
        }
    }
    validArr(player,arr){
        for(var i=0;i<arr.length;i++){
            if(arr[i][0] >9 || arr[i][1]>9)
                return false
            if(!this.validCords(player,arr[i]))
                return false

        }
        return true
    }
    cordsToArr(cords,direction,size){
        var arr = [];
        if(direction== "orizontal"){
            var i = cords[0];
            for(var j=cords[1];j<cords[1]+size;j++){
                arr.push([i,j])
            }
        }
        if(direction=="vertical"){
            var j = cords[1];
            for(var i=cords[0];i<cords[0]+size;i++){
                arr.push([i,j])
            }
        }
        return arr;
    }
    clickToCords(event){
        var target = event.target
        var i = Array.from(target.parentElement.parentElement.children).indexOf(target.parentElement);
        var j = Array.from(target.parentElement.children).indexOf(target);
        return [i,j];
    }
    validCords(player,cords,type="normal"){
        if(player.gb.matrix[cords[0]][cords[1]].old == true || player.gb.matrix[cords[0]][cords[1]].ship != null)
            if(type=="normal")
                return false
        if(player.gb.matrix[cords[0]][cords[1]].old == true)
            return false;
        return true
    }

    generateCords(){
        var cords = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
        return cords
    }
}

class UIBoardManager{
    constructor(player,computer){
        this.player = player;
        this.computer = computer;
        this.CoordinateManager = new CoordinateManager();
    }
    showMessage(message){
        var messageDiv = document.querySelector(".messageDiv");
        messageDiv.textContent = message;
    }
    showTurn(current){
        var name = current == this.player ? "Player" : "Computer"
        var div = document.querySelector(".turnDiv")
        div.textContent = "It's " + name + "s turn!"
        document.querySelector("#wrapper").appendChild(div);

    }
    showHoverAndWaitForClick(board, cords,direction, size,player) {
        if(direction == "orizontal"){
            return new Promise((resolve) => {
                const cells = [];
                var row =  board.childNodes[cords[0]]
                for (let j = cords[1]; j < cords[1] + size; j++) {
                    const cell = row.childNodes[j];
                    cell.classList.add("hovered");
                    cells.push(cell);
                }

                const placeShip = ()=>{
                    
                    var arr = this.CoordinateManager.cordsToArr(cords,direction,size);
                    var s = new Ship(size,0,false);
                    player.gb.placeShip(s,arr);
                }

                const cleanup = () => {
                    var box = row.childNodes[cords[1]]
                    cells.forEach(c => c.classList.remove("hovered"));
                    box.removeEventListener("click", onClick);
                    box.removeEventListener("mouseleave", onLeave);
                };

                const onClick = () => {
                    if(localStorage.getItem("direction") ==direction){
                        placeShip();
                    }
                    cleanup();
                    resolve(true); // Ship placed
                };

                const onLeave = () => {
                    cleanup();
                    resolve(false); // User moved away
                };
                
                var box = row.childNodes[cords[1]]
                box.addEventListener("click", onClick, { once: true });
                box.addEventListener("mouseleave", onLeave, { once: true });
            });
        }
        if(direction=="vertical"){
            return new Promise((resolve) => {
                var row =  board.childNodes[cords[0]]
                const cells = [];
                for (let i = cords[0]; i < cords[0] + size; i++) {
                    const cell = board.childNodes[i].childNodes[cords[1]]
                    cell.classList.add("hovered");
                    cells.push(cell)
                }

                const placeShip = ()=>{
                    var arr = this.CoordinateManager.cordsToArr(cords,direction,size);
                    var s = new Ship(size,0,false);
                    player.gb.placeShip(s,arr);
                }

                const cleanup = () => {
                    var box = row.childNodes[cords[1]]
                    cells.forEach(c => c.classList.remove("hovered"));
                    box.removeEventListener("click", onClick);
                    box.removeEventListener("mouseleave", onLeave);
                };

                const onClick = () => {
                    placeShip();
                    cleanup();
                    resolve(true); 
                };

                const onLeave = () => {
                    cleanup();
                    resolve(false); 
                };
                
                var box = board.childNodes[cords[0]].childNodes[cords[1]]
                box.addEventListener("click", onClick, { once: true });
                box.addEventListener("mouseleave", onLeave, { once: true });
            });
        }
    }
    createBoard(){
        var playerWrapper = document.querySelector("#player-wrapper")
        var computerWrapper = document.querySelector("#computer-wrapper")
        
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
        var pB = document.querySelector("#player-wrapper .board")
        var cB = document.querySelector("#computer-wrapper .board")
        this.renderBoard(pB,this.player)
        this.renderBoard(cB,this.computer)
    }
}

export {Ship,Gameboard,Cell,Player,Controller}
