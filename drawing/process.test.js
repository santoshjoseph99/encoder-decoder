const assert = require('assert');
const SUT = require('./process');

let output = '';
output = SUT('F0A04000417F4000417FC040004000804001C05F205F20804000');
console.log(output);