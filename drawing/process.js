const encoderDecoder = require('../encoding-decoding');

const DEBUG = 0;
let penUp = 0;
let penPosition = { x: 0, y: 0 };
let penColor = { r: 0, g: 0, b: 0, a: 0 };
let penOutside = false;


function processOpcodes(opcodes) {
  let start = 0;
  const OPCODE_LEN = 2;
  const ARG_LEN = 4;
  let output = '';
  try {
    while (true) {
      const opcode = opcodes.substr(start, OPCODE_LEN);
      if (DEBUG) console.log('--OPCODE:', opcode);
      if (!opcode) {
        break;
      }
      if (opcode === 'F0') { //clr
        penUp = 0;
        penPosition = { x: 0, y: 0 };
        penColor = { r: 0, g: 0, b: 0, a: 255 };
        start += OPCODE_LEN;
        if (DEBUG) {
          console.log(opcodes.substr(start));
          console.log('CLR;');
        }
        output += 'CLR;\n';
      } else if (opcode === '80') { //pen up or down
        start += OPCODE_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        penUp = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        if (DEBUG) console.log(`PEN ${penUp === 0 ? 'UP' : 'DOWN'};`);
        output += `PEN ${penUp === 0 ? 'UP' : 'DOWN'};\n`;
      } else if (opcode === 'A0') { //set color
        start += OPCODE_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        const r = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        const g = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        const b = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        const a = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        penColor = { r, g, b, a };
        if (DEBUG) console.log(`CO ${r} ${g} ${b} ${a};`);
        output += `CO ${r} ${g} ${b} ${a};\n`;
      } else if (opcode === 'C0') { //Move pen
        let mvStr = 'MV ';
        start += OPCODE_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        let x = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        let y = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        if (DEBUG) console.log(opcodes.substr(start));
        penPosition.x += x;
        penPosition.y += y;
        mvStr += `(${penPosition.x}, ${penPosition.y})`;
        if (isOutside(penPosition)) {
          if (DEBUG) console.log(`${mvStr};`);
          if (DEBUG) console.log('PEN UP');
          output += `${mvStr};\n`;
          output += 'PEN UP;\n';
          penOutside = true;
          // console.log('--outside');
        }
        while (true) {
          let possibleOpcode = opcodes.substr(start, OPCODE_LEN);
          if (isValidOpcode(possibleOpcode)) {
            break;
          }
          x = encoderDecoder.decode(opcodes.substr(start, 4));
          start += ARG_LEN;
          if (DEBUG) console.log(opcodes.substr(start));
          y = encoderDecoder.decode(opcodes.substr(start, 4));
          start += ARG_LEN;
          if (DEBUG) console.log(opcodes.substr(start));
          penPosition.x += x;
          penPosition.y += y;
          mvStr += ` (${penPosition.x}, ${penPosition.y})`;
          if (!isOutside(penPosition)) {
            if (DEBUG) console.log(`${mvStr};`);
            if (DEBUG) console.log('PEN DOWN');
            output += `${mvStr};\n`;
            output += 'PEN DOWN;\n';
            penOutside = false;
          }
        }
        if (DEBUG) console.log(`${mvStr};`);
        output += `${mvStr};\n`;
      } else {
        console.log('ERROR: unrecognized opcode:', opcode);
        break;
      }
    }
  } catch (err) {
    console.log('ERROR:', err);
    throw err;
  }
  return output;
}

module.exports = processOpcodes;

function isValidOpcode(opcode) {
  return opcode === 'A0' ||
    opcode === 'C0' ||
    opcode === 'F0' ||
    opcode === '80';
}

function isOutside(position) {
  return position.x > 8192 ||
    position.x < -8192 ||
    position.y > 8192 ||
    position.y < -8192;
}

/*
let pen = {
  up: 0,
  position: { x: 0, y: 0 },
  color: { r: 0, g: 0, b: 0, a: 0 },
  start: 0,
};

function processClear(pen, opcodes) {
  pen.up = 0;
  pen.position = {x: 0, y: 0};
  pen.color = {r: 0, g: 0, b: 0, a: 255};
}

function processColor(pen, opcodes) {
  pen.start += OPCODE_LEN;
  const r = encoderDecoder.decode(opcodes.substr(pen.start, 4));
  pen.start += ARG_LEN;
  const g = encoderDecoder.decode(opcodes.substr(pen.start, 4));
  pen.start += ARG_LEN;
  const b = encoderDecoder.decode(opcodes.substr(pen.start, 4));
  pen.start += ARG_LEN;
  const a = encoderDecoder.decode(opcodes.substr(pen.start, 4));
  pen.start += ARG_LEN;
  pen.color = {r, g, b, a};
}

function processMoves(pen, opcodes) {

}

function processPen(pen, opcodes) {
  pen.start += OPCODE_LEN;
  pen.up = encoderDecoder.decode(opcodes.substr(pen.start, 4));
  pen.start += ARG_LEN;
}
*/
