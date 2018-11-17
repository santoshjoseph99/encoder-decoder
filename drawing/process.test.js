const assert = require('assert');
const SUT = require('./process');

let output = '';
//green line
// output = SUT('F0A04000417F4000417FC040004000804001C05F205F20804000');
// console.log(output);

// output = SUT('F0A040004000417F417FC040004000804000C04000400040004000804000');
// console.log(output);

// multiple moves
// output = SUT('F0A040004000417F417F804001C0400040004000400040004000804000');
// console.log(output);

//multiple moves (outside then inside)
output = SUT('F0A040004000417F417F804001C08000800090009000300030001000100000000000804000');
console.log(output);
