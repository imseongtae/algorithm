# this

다른 대부분의 객체지향 언어에서 this는 클래스로 생성한 인스턴스 객체를 의미하는 까닭에 클래스에서만 사용할 수 있어서 혼란의 여지가 거의 없다. 그러나 자바스크립트에서 this는 어디서든 사용할 수 있으며, 상황에 따라 this가 바라보는 대상이 달리진다. 이러한 이유로 작동 방식을 정확하게 이해하지 못하면 원인을 파악해서 해결할 수 없다.

**함수와 객체(메서드)의 구분이 느슨한 자바스크립트에서 this는 이 둘을 실질적으로 구분하는 거의 유일한 기능이다.** 

## table of contents

1. [상황에 따라 달라지는 this](#상황에-따라-달라지는-this)





## 상황에 따라 달라지는 this

this는 실행 컨텍스트가 생성될 때 함께 결정된다. 이러한 실행 컨텍스트는 함수를 호출할 때 생성되므로, 다시 말하면 **this는 함수를 호출할 때 결정**된다고 할 수 있다.

### 전역 공간에서의 this

전역 컨텍스트를 생성하는 주체가 바로 전역 객체이기 때문에 전역 공간에서 this는 전역 객체를 가리킨다. 

```javascript
console.log(this); // Window { ... }
console.log(window); // Window { ... }
console.log(this === window); // truw
```



### 전역 공간에서 발생하는 특이한 현상

전역 공간에서는 특이한 현상이 하나 발생한다. 전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로도 할당한다. 사용자가 `var` 연산자를 이용해 변수를 선언하더라도 실제 자바스크립트 엔진은 어떤 특정 객체의 프로퍼티로 인식한다. 특정 객체란 바로 실행 컨텍스트의 LexicalEnvironment이며, 실행 컨텍스트는 변수를 수집해서 L.E의 프로퍼티로 저장한다. (단, 전역 컨텍스트의 경우 L.E는 전역객체를 그대로 참조한다)

```javascript
var a = 1;
console.log(a);
console.log(window.a);
console.log(this.a);
```

**전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로 할당**한다. 그렇지만 위의 예제에서 a를 호출할 경우 `1`이 나오는 이유는 변수 a에 접근하고자 할 때 스코프 체인에서 `a`를 검색하다가 가장 마지막에 도달하는 전역 스코프의 L.E, 즉 전역객체에서 해당 프로퍼티 `a`를 발견해서 그 값을 반환하기 때문이다.(단순하게 `window.` 이 생략된 것이라고 여겨도 됨)



### 전역변수 선언과 전역객체 프로퍼티 할당 사이의 차이점

전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로 할당한다는 이해를 얻으면, 전역공간에서 var로 변수를 선언하는 대신 전역객체의 프로퍼티로 할당하더라도 결과는 같다고 예상할 수 있다.

```javascript
var a = 1;
window.b = 2;
console.log(a, window.a, this.a); // 1 1 1
console.log(b, window.b, this.b); // 2 2 2

window.a = 3;
b = 4;
console.log(a, window.a, this.a); // 3 3 3
console.log(b, window.b, this.b); // 4 4 4
```

그렇지만 **삭제 명령**에 대해서는 다르다. 

```javascript
var a = 1;
delete window.a; // false
console.log(a, window.a, this.a); // 1 1 1

var b = 2;
delete b; // false
console.log(b, window.b, this.b); // 2 2 2

window.c = 3;
delete window.c;                  // true
console.log(c, window.c, this.c); // Uncaught ReferenceError: c is not defined

window.d = 4;
delete d;                         // true
console.log(d, window.d, this.d); // Uncaught ReferenceError: d is not defined
```

처음부터 전역객체의 프로퍼티로 할당한 경우에는 삭제가 되는 반면 전역변수로 선언한 경우에는 삭제가 되지 않는 것을 확인할 수 있다. 즉 전역변수를 선언하면 자바스크립트 엔진이 이를 자동으로 전역객체의 프로퍼티로 할당하면서 추가적으로 해당 프로퍼티의 configurable 속성(변경 및 삭제 가능성)을 false로 정의하는 것이다. 

이처럼 var로 선언한 전역변수와 전역객체의 프로퍼티는 호이스팅 여부 및 configurable 여부에서 차이를 보인다.



