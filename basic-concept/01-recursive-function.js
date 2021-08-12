/**
 * 재귀함수 - 내가 나를 호출하는 함수
 * 반복문 <-> 재귀함수는 상호호환이 됨
 */

// 반복문을 이용한 1부터 100까지의 합
// for문을 이용하면 총 100번의 순회하게 됨
// 시그마는 공식이 있음 - n(n+1)/2 (전체의 합 구하는 공식)
let sum = 0;
const n = 100;
for (let i = 1; i < n + 1; i++) {
  sum += i;
}

// 빅오 표기법에서 n은 입력의 개수를 나타낸다.
console.log('O(n)', sum); // 반복이 n에 비례함을 나타냄
console.log('O(1)', (n * (n + 1)) / 2); // 빅오의 1
console.log(
  Array(100)
    .fill()
    .map((arr, i) => i + 1)
    .reduce((prev, cur) => prev + cur),
);
