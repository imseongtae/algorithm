function getMin(arr) {
  let result = arr[0];
  for (const iterator of arr) {
    if (iterator < result) {
      result = iterator;
    }
  }
  return result;
}

function getIndex(arr, value) {
  let result = null;
  for (const k in arr) {
    if (arr[k] === value) {
      result = k;
    }
  }
  return result;
}

function selectionSort(arr) {
  const result = [];
  while (arr.length) {
    result.push(getMin(arr));
    const deletionIndex = getIndex(arr, getMin(arr));
    arr.splice(deletionIndex, 1);
  }
  return result;
}

const arr = [10, 11, 9, 2, 3, 6, 21, 4];
console.log(selectionSort(arr));

// indexOf를 대신할 수 있도록 수정하기
// function getMinIndex(arr) {
//   let result = 0;
//   let temp = arr[0];
//   for (const k in arr) {
//     if (arr[k] < temp) {
//       temp = arr[k];
//       result = k;
//     }
//   }
//   return result;
// }
