// 최솟값과 최댓값 구하기

const arr = [10, 20, 30, 1, 2, 3, 5, 9, 11];

arr.sort();
console.log(arr[0]);
console.log(arr); // 사전 방식의 정렬
console.log('max:', Math.max(10, 20));
console.log('min:', Math.min(10, 20));
console.log('max in arr:', Math.max.apply(null, arr));
console.log('min in arr:', Math.min.apply(null, arr));

function getMax(arr) {
  let result = arr[0];
  for (let num of arr) {
    if (result < num) {
      result = num;
    }
  }
  return result;
}

function getMin(arr) {
  let result = arr[0];
  for (const num of arr) {
    if (result > num) {
      result = num;
    }
  }
  return result;
}

console.log('getMax:', getMax(arr));
console.log('getMin:', getMin(arr));
console.log(
  'max:',
  arr.reduce((prev, cur) => (prev < cur ? cur : prev)),
);
console.log(
  'min:',
  arr.reduce((prev, cur) => (prev < cur ? prev : cur)),
);
