const processOpcodes = require('./process');

const opcodes = process.argv[2];

if (!opcodes) {
  console.log('ERROR: opcodes required');
  return;
}

processOpcodes(opcodes);