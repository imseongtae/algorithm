// 각 자릿수의 합

function lf(num) {
  let result = 0;
  let isFlag = true;
  while (isFlag) {
    if (num.length === 1) {
      isFlag = false;
    }
    let temp = num.split('');
    result += parseInt(temp.pop(), 10);
    num = temp.join('');
  }
  return result;
}

function lf2(num) {
  let result = 0;
  for (const k of num) {
    result += parseInt(k, 10);
  }
  return result;
}

function rf(num) {
  if (num.length === 1) {
    return parseInt(num, 10);
  }
  return parseInt(num[num.length - 1], 10) + rf(num.slice(0, num.length - 1));
}

const number = '44822';
console.log('lf(number)', lf(number));
console.log('lf2(number)', lf2(number));
console.log('rf(number)', rf(number));
