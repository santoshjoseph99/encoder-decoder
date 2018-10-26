//Rename file ext
module.exports = {
  encode: num => {
    if(num < -8192 || num > 8192){
      throw new Error('invalid argument');
    }
    num += 8192;
    const highByte = (num & 0x3F80) >> 7;
    const lowByte = num & 0x7F;
    let highStr = convertToHex(highByte);
    let lowStr = convertToHex(lowByte);
    highStr = padString(highStr);
    lowStr = padString(lowStr);
    return `${highStr}${lowStr}`;
  },
  decode: input => {
    if(input.length !== 4){
      throw new Error('invalid argument'); //could use more error checking
    }
    const highStr = input.slice(0, 2);
    const lowStr = input.slice(2);
    let highByte = parseInt(highStr, 16);
    highByte = highByte << 7;
    const lowByte = parseInt(lowStr, 16);
    const num = highByte + lowByte;
    return num - 8192;
  }
}

function convertToHex(num) {
  return num.toString(16).toUpperCase();
}

function padString(str) {
  return str.length === 1 ? '0' + str : str;
}