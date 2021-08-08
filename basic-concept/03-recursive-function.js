// 2진수 변환

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

const num = 11;
console.log('rf(num)', rf(num));
console.log('rf2(num)', rf2(num));
