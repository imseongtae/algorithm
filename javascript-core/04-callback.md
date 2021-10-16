# Callback

콜백 함수는 다른 코드의 인자로 넘겨주는 함수를 말한다. 콜백 함수는 다른 코드(함수 또는 메서드)에게 인자로 인자로 넘겨줌으로써 그 **제어권도 함께 위임한 함수**이다. 콜백 함수를 위임 받은 코드는 자체적인 내부 로직에 의해 이 콜백 함수를 적절한 시점에 실행할 것이다.


## table of contents
1. [제어권](#제어권)
2. [콜백 함수는 함수다](#콜백-함수는-함수다)
3. [콜백 지옥과 비동기 제어](#콜백-지옥과-비동기-제어)



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
아래의 예제는 0.5초의 주기마다 커피 목록을 수집하고 출력하는 코드이다. 목적 달성에는 지장이 없지만 들여쓰기 수준이 깊고, 값의 전달 순서가 '아래에서 위로' 향하므로 어색한 점이 있다.

```javascript
setTimeout(function (name) {
  var coffeeList = name;
  console.log(coffeeList);

  setTimeout(function (name) {
    coffeeList += ', ' + name;
    console.log(coffeeList);

    setTimeout(function (name) {
      coffeeList += ', ' + name;
      console.log(coffeeList);

      setTimeout(function (name) {
        coffeeList += ', ' + name;
        console.log(coffeeList);
      }, 500, '카페라떼');
    }, 500, '카페모카');
  }, 500, '아메리카노');
}, 500, '에스프레소');
```

이를 해결하는 가장 간단한 방법은 **익명의 콜백 함수를 모두 기명함수로 전환**하는 것이다. 이를 통해 코드의 가독성을 높이고, 함수 선언과 함수 호출만 구분할 수 있다면 위에서부터 아래로 순서대로 읽는데 어려움이 없다. (변수가 노출되는 문제가 발생하지만 즉시 실행 함수 등으로 감싼다면 간단히 해결할 수 있음)

```javascript
var coffeeList = '';

var addEspresso = function (name) {
  coffeeList = name;
  console.log(coffeeList);
  setTimeout(addAmericano, 500, '아메리카노');
};
var addAmericano = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addMocha, 500, '카페모카');
};
var addMocha = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
  setTimeout(addLatte, 500, '카페라떼');
};
var addLatte = function (name) {
  coffeeList += ', ' + name;
  console.log(coffeeList);
};

setTimeout(addEspresso, 500, '에스프레소');
```

### 비동기 작업의 동기적 표현

#### Promise
ES6의 Promise를 이용해 비동기 작업을 동기적으로 표현할 수 있다. `new` 연산자와 함께 호출한 Promise의 인자로 넘겨주는 콜백 함수는 호출할 때 바로 실행되지만 그 내부에 `resolve` 또는 `reject` 함수를 호출하는 구문이 있을 경우 둘 중 하나가 실행되기 전까지는 `then` 또는 `catch` 구문으로 넘어가지 않는다.

```javascript
new Promise(function (resolve) {
  setTimeout(function () {
    var name = '에스프레소';
    console.log(name);
    resolve(name);
  }, 500);
})
  .then(function (prevList) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var coffeeList = prevList + ', ' + '아메리카노';
        console.log(coffeeList);
        resolve(coffeeList);
      }, 500);
    });
  })
  .then(function (prevList) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        var coffeeList = prevList + ', ' + '카페모카';
        console.log(coffeeList);
        resolve(coffeeList);
      }, 500);
    });
  });
```

#### Promise + Closure

위의 Promise 를 사용한 예제에서 클로저를 사용하면 반복적인 내용을 함수화해 짧게 표현할 수 있다.

```javascript
var addCoffee = function (name) {
  return function (prevName) {
    return new Promise(function (resolve) {
      var coffeeList = prevName ? prevName + ', ' + name : name;
      console.log(coffeeList);
      resolve(coffeeList);
    });
  };
};

addCoffee('americano')()
  .then(addCoffee('espresso'))
  .then(addCoffee('mocha'))
  .then(addCoffee('latte'));
```

#### Generator

`*` 이 붙은 함수 `function*`가 **Generator 함수**이다. Generator를 실행하면 Iterator를 반환하는데, **Iterator**는 `next` 메서드를 가지고 있다. `next` 메서드를 호출하면 Generator 함수 내부에서 가장 먼저 등장하는 `yield`에서 함수의 실행을 멈춘다. 이후 다시 `next` 메서드를 호출하면 앞서 멈췄던 부분부터 시작해서 그 다음에 등장하는 `yield`에서 함수의 실행을 멈춘다. 

```javascript
var addCoffee = function (prevName, name) {
  setTimeout(function () {
    coffeeMaker.next(prevName ? prevName + ', ' + name : name);
  }, 500);
};

var coffeeGenerator = function* () {
  var espresso = yield addCoffee('', 'espress');
  console.log(espresso);
  var americano = yield addCoffee(espresso, 'americano');
  console.log(americano);
};

var coffeeMaker = coffeeGenerator();
coffeeMaker.next();
```

#### Promise + async/awiat

비동기 작업을 수행하고자 하는 함수 앞에 `async`를 표기하고, 함수 내부에서 실질적인 비동기 작업이 필요한 위치마다 `await`를 표기하는 것만으로 뒤의 내용을 Promise로 자동 전환하고, 해당 내용이 `resolve`된 이후에야 다음으로 진행한다.

```javascript
var addCoffee = function (name) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(name);
    }, 500);
  });
};

var coffeeMaker = async function () {
  var coffeeList = '';
  var _addCoffee = async function (name) {
    coffeeList += (coffeeList ? ', ' : '') + (await addCoffee(name));
  };
  await _addCoffee('espress');
  console.log(coffeeList);
  await _addCoffee('americano');
  console.log(coffeeList);
  await _addCoffee('latte');
  console.log(coffeeList);
  await _addCoffee('mocha');
  console.log(coffeeList);
};

coffeeMaker();
```



