# Callback

콜백 함수는 다른 코드의 인자로 넘겨주는 함수를 말한다. 콜백 함수는 다른 코드(함수 또는 메서드)에게 인자로 인자로 넘겨줌으로써 그 **제어권도 함께 위임한 함수**이다. 콜백 함수를 위임 받은 코드는 자체적인 내부 로직에 의해 이 콜백 함수를 적절한 시점에 실행할 것이다.


## table of contents
1. [제어권](#제어권)
2. [콜백 함수는 함수다](#콜백-함수는-함수다)



## 제어권

### 호출 시점

콜백 함수의 제어권을 넘겨받은 코드는 콜백 함수 호출 시점에 대한 제어권을 가진다. 다음은 호출 시점을 확인하기 위한 콜백 함수 예제.

```javascript
var count = 0;
var timeout = 300;
var cbFunc = function () {
  console.log(count, `(${timeout / 1000}초)`);
  timeout += 300;
  if (++count > 4) clearInterval(timer);
};
var timer = setInterval(cbFunc, timeout); // setInterval의 ID 값이 담김
```

setInterval의 인자로 전달한 cbFunc는 매 delay(ms) 마다 실행되며, 그 결과 어떠한 값도 리턴하지 않는다. setInterval을 실행하면 반복적으로 실행되는 내용 자체를 특정할 수 있는 고유한 ID값이 반환된다. 이를 변수에 담는 이유는 중간에 clearInterval을 통해 종료하기 위함이다. 

### 인자

콜백 함수의 제어권을 넘겨받은 코드는 콜백 함수를 호출할 때 인자에 어떤 값들을 어떤 순서로 넘길 것인지에 대한 제어권을 가진다. 이 순서를 따르지 않고 코드를 작성하면 엉뚱한 결과를 얻게 된다. 

#### 콜백 함수 예제

```javascript
var newArr = [10, 20, 30].map(function (cur, i) {
  console.log('current value:', cur, 'index:', i);
  return cur + 5;
});

console.log(newArr);
// -- 실행 결과 --
// current value: 10 index: 0
// current value: 20 index: 1
// current value: 30 index: 2
// [ 15, 25, 35 ]
```

### this

#### Array.prototype.map 구현 예제

콜백 함수도 함수이므로 기본적으로는 this가 전역객체를 참조하지만 제어권을 넘겨받을 코드에서 콜백 함수에 별도로 this가 될 대상을 지정한 경우에는 그 대상을 참조하게 된다. 별도의 this를 지정하고, 제어권에 대한 이해를 높이기 위해 map 메서드를 구현하는 아래 예제를 확인해보자.

```javascript
Array.prototype.customizedMap = function (callback, thisArg) {
  var mappedArr = [];
  for (let i = 0; i < this.length; i++) {
    var mappedValue = callback.call(thisArg || window, this[i], i, this);
    mappedArr[i] = mappedValue;
  }
  return mappedArr;
};

var arr = [1, 2, 3, 4];
var result = arr.customizedMap(function (item) {
  return item + 5;
});
console.log(result); // [ 6, 7, 8, 9 ]
```

---

**[⬆ back to top](#table-of-contents)**



## 콜백 함수는 함수다

### 메서드를 콜백 함수로 전달한 경우

**콜백 함수는 함수**이므로, **어떤 객체의 메서드를 전달하더라도 결국 메서드가 아닌 함수로서 호출**된다. 

```javascript
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    console.log(this, v, i);
  },
};

obj.logValues(1, 2); // {vals: Array(3), logValues: ƒ} 1 2
[4, 5, 6].forEach(obj.logValues);
// result 
// Window { ... } 4 0
// Window { ... } 5 1
// Window { ... } 6 2
```

`Array.prototype.forEach(callback[, thisArg])` 의 용법에 따라 `this`를 인자로 전달한 경우의 예제

```javascript
var obj = {
  vals: [1, 2, 3],
  logValues: function (v, i) {
    console.log(this, v, i);
  },
};

obj.logValues(1, 2); // {vals: Array(3), logValues: ƒ} 1 2
[4, 5, 6].forEach(obj.logValues, obj); // obj를 전달하면 전역 객체를 바라보지 않음
// result
// {vals: Array(3), logValues: ƒ} 4 0
// {vals: Array(3), logValues: ƒ} 5 1
// {vals: Array(3), logValues: ƒ} 6 2
```



## 콜백 함수 내부의 this에 다른 값 바인딩하기

객체의 메서드를 콜백 함수로 전달하면 메서드는 자신이 속한 객체를 `this`로 바라볼 수 없게 되지만 그럼에도 콜백 함수 내부에서 `this`가 객체를 바라보게 하기 위한 방법이 있다. 과거에는 `this`를 다른 변수에 담아, 콜백 함수로 활용할 함수에서는 `this`대신 그 변수를 사용하게 하고, 이를 클로저로 만드는 방식이 많이 쓰였다. 

### 콜백 함수 내부의 this에 다른 값을 바인딩하는 방법

```javascript
var obj = {
  name: 'obj',
  func: function () {
    var self = this;
    return function () {
      console.log(self.name);
    };
  },
};

var callback = obj.func();
setTimeout(callback, 1000);
```

### 콜백 함수 내부에서 this를 사용하지 않는 경우

```javascript
// 재활용이 어렵다
var obj = {
  name: 'obj',
  func: function () {
    console.log(obj.name);
  },
};
setTimeout(obj.func, 1000);
```

### func 함수의 재활용

`self` 변수를 통해 `this`를 우회적으로 사용하는 방법은 조금 번거롭긴 하지만 다양한 상황에서 원하는 객체를 바라보는 콜백 함수를 만들 수 있는 방법이다.

```javascript
var obj = {
  name: 'obj',
  func: function () {
    var self = this;
    return function () {
      console.log(self.name);
    };
  },
};

var callback = obj.func();
setTimeout(callback, 1000); // obj

var copiedObj1 = { name: 'copied obj1', func: obj.func };
var callback2 = copiedObj1.func();
setTimeout(callback2, 1000); // copied obj1

var copiedObj2 = { name: 'copied obj2' };
var callback3 = obj.func.call(copiedObj2);
setTimeout(callback3, 1000); // copied obj2
```

### 콜백 함수 내부의 this에 다른 값을 바인딩하는 방법

```javascript
var obj = {
  name: 'obj',
  func: function () {
    console.log(this);
  },
};

var callback = obj.func;
setTimeout(callback.bind(obj), 1000);
var copiedObj = { name: 'copied obj' };
setTimeout(obj.func.bind(copiedObj), 1500);
```

---

**[⬆ back to top](#table-of-contents)**



## 콜백 지옥과 비동기 제어

### 콜백 지옥

콜백 지옥은 콜백 함수를 익명 함수로 전달하는 과정이 반복되어 코드의 들여쓰기 수준이 감당하기 힘들 정도로 깊어지는 현상을 말한다. 콜백 지옥에 대해 이해하기 위해서는 동기와 비동기에 대한 이해가 필요하다.

#### 동기

현재 실행 중인 코드가 완료된 후 다음 코드를 실행하는 방식을 말한다. CPU의 계산에 의해 즉시 처리가 가능한 대부분의 코드는 동기적인 코드이다. 계산이 복잡해서 CPU가 계산하는데 시간이 많이 걸리더라도 이는 동기적인 코드이다. 

#### 비동기

현재 실행 중인 코드의 완료 여부와 무관하게 즉시 다음 코드로 넘어가는 방식을 말한다. 별도의 요청, 실행 대기, 보류 등과 관련된 코드는 비동기적인 코드이다. 

- 사용자의 요청에 의해 특정 시간이 경과하기 전까지 어떤 함수의 실행을 보류하는 `setTimeout`
- 사용자의 직접적인 개입이 있을 때 함수를 실행하도록 대기하는 `addEventListener`
- 웹 브라우저가 자체가 아닌 별도의 대상에 무언가를 요청하고, 그에 대한 응답이 왔을 때 비로소 어떤 함수를 실행하도록 대기하는 `XMLHttpRequest`

#### 콜백 지옥 예시

```javascript
// callback
```















