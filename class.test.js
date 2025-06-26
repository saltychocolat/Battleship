import { Ship, Gameboard, Cell } from "./class"

test("isHit",()=>{
    s = new Ship(5,0,false);
    s.hit();
    expect(s.hits).toBe(1);
})

test("isSunk",()=>{
    s = new Ship(5,4,false);
    expect(s.isSunk()).toBeFalsy();
    s.hit();
    expect(s.isSunk()).toBeTruthy();

})


test("isValidLength",()=>{
    s = new Ship(5,0,false);
    var arr = Array(5).fill(0);
    expect(arr.length).toBe(s.length)
})

test("isInBounds",()=>{
    var arr = [[0,1],[0,3],[9,0]]
    arr.forEach(element => {
        expect(element[0]).toBeLessThan(10);
        expect(element[1]).toBeLessThan(10);
    });
})

test("checkWin",()=>{
    gb = new  Gameboard;
    gb.placeShip(s =new Ship(3,0,true),[[0,0],[0,1],[0,2]]);
    expect(gb.checkWin()).toBeTruthy();
    gb.placeShip(s =new Ship(3,0,false),[[0,0],[0,1],[0,2]]);
    expect(gb.checkWin()).toBeFalsy();
})