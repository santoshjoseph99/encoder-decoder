const encoderDecoder = require('../encoding-decoding');

function processOpcodes(opcodes) {
  const DEBUG = 0;
  let penUp = 0;
  let penPosition = { x: 0, y: 0 };
  let penColor = { r: 0, g: 0, b: 0, a: 0 };
  let penOutside = false;
  let start = 0;
  const OPCODE_LEN = 2;
  const ARG_LEN = 4;
  let output = '';

  try {
    while (true) {
      const opcode = opcodes.substr(start, OPCODE_LEN);
      if (!opcode) {
        break;
      }
      if (opcode === 'F0') { //clr
        penUp = 0;
        penPosition = { x: 0, y: 0 };
        penColor = { r: 0, g: 0, b: 0, a: 255 };
        start += OPCODE_LEN;
        output += 'CLR;\n';
      } else if (opcode === '80') { //pen up or down
        start += OPCODE_LEN;
        penUp = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        output += `PEN ${penUp === 0 ? 'UP' : 'DOWN'};\n`;
      } else if (opcode === 'A0') { //set color
        start += OPCODE_LEN;
        const r = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        const g = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        const b = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        const a = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        penColor = { r, g, b, a };
        output += `CO ${r} ${g} ${b} ${a};\n`;
      } else if (opcode === 'C0') { //Move pen
        let mvStr = 'MV ';
        start += OPCODE_LEN;
        let x = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        let y = encoderDecoder.decode(opcodes.substr(start, 4));
        start += ARG_LEN;
        penPosition.x += x;
        penPosition.y += y;
        mvStr += `(${penPosition.x}, ${penPosition.y})`;
        if (isOutside(penPosition)) {
          output += `${mvStr};\n`;
          output += 'PEN UP;\n';
          penOutside = true;
        }
        while (true) {
          let possibleOpcode = opcodes.substr(start, OPCODE_LEN);
          if (isValidOpcode(possibleOpcode)) {
            break;
          }
          x = encoderDecoder.decode(opcodes.substr(start, 4));
          start += ARG_LEN;
          y = encoderDecoder.decode(opcodes.substr(start, 4));
          start += ARG_LEN;
          penPosition.x += x;
          penPosition.y += y;
          mvStr += ` (${penPosition.x}, ${penPosition.y})`;
          if(!penOutside && isOutside(penPosition)) {
            output += `${mvStr};\n`;
            output += 'PEN UP;\n';
            penOutside = true;
            mvStr = 'MV ';
          }
          else if (penOutside && !isOutside(penPosition)) {
            output += `${mvStr};\n`;
            output += 'PEN DOWN;\n';
            penOutside = false;
            mvStr = 'MV ';
          }
        }
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

