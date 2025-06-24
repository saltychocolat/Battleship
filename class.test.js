const { Ship, Gameboard, Cell } = require("./class");


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

// test("isValidShape",()=>{
//     var arr = [[0,1],[0,2],[0,3]];
//     var r=0;
//     var c=0;
//     arr.forEach(element=>{
//         r+=element[0];
//     })
//     arr.forEach(element=>{
//         r+=element[1]
//     })
    
    
// })