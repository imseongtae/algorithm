// 피보나치
// 1 1 2 3 5 8 13 21 34

function fibonacci(index) {
  if (index === 1 || index === 2) {
    return 1;
  }
  return fibonacci(index - 1) + fibonacci(index - 2);
}

console.log('fibonacci: ', fibonacci(4));

function getFibonacciArr(length) {
  const result = [];
  let prevIdx = 0;
  let nextIdx = 1;
  for (let i = 1; i <= length; i++) {
    if (i === 1 || i === 2) {
      result.push(1);
    } else {
      const sum = result[prevIdx] + result[nextIdx];
      prevIdx++;
      nextIdx++;
      result.push(sum);
    }
  }
  return result;
}

console.log(getFibonacciArr(6));

// [ 1 ]
// [ 1, 1 ]
// [ 1, 1, 2 ]
// [ 1, 1, 2, 3 ]
// [ 1, 1, 2, 3, 5 ]
// [ 1, 1, 2, 3, 5, 8 ]
