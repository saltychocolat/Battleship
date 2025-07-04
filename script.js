import { Ship, Gameboard, Cell,Player,Controller} from "./class.js";

const wrapper = document.querySelector("#wrapper");


const player  = new Player(true);
const computer = new Player(false);
const controller = new Controller(player,computer);

await controller.init();
console.log("A")
controller.playGame();

