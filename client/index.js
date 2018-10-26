
const encoderDecoder = require('../encoding-decoding');

const command = process.argv[2];
const arg = process.argv[3];

if(!command || !arg) {
  console.log('ERROR: wrong args');
  return;
}

if(command === 'encode') {
  console.log(encoderDecoder.encode(parseInt(arg)));
  return;
}

if(command === 'decode') {
  console.log(encoderDecoder.decode(arg));
  return;
}