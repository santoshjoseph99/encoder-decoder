const encoderDecoder = require('../encoding-decoding');

const opcodes = process.argv[2];

if(!opcodes) {
  console.log('ERROR: opcodes required');
  return;
}

let penUp = 0;
let penPosition = {x: 0, y: 0};
let penColor = {r: 0, g: 0, b: 0, a: 0};

let start = 0;
const opcodeLen = 2;
const argLen = 4;
while(true) {
  const opcode = opcodes.substr(start, opcodeLen);
  if(!opcode) {
    break;
  }
  if(opcode === 'F0'){ //clr
    penUp = 0;
    penPosition = {x: 0, y: 0};
    penColor = {r: 0, g: 0, b: 0, a: 255};
    start += 2;
    console.log('CLR;');
  } else if(opcode === '80') { //pen up or down
    start += 2;
    penUp = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    console.log(`PEN ${penUp ? 'DOWN' : 'UP'};`);
  } else if(opcode === 'A0') { //set color
    start += 2;
    const r = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    const g = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    const b = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    const a = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    penColor = {r, g, b, a};
    console.log(`CO ${r} ${g} ${b} ${a};`);
  } else if(opcode === 'C0') { //Move pen
    let mvStr = 'MV ';
    start += 2;
    let x = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    let y = encoderDecoder.decode(opcodes.substr(start, 4));
    start += 4;
    //TODO: check boundry
    penPosition.x += x;
    penPosition.y += y;
    mvStr += `(${x}, ${y})`;
    while(true) {
      let possibleOpcode = opcodes.substr(start, opcodeLen);
      if(possibleOpcode === 'A0' || possibleOpcode === 'C0' || possibleOpcode === 'F0' || possibleOpcode === '80') {
        break;
      }
      x = encoderDecoder.decode(opcodes.substr(start, 4));
      start += 4;
      y = encoderDecoder.decode(opcodes.substr(start, 4));
      start += 4;
      penPosition.x += x;
      penPosition.y += y;
      mvStr += `(${x}, ${y})`;
    }
    console.log(`${mvStr};`);
  } else {
    console.log('ERROR: unrecognized opcode:', opcode);
    break;
  }
}

function isInside(penPosition, x, y) {
  
}
/*
CLR;
CO 0 255 0 255;
MV (0, 0);
PEN DOWN;
MV (4000, 4000);
PEN UP;
*/

/*
F0
A0,4000,417F,4000,417F
C0,4000,4000
80,4001
C0,5F20,5F20
80,4000
*/