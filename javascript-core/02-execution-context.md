# Excution Context
실행 컨텍스트(execution context)는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체인데, 자바스크립트는 어떤 실행 컨텍스트가 활성화되는 시점에 변수를 위로 끌어올리고, 외부 환경 정보를 구성하고, this 값을 설정하는 등의 동작을 수행한다. 실행 컨텍스트는 동적 언어로서의 자바스크립트 특성이 잘 드러나는 개념이며, 이로 인해 다른 언어에서는 발견할 수 없는 특이한 현상을 야기한다.

## table of contents
1. [실행 컨텍스트란](#실행-컨텍스트란)
2. [VariableEnvironment](#VariableEnvironment)
3. [LexicalEnvironment](#LexicalEnvironment)
4. [outerEnvironmentReference](#outerEnvironmentReference)




## 실행 컨텍스트란
실행 컨텍스트는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체라고 정의할 수 있다. 

### 배경 지식

실행 컨텍스트에 대해 이해하기 위해서는 Stack과 Queue 자료구조에 대한 이해가 필요하다.

#### Stack
**스택은 출입구가 하나뿐인 우물** 같은 데이터 구조이다. 스택에 데이터 a, b, c, d를 저장했다면, 꺼낼 때는 d, c, b, a의 순서대로 꺼낼 수밖에 없다. 데이터를 100개만 저장할 수 있는 우물에 100개 이상의 데이터를 넣으려고 할 경우 넘칠 수밖에 없는데 많은 프로그래밍 언어들은 이 경우 에러를 반환한다.

#### Queue
**큐는 양쪽이 모두 열려 있는 파이프**를 연상하면 된다. 종류에 따라 양쪽 모두 입력과 출력이 가능한 큐도 있으나 보통은 한쪽은 입력만, 다른 한쪽은 출력만 담당하는 구조를 말한다. 큐에 순서대로 데이터 a, b, c, d를 저장했다면, 꺼낼 때도 마찬가지로 a, b, c, d의 순서대로 꺼내게 된다.

### 콜스택에 실행 컨텍스트가 쌓이는 순서 예제

```javascript
// (1)
var a = 1;

function outer() {
  function inner() {
    console.log(a); // undefined
    var a = 3;
  }
  inner(); // (2)
  console.log(a); // 1
}

outer(); // (3)
console.log(a); // 1
```



<img src="https://user-images.githubusercontent.com/60806840/134811469-976ebcbc-ba46-496c-810f-b1699f763196.png" />

스택 구조에 따르면 한 실행 컨텍스트가 콜 스택의 맨 위에 쌓이는 순간이 곧 현재 실행할 코드에 관여하게 되는 시점임을 알 수 있다(기존 컨텍스트는 새로 쌓인 컨텍스트보다 아래 위치할 수밖에 없기 때문).  
자바스크립트 엔진은 어떤 실행 컨텍스트가 활성화될 때, 해당 컨텍스트에 관련된 코드들을 실행하는데 필요한 환경 정보들을 수집해서 실행 컨텍스트 객체에 다음과 같은 정보를 저장한다.

- **VariableEnvironment**: 현재 컨텍스트 내의 식별자들에 대한 정보와 외부 환경 정보. 선언 시점의 LexicalEnvironment 의 스냅샷으로, 변경 사항은 반영되지 않음
- **LexicalEnvironment**: 처음은 VariableEnvironment와 같지만 변경사항이 실시간으로 반영됨
- **ThisBindings**: this 식별자가 봐라봐야 할 대상 객체

---



## VariableEnvironment

VariableEnvironment에 담기는 내용은 LexicalEnvironment 와 같지만 최초 실행 시의 스내샷을 유지한다는 점이 다르다. 실행 컨텍스트를 생성할 때 VariableEnvironment에 정보를 먼저 담고서, 이를 그대로 복사해 LexicalEnvironment 를 만들고, 이후 주로 LexicalEnvironment를 활용한다. 



## LexicalEnvironment

비유적으로 컨텍스트를 구성하는 환경 정보들을 모아놓은 것으로 여길 수 있다. 

### Hoisting

Hoisting은 변수 정보를 수집하는 과정을 이해하기 쉬운 방법으로 대체한 가상의 개념이다.

environmentRecord에는 매개변수의 이름, 함수 선언, 변수명 등이 담기는데, environmentRecord는 현재 실행될 컨텍스트의 대상 코드 내에 어떤 식별자들이 있는지만 신경 쓴다. 때문에 변수를 호이스팅할 때 변수명만 끌어올리고 할당 과정은 원래 자리에 그대로 남겨둔다. 매개변수의 경우도 마찬가지이다. 

#### 첫 번째 예제

매개변수와 변수의 호이스팅에 대해 알아보기 위한 예제

```javascript
function a(x) {
  console.log(x);
  var x;
  console.log(x);
  var x = 2;
  console.log(x);
}
a(1);
```

위의 코드에 대해 매개변수와 변수에 대해 호이스팅(가상의 개념)을 적용하면 아래 코드 형태로 바뀐다고 이해할 수 있다.(실제 자바스크립트 엔진은 이러한 변환을 거치지 않음). 

**호이스팅에서는 매개변수를 선언/할당과 같다고 여겨서 변환할 수 있다.**

```javascript
function a(x) {
  var x; // 매개변수도 마찬가지로 변수처럼 여겨 선언부를 끌어올림
  var x;
  var x;

  x = 1; // 매개변수도 마찬가지로 할당 과정은 원래 자리에 남겨둠
  console.log(x);
  console.log(x);
  x = 2;
  console.log(x);
}
a(1);
```

#### 두 번째 예제

함수 선언에 대한 호이스팅을 알아보기 위한 예제

```javascript
function a() {
  console.log(b); // f() b {}
  var b = 'bbb';
  console.log(b); // 'bbb'
  function b() {}
  console.log(b); // 'bbb'
}
a();
```

위의 코드에 대해 변수와 함수 호이스팅(가상의 개념)을 적용하면 아래 코드 형태로 바뀐다고 이해할 수 있다.(실제 자바스크립트 엔진은 이러한 변환을 거치지 않음). 

```javascript
function a() {
  var b;
  // function b() {} // 호이스팅이 끝난 함수 선언문은
  var b = function b() {}; // 함수명으로 선언한 변수에 함수를 할당한 것으로 여길 수 있음

  console.log(b);
  b = 'bbb';
  console.log(b);
  console.log(b);
}
```



### 함수 선언문과 함수 표현식

#### 함수를 정의하는 세 가지 방식

- 함수 선언문: function 정의부만 존재하고 별도의 할당 명령이 없는 것
- (익명) 함수 표현식: 정의한 function을 별도의 변수에 할당하는 것
- 기명 함수 표현식: 함수명을 정의한 함수 표현식

```javascript
function a() { /*... */ } // 함수 선언문, 함수명 a가 곧 변수명
a(); // 실행 OK.

var b = function () { /*... */ }; // (익명) 함수 표현식. 변수명 b가 곧 함수명.
b(); // 실행 OK.

var c = function d() { /*... */ }; // 기명 함수 표현식. 변수명 c, 함수명은 d
c(); // 실행 OK.
d(); // error!
```



### 함수 선언문과 함수 표현식의 차이

함수 선언문과 함수 표현식은 호이스팅에 의해 차이가 발이가 발생하는데, 함수 선언문은 함수 본문 전체를 호이스팅 하지만 함수 표현식의 경우에는 변수 선언의 호이스팅과 같이 선언부만 호이스팅된다. (함수를 다른 변수에 값으로써 할당한 것이 함수 표현식)

```javascript
console.log(sum(1, 2));
console.log(multiply(3, 4));

function sum(a, b) { // 함수 선언문
  return a + b;
}

var multiply = function (a, b) { // 함수 표현식
  return a + b;
};

// ---- result ----
// 3
// TypeError: multiply is not a function
```



**호이스팅이 적용된 코드**의 실행

```javascript
// hoisting
// 함수 선언문
var sum = function sum(a, b) {
  return a + b;
};
var multiply;

console.log(sum(1, 2)); // 3
console.log(multiply(3, 4)); // multiply is not a function

// 변수의 할당부는 원래 자리에 남겨둠
multiply = function (a, b) { // 함수 표현식
  return a + b;
};
```

1. 메모리 공간을 확보하고, 확보한 공간의 주솟값을 변수 `sum`에 연결
2. 또 다른 메모리 공간을 확보하고, 확보한 공간의 주솟값을 변수 `mutiply` 에 연결
3. 다시 첫 번째 줄로 돌아와서, `sum` 함수를 또 다른 메모리 공간에 저장하고, 그 주솟값을 앞서 선언한 변수 `sum`의 공간에 할당. 이로써 변수 `sum`은 함수 `sum`을 바라보는 상태가 됨
4. `console.log`의 `sum` 을 실행. 정상적으로 실행되어 3을 반환
5. `console.log`의 `multiply` 안에는 값이 할당되어 있지 않음. 비어있는 대상을 함수로 여겨 실행하라고 명령한 것과 같으므로 'multiply is not a function' 이라는 메시지 출력함. 이 에러로 인해 이후의 코드는 실행되지 않은 채로 런타임이 종료됨

---

sum 함수는 호출 전에도 문제 없이 실행 되는데, 이 부분은 자바스크립트를 쉽게 접근할 수 있게 해주는 측면도 있지만 반대로 큰 혼란을 야기하는 원인이 되기도 한다. 프로그래밍 언어도 문장을 읽는 순서대로 '선언 이후에 호출할 수 있는 편'이 훨씬 자연스럽다.



## outerEnvironmentReference

ES5까지의 자바스크립트는 특이하게도 전역공간을 제외하면 오직 함수에 의해서만 스코프가 생성된다.  이렇게 식별자의 유효범위를 안에서부터 바깥으로 차례로 검색해나가는 것을 스코프 체인이라고 하는데, 이를 가능하게 하는 것이 LexicalEnvironment의 두 번째 수집자료인  outerEnvironmentReference이다.

### Scope chain

스코프란 식별자에 대한 유효범위를 말한다. outerEnvironmentReference는 연결리스트 형태를 띄는데, 선언 시점의 LexicalEnvironment를 찾아올라가면 마지막엔 전역 컨텍스트의 LexicalEnvironment가 있기 때문이다. 각 outerEnvironmentReference 는 오직 자신이 선언된 시점의 LexicalEnvironment 만 참조하고 있으므로 가장 가까운 요소부터 차례대로만 접근할 수 있고, 다른 순서로 접근하는 것은 불가능하다. 이러한 구조적 특성으로 인해 여러 스코프에서 동일한 식별자를 선언한 경우에 무조건 스코프 체인 상에서 가장 먼저 발견된 식별자에만 접근 가능하게 된다.

### 스코프 체인 예제

```javascript
// scope chain
var a = 1;
var outer = function () {
  var inner = function () {
    console.log(a);
    var a = 3;
  };
  inner();
  console.log(a);
};
outer();
console.log(a);
```

 

### 다시 살펴보는 전역변수와 지역변수의 개념

**전역변수**는 전역 공간에서 선언한 변수이고, **지역변수**는 함수 내부에서 선언한 변수를 말한다. 이를 풀어서 설명하면 전역 컨텍스트의 LexicalEnvironment에 담긴 변수가 전역변수가 이고, 그 밖의 함수에 의해 생성된 실행 컨텍스트의 변수들은 모두 지역변수이다.

코드 상에서 어떤 변수에 접근할 때 현재 컨텍스트의 LexicalEnvironment를 탐색해서 발견하면 그 값을 반환하고, 발견하지 못하면 다시 outerEnvironmentReference에 담긴 LexicalEnvironment를 탐색하는 과정을 거친다. 만약 전역 컨텍스트의 LexicalEnvironment까지 탐색해도 해당 변수를 찾지 못하면 undefined를 반환한다. 

### 변수 은닉화

스코프 체인 상에 있는 변수라고 해도 무조건 접근할 수 있는 것은 아니다. `inner` 함수 내부에서 `a` 변수를 선언했으므로 전역 공간에서 선언한 동일한 이름의 `a` 변수에는 접근할 수 없다. `inner` 함수에서는 무조건 스코프 체인 상에서의 첫 번째 인자, 즉` inner` 스코프의 LexicalEnvironment부터 검색할 수밖에 없다.

```javascript
var a = 1;
var outer = function () {
  var inner = function () {
    console.log(a); // inner 함수의 실행 컨텍스트에서는 무조건 가장 가까운 변수 a에 접근하게 됨
    var a = 3;
  };
  inner();
  console.log(a);
};
outer();
console.log(a);
```

