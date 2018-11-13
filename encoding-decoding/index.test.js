//Rename file ext
const assert = require('assert');
const SUT = require('./index');

assert.equal(SUT.encode(0), '4000');
assert.equal(SUT.encode(-8192), '0000');
assert.equal(SUT.encode(8191), '7F7F');
assert.equal(SUT.encode(2048), '5000');
assert.equal(SUT.encode(-4096), '2000');

assert.equal(SUT.decode('4000'), 0);
assert.equal(SUT.decode('0000'), -8192);
assert.equal(SUT.decode('7F7F'), 8191);
assert.equal(SUT.decode('5000'), 2048);
assert.equal(SUT.decode('2000'), -4096);