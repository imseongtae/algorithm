// 문자열 뒤집기

function f(s) {
  let result = '';
  for (const k of s) {
    result = k + result;
  }
  return result;
}

function lf(s) {
  let result = '';
  let isFlag = true;
  while (isFlag) {
    if (s.length === 1) {
      isFlag = false;
    }
    let temp = s.split('');
    result += String(temp.pop());
    s = temp.join('');
  }
  return result;
}

// function rf(s) {
//   let result = '';
//   if (s.length === 1) {
//     return s;
//   }
//   let temp = s.split('');
//   result += String(temp.pop());
//   s = temp.join('');
//   return result + rf(s);
// }

function rf(s) {
  if (s.length === 1) {
    return s;
  }
  return s[s.length - 1] + rf(s.slice(0, s.length - 1));
}

const s = 'imseongtae';
console.log('f(s)', f(s));
console.log('lf(s)', lf(s));
console.log('rf(s)', rf(s));
console.log(s.match(/\w/g).reduce((prev, cur) => cur + prev));
