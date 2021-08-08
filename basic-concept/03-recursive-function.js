// 2진수 변환

// recursive
let result = '';
function rf(num) {
  if (num % 2 === 0) {
    result = '0' + result;
  } else {
    result = '1' + result;
  }
  if (num === 0 || num === 1) {
    return String(result);
  }
  return rf(Math.floor(num / 2));
}

function rf2(num) {
  if (num === 0 || num === 1) {
    return String(num);
  }
  return rf2(Math.floor(num / 2)) + String(num % 2);
}

// loop
function lf(num) {
  let result = '';
  let isFlag = true;
  while (isFlag) {
    if (num % 2 === 0) {
      result = '0' + result;
    } else {
      result = '1' + result;
    }
    num = Math.floor(num / 2);
    if (num === 0 || num === 1) {
      isFlag = false;
      return String(num) + result;
    }
  }
}

const num = 11;
console.log('rf(num)', rf(num));
console.log('rf2(num)', rf2(num));
console.log('lf(num)', lf(num));
