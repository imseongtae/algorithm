# Callback

콜백 함수는 다른 코드의 인자로 넘겨주는 함수를 말한다. 콜백 함수는 다른 코드(함수 또는 메서드)에게 인자로 인자로 넘겨줌으로써 그 **제어권도 함께 위임한 함수**이다. 콜백 함수를 위임 받은 코드는 자체적인 내부 로직에 의해 이 콜백 함수를 적절한 시점에 실행할 것이다.


## table of contents
1. [제어권](#제어권)







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





---

**[⬆ back to top](#table-of-contents)**















