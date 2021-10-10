# this

다른 대부분의 객체지향 언어에서 this는 클래스로 생성한 인스턴스 객체를 의미하는 까닭에, this를 클래스에서만 사용할 수 있어서 혼란의 여지가 거의 없다. 그러나 자바스크립트에서 this는 어디서든 사용할 수 있으며, 상황에 따라 this가 바라보는 대상이 달리진다. 이러한 이유로 this의 작동 방식을 정확하게 이해하지 못하면 문제가 발생했을 때 원인을 파악해서 해결할 수 없다.

**함수와 객체(메서드)의 구분이 느슨한 자바스크립트에서 this는 이 둘을 실질적으로 구분하는 거의 유일한 기능이다.** 

## table of contents

1. [상황에 따라 달라지는 this](#상황에-따라-달라지는-this)
2. [명시적으로 this를 바인딩하는 방법](#명시적으로-this를-바인딩하는 방법)





## 상황에 따라 달라지는 this

this는 실행 컨텍스트가 생성될 때 함께 결정된다. 이러한 실행 컨텍스트는 함수를 호출할 때 생성되므로, 다시 말하면 **this는 함수를 호출할 때 결정**된다고 할 수 있다.



### 전역 공간에서의 this

전역 컨텍스트를 생성하는 주체가 바로 전역 객체이기 때문에 전역 공간에서 this는 전역 객체를 가리킨다. 

```javascript
console.log(this); // Window { ... }
console.log(window); // Window { ... }
console.log(this === window); // truw
```

#### 전역 공간에서 발생하는 특이한 현상

전역 공간에서는 특이한 현상이 하나 발생한다. 전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로도 할당한다. 사용자가 `var` 연산자를 이용해 변수를 선언하더라도 실제 자바스크립트 엔진은 어떤 특정 객체의 프로퍼티로 인식한다. 특정 객체란 바로 실행 컨텍스트의 LexicalEnvironment이며, 실행 컨텍스트는 변수를 수집해서 L.E의 프로퍼티로 저장한다. (단, 전역 컨텍스트의 경우 L.E는 전역객체를 그대로 참조한다)

```javascript
var a = 1;
console.log(a);
console.log(window.a);
console.log(this.a);
```

**전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로 할당**한다. 그렇지만 위의 예제에서 `a`를 호출할 경우 `1`이 나오는 이유는 변수 `a`에 접근하고자 할 때 스코프 체인에서 `a`를 검색하다가 가장 마지막에 도달하는 전역 스코프의 L.E, 즉 전역객체에서 해당 프로퍼티 `a`를 발견해서 그 값을 반환하기 때문이다(단순하게 `window.` 이 생략된 것이라고 여겨도 됨)

#### 전역변수 선언과 전역객체 프로퍼티 할당 사이의 차이점

전역변수를 선언하면 자바스크립트 엔진은 이를 전역객체의 프로퍼티로 할당한다는 이해를 얻을 수 있는데, 이를 통해서 전역공간에서 `var`로 변수를 선언하는 대신 전역객체의 프로퍼티로 할당하더라도 결과는 같다고 예상해볼 수 있다.

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

처음부터 **전역객체의 프로퍼티로 할당한 경우에는 삭제가 되는 반면 전역변수로 선언한 경우에는 삭제가 되지 않는 것**을 확인할 수 있다. 즉 전역변수를 선언하면 자바스크립트 엔진이 이를 자동으로 전역객체의 프로퍼티로 할당하면서 추가적으로 해당 프로퍼티의 configurable 속성(변경 및 삭제 가능성)을 false로 정의하는 것이다. 

이처럼 `var`로 선언한 전역변수와 전역객체의 프로퍼티는 호이스팅 여부 및 configurable 여부에서 차이를 보인다.

---

**[⬆ back to top](#table-of-contents)**



### 메서드로서 호출할 때 this

프로그래밍 언어에서 함수와 메서드는 미리 정의한 동작을 수행하는 코드 뭉치로, 이 둘을 구분하는 **유일한 차이는 독립성**이다. 함수는 그 자체로 독립적인 기능을 수행하는 반면, **메서드는 자신을 호출한 대상 객체에 관한 동작**을 수행하는데 자바스크립트는 상황별로 this 키워드에 다른 값을 부여하게 함으로써 이를 구현했다.

#### 함수로서 호출과 메서드로서의 호출 비교

흔히 **'메서드를 객체의 프로퍼티에 할당된 함수'로 이해하곤 하는데, 이는 반은 맞고 반은 틀린 개념**이다. 어떤 함수를 객체의 프로퍼티에 할당한다고 해서 메서드가 되는 것이 아니라 **객체의 메서드로서 호출한 경우에만 메서드로 동작하고, 그렇지 않으면 함수로 동작**한다.

```javascript
var func = function (x) {
  console.log(this, x);
};
func(1); // Window { ... }, 1

var obj = {
  burger: 'hamburger',
  method: func,
};
obj.method(2); // {burger: 'hamburger', method: ƒ}, 2
```

위의 예제를 통해 원래의 익명함수는 그대로인데, 이를 변수에 담아 호출한 경우와 obj 객체의 프로퍼티에 할당해서 호출한 경우 this가 달라지는 것을 확인할 수 있다.



#### 함수로서의 호출과 메소드로서의 호출 구분

함수로서의 호출인지 메소드로서의 호출인지 구분하기 위해선 함수 앞에 **점(`.`)**이 있는지 살펴보면 된다. 대괄호 표기법까지 생각하면 살펴야 하는 경우는 늘어날 수 있지만 **어떤 함수를 호출할 때 그 함수 이름 앞에 객체가 명시되어 있는 경우에는 메서드로서 호출한 것이고, 그렇지 않은 경우는 함수로 호출**한 것이다.

#### 메소드 내부에서의 this

**this에는 호출한 주체에 대한 정보**가 담긴다. 어떤 함수를 메서드로서 호출하는 경우 호출한 주체는 바로 함수명(프로퍼티명) 앞의 객체이다. **점 표기법의 경우 마지막 점 앞에 명시된 객체가 곧 this**가 되는 것이다.

```javascript
var obj = {
  methodA: function () {
    console.log(this);
  },
  inner: {
    methodB: function () {
      console.log(this);
    },
  },
};

obj.methodA();    // { methodA: f, inner: {...} }    { === obj }
obj['methodA'](); // { methodA: f, inner: {...} }    { === obj }

obj.inner.methodB();       // { methodB: f }         { === obj.inner }
obj.inner['methodB']();    // { methodB: f }         { === obj.inner }
obj['inner'].methodB();    // { methodB: f }         { === obj.inner }
obj['inner']['methodB'](); // { methodB: f }         { === obj.inner }
```

---

**[⬆ back to top](#table-of-contents)**



### 함수로서 호출할 때, 함수 내부에서의 this

어떤 함수를 함수로서 호출한 경우에는 `this`가 지정되지 않는다. `this`에는 호출한 주체에 대한 정보가 담기는데, 함수로서 호출하는 것은 호출 주체를 명시하지 않고, 개발자가 코드에 직접 관여해서 실행한 것이므로 호출 주체의 정보를 알 수 없다. 따라서 함수에서의 `this`는 전역객체를 가리킨다. (더글라스 크락포드는 이를 설계상의 오류라고 지적했다.)

#### 메서드 내부함수에서의 this

내부함수 또한 이를 함수로서 호출했는지 메서드로서 호출했는지만 파악하면 this의 값을 정확히 맞출 수 있다.  아래의 예제에서 outer 메서드 내부의 함수를 함수로서 호출했는지, 메서드로서 호출했는지에 따라 바인딩되는 this의 대상이 서로 다르다. 

```javascript
var obj1 = {
  outer: function () {
    console.log(this); // obj1
    var innerFunc = function () {
      console.log(this);
    };
    // outer 메서드 내부의 함수를 함수로서 호출
    innerFunc(); // Window {...}

    var obj2 = {
      innerMethod: innerFunc,
    };
    // outer 메서드 내부의 함수를 메서드로서 호출
    obj2.innerMethod(); // obj2
  },
};

obj1.outer();
```

결과적으로 `this`바인딩에 관해서 함수를 실행하는 당시의 주변 환경은 중요하지 않고, **오직 함수를 호출하는 구문 앞에 점 또는 대괄호 표기가 있는지 없는지가 관건**이다.

#### 내부 함수에서의 this를 우회하는 방법

아쉽게도 ES5까지는 내부함수에 this를 상속할 방법이 없지만 다행히 이를 우회할 방법이 없지는 않다. 가장 대표적인 방법으로는 변수를 활용하는 방법이 있다.

```javascript
var obj = {
  outer: function () {
    console.log(this); // { outer: f }
    var innerFunc1 = function () {
      console.log(this); // Window {...}
    };
    // outer 메서드 내부의 함수를 함수로서 호출
    innerFunc1();

    var self = this;
    var innerFunc2 = function () {
      console.log(self);
    };
    innerFunc2(); // { outer: f }
  },
};

obj.outer();
```

위의 예제에서 `innerFunc1` 내부의 this는 전역 객체를 가리키지만, `outer` 스코프에서 `self`라는 변수에 `this`를 저장한 상태에서 호출한 `innerFunc2`의 경우 `self`에는 객체 `obj`가 출력된다. 그저 상위 스코프의 `this`를 저장해서 내부함수에서 활용하는 수단일뿐이지만 기대에는 충실히 부합한다.

#### this를 바인딩하지 않는 함수

ES6에서는 함수 내부에서 this가 전역객체를 바라보는 문제를 보완하고자 this를 바라보지 않는 화살표 함수를 새로 도입했다.

```javascript
var obj = {
  outer: function () {
    console.log(this); // { outer: f }

    var innerFunc = () => {
      console.log(this); // { outer: f }
    };
    innerFunc();

    // 즉시 실행함수
    (() => {
      console.log(this); // { outer: f }
    })();
  },
};

obj.outer();
```

---

**[⬆ back to top](#table-of-contents)**



### 콜백 함수 호출 시 그 함수 내부에서의 this

함수 A의 제어권을 다른 함수 B에게 넘겨주는 경우 함수 A를 콜백 함수라고 한다. 이때 함수 A는 함수 B의 내부 로직에 따라 실행되며, this 역시 함수 B 내부 로직에서 장한 규칙에 따라 값이 결정된다. 

```javascript
setTimeout(function () { // 1
  console.log('this is in timeout');
  console.log(this); // Window { ... }
}, 1000);

[1, 2, 3, 4, 5].forEach(function (x) { // 2
  console.log(this, x);  // Window { ... }
});

document.body.innerHTML += '<button id="a">클릭</button>';
document.body.querySelector('#a').addEventListener('click', function (e) { // 3
  console.log(this, e); // <button id="a">클릭</button>, PointerEvent { ... }
});
```

(1) `setTimeout` 함수와 (2) `forEach` 메서드는 그 내부에서 콜백 함수를 호출할 때 대상이 될 `this`를 지정하지 않으므로 콜백 함수 내부에서 `this`는 전역 객체를 참조한다. 반면 `addEventListener` 메서드는 콜백 함수를 호출할 때 자신의 `this`를 상속하도록 정의되어 있으므로 메서드명의 점(`.`) 앞부분이 `this`가 된다. 

콜백 함수에서의 `this`는 콜백함수의 제어권을 가지는 **함수(메서드)에서 결정**하며, 특별히 정의하지 않은 경우에는 기본적으로 전역객체를 가리킨다.

### 생성자 함수 내부에서의 this

생성자 함수는 어떤 공통된 성질을 지니는 객체들을 생성하는데 사용하는 함수이다. 객체지향 언어에서는 **생성자를 클래스**, **클래스를 통해 만든 객체를 인스턴스**라고 한다. 생성자는 구체적인 인스턴스를 만들기 위한 일종의 틀이다. 이 틀에는 클래스의 공통 속성들이 미리 준비돼 있고, 여기에 구체적인 인스턴스의 개성을 더해 개별 인스턴스를 만들 수 있다. 

#### 자바스크립트의 생성자 함수

자바스크립트는 함수에 생성자로서의 역할을 함께 부여했다. `new` 명령어와 함께 함수를 호출하면 해당 함수가 생성자로서 동작하게 된다. 그리고 어떤 함수가 생성자로서 호출된 경우 내부에서의 **`this`는 곧 새로 만들 구체적인 인스턴스 자신**이 된다. 

**생성자 함수를 호출**(new 명령어와 함께 함수를 호출)하면 우선 생성자의 `prototype` 프로퍼티를 참조하는 `__proto__` 라는 프로퍼티가 있는 **객체(인스턴스)**를 만들고, **미리 준비된 공통 속성 및 개성을 해당 객체에 부여**한다. 이렇게 해서 **구체적인 인스턴스**가 만들어진다.

```javascript
var Cat = function (name, age) {
  this.bark = '야옹';
  this.name = name;
  this.age = age;
};

var choco = new Cat('초코', 7);
var nabi = new Cat('나비', 5);

// 각각의 인스턴스에서 this는 'Cat 클래스의 인스턴스 객체'를 가리킨다.
console.log(choco); // Cat { bark: '야옹', name: '초코', age: 7 }
console.log(nabi);  // Cat { bark: '야옹', name: '나비', age: 5 }
```

---

**[⬆ back to top](#table-of-contents)**





## 명시적으로 this를 바인딩하는 방법

### call 메서드

**call 메서드는 메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령**이다. 함수를 그냥 실행하면 this는 전역객체를 참조하지만 call 메서드를 이용하면 임의의 객체를 this로 지정할 수 있다.

```javascript
var func = function (a, b, c) {
  console.log(this, a, b, c);
};

func(1, 2, 3); // Window { ... } 1 2 3
func.call({ x: 1 }, 4, 5, 6); // {x: 1} 4 5 6
```

함수뿐만 아니라 메서드도 마찬가지로 call 메서드를 이용해 임의의 객체를 this로 지정할 수 있다.

```javascript
var obj = {
  a: 1,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};

obj.method(2, 3); // 1 2 3
obj.method.call({ a: 4 }, 5, 6); // 4 5 6
```



### apply 메서드

apply 메서드는 call 메서드와 기능이 동일하다. 다만 두 번째 인자를 배열로 받아서 그 배열의 요소들을 호출할 함수의 매개변수로 지정한다는 점에서 차이가 있다. 

```javascript
var func = function (a, b, c) {
  console.log(this, a, b, c);
};
func.apply({ x: 1 }, [4, 5, 6]); // {x: 1} 4 5 6

var obj = {
  a: 1,
  method: function (x, y) {
    console.log(this.a, x, y);
  },
};
obj.method.apply({ a: 4 }, [5, 6]); // 4 5 6
```

---

**[⬆ back to top](#table-of-contents)**



### call과 apply 메서드의 활용

`call`과 `apply` 메서드를 잘 활용하면 자바스크립트를 다채롭게 사용할 수 있다. 하지만 `call`과 `apply` 메서드는 명시적으로 별도의 `this`를 바인딩하면서 함수나 메서드를 실행하므로, 오히려 `this`를 예측하기 어렵게 만들어 코드 해석을 어렵게 한다는 단점이 있다. 그렇지만 ES5 이하의 환경에서는 마땅한 대안이 없으므로 실무에서 광범위하게 활용된다.

#### 유사배열객체에 배열 메서드를 적용

객체에는 배열 메서드를 직접 적용할 수 없지만 키가 `0` 또는 양의 정수인 프로퍼티가 존재하고, `length` 프로퍼티의 값이 `0` 또는 양의 정수인 객체, **즉 배열의 구조와 유사한 객체**의 경우 `call` 또는 `apply` 메서드를 이용해 배열 메서드를 차용할 수 있다.

```javascript
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};

Array.prototype.push.call(obj, 'd');
console.log(obj); // { '0': 'a', '1': 'b', '2': 'c', '3': 'd', length: 4 }

var arr = Array.prototype.slice.call(obj);
console.log(arr); // ['a', 'b', 'c', 'd']
```

- 위의 예제에서 배열 메서드인 push 를 객체 obj에 적용해 프로퍼티 3에 'd'를 추가했다. 
- 위의 예제에서 slice 메서드를 적용해 객체를 배열로 전환했다. slice 메서드는 원본 배열을 바꾸지 않고, 배열 요소를 추출하는 메서드인데, 매개변수를 아무것도 넘기지 않을 경우에는 원본 배열의 얕은 복사본을 반환한다. 예제에서 call 메서드를 이용해 원본인 **유사배열객체의 얕은 복사를 수행**했는데, slice 메서드가 배열 메서드이므로 복사본은 배열로 반환하게 된다. 

#### arguments, NodeList에 배열 메서드를 적용

함수 내부에서 접근할 수 있는 `arguments` 객체도 유사배열객체이므로 배열로 전환해서 사용할 수 있다. 그리고 이 방법으로 `querySelectorAll`, `getElementsByClassName` 등의 `Node` 선택자로 선택한 결과인 `NodeList`도 **배열로 전환해서 사용**할 수 있다.

```javascript
function a() {
  console.log('arguments: ', arguments); // arguments:  [Arguments] { '0': 1, '1': 2, '2': 3 }
  var argv = Array.prototype.slice.call(arguments);
  argv.forEach(function (arg) {
    console.log(arg);
  });
}
a(1, 2, 3); // 1 2 3

document.body.innerHTML = '<div>a</div><div>b</div><div>c</div>';
var nodeList = document.querySelectorAll('div');
var nodeArr = Array.prototype.slice.call(nodeList);
nodeArr.forEach(function (node) {
  console.log(node); // div>a</div> <div>b</div> <div>c</div>
});
```

#### 문자열에 배열 메서드 적용

유사배열객체에는 `call/apply` 메서드를 이용해 모든 배열 메서드를 적용할 수 있다. 배열처럼 인덱스와 `length` 프로퍼티를 지니는 문자열에 대해서도 마찬가지이다. 단 문자열의 경우 length 프로퍼티가 읽기 전용이므로 원본 문자열에 변경을 가하는 메서드(`push`, `pop`, `shift`, `unshift`, `splice`)는 에러를 던지며, `concat`처럼 대상이 반드시 배열이어야 하는 경우에는 에러는 나지 않지만 제대로된 결과를 얻을 수 없다. 

```javascript
var str = 'abc def';

Array.prototype.push.call(str, ' pushed string');
// TypeError: Cannot assign to read only property 'length' of object '[object String]'

Array.prototype.concat.call(str, 'string'); // [ [String: 'abc def'], 'string' ]

Array.prototype.every.call(str, function (char) {
  return char !== ' ';
}); // true

Array.prototype.some.call(str, function (char) {
  return char === ' ';
}); // true

var newArr = Array.prototype.map.call(str, function (char) {
  return char + '!';
});
console.log(newArr); // ['a!', 'b!','c!', ' !','d!', 'e!','f!']

var newStr = Array.prototype.reduce.apply(str, [
  function (string, char, i) {
    return string + char + i;
  },
]);
console.log(newStr); // ab1c2 3d4e5f6
```

위의 예제처럼 **call/apply 를 이용해 형변환하는 것은 'this를 원하는 값으로 지정해서 호출한다'는 본래의 메서드 의도와 동떨어진 활용법**이다. **경험을 통해 숨은 뜻을 알고 있는 사람이 아닌 이상 코드만 봐서는 어떤 의미인지 파악하기 쉽지 않다.**

#### Array.from

ES6에서는 유사배열객체 또는 순회 가능한 모든 종류의 데이터 타입을 **배열로 전환하는** `Array.from` 메서드를 도입했다. (위의 call/apply 예제처럼 본래의 의도와 동떨어진 사용법 보다 명확한 의미를 전달하기 위해)

```javascript
var obj = {
  0: 'a',
  1: 'b',
  2: 'c',
  length: 3,
};

var arr = Array.from(obj);
console.log(arr); // ['a', 'b', 'c']
```

#### 생성자 내부에서 다른 생성자를 호출

생성자 내부에서 다른 생성자와 공통된 내용이 있을 경우 `call` 또는 `apply`를 이용해 다른 생성자를 호출하면 간단하게 반복을 줄일 수 있다. 

```javascript
function Person(name, gender) {
  this.name = name;
  this.gender = gender;
}

function Student(name, gender, school) {
  Person.call(this, name, gender);
  this.school = school;
}

function Employee(name, gender, company) {
  Person.call(this, name, gender);
  this.company = company;
}

var hamburger = new Student('ham', 'male', 'burgerking');
var employee = new Employee('cheese', 'female', 'mcdonalds');
console.log(hamburger); // Student { name: 'ham', gender: 'male', school: 'burgerking' }
console.log(employee); // Employee { name: 'cheese', gender: 'female', company: 'mcdonalds' }
```

위의 예제에서 Student, Employee 생성자 함수는 내부에서 Person 생성자 함수를 호출해서 인스턴스의 속성을 정의한다.

#### 여러 인수들을 묶어 하나의 배열로 전달하고 싶을 때

여러 개의 인수를 받는 메서드에게 하나의 배열로 값을 전달하고 싶을 때 `apply` 메서드를 사용하면 좋다. 배열의 최대/최솟값을 구해야 할 경우 `apply`를 사용하지 않는다면 아래처럼 구현할 수 밖에 없다. 

```javascript
var nums = [2, 3, 4, 5, 1, 40, 90, 15];

var max = nums[0];
var min = nums[0];
nums.forEach(function (num) {
  if (num > max) {
    max = num;
  }
  if (num < min) {
    min = num;
  }
});

console.log('min:', min, 'max:', max);

function getMin(nums) {
  return nums.reduce((prev, cur) => (prev > cur ? prev : cur));
}
console.log(getMin(nums));
```

반면, `apply`를 사용한다면 코드의 가독성을 높이고 간결하게 작성할 수 있다. `Math.max` 메서드에 `apply`를 적용하면 훨씬 간결해진다. 

```javascript
var nums = [2, 3, 4, 5, 1, 40, 90, 15];

var min = Math.min.apply(null, nums);
var max = Math.max.apply(null, nums);
console.log(min);
console.log(max);
```

위의 코드를 **spread operator**(펼침 연산자)를 활용하면 `apply`를 이용하는 것 보다 간결하게 작성할 수 있다.

```javascript
var nums = [2, 3, 4, 5, 1, 40, 90, 15];

var min = Math.min(...nums);
var max = Math.max(...nums);
console.log('min:', min);
console.log('max:', max);
```

---

**[⬆ back to top](#table-of-contents)**



### bind 메서드

`bind`는` call`과 비슷하지만 즉시 호출하지 않고, **넘겨 받은 this 및 인수들을 바탕으로 새로운 함수를 반환하기만 하는 메서드**이다. 즉 `bind` 메서드는 **함수에 this를 미리 적용하는 것**과 **부분 적용 함수를 구현**하는 두 가지 목적을 지닌다. 

```javascript
var func = function (a, b, c, d) {
  console.log(this, a, b, c, d);
};

func(1, 2, 3, 4); // Window { ... } 1 2 3 4

var bindFunc1 = func.bind({ x: 1 }); // this만을 지정
bindFunc1(5, 6, 7, 8); // { x: 1 } 5 6 7 8

var bindFunc2 = func.bind({ x: 1 }, 4, 5); // this 지정과 함께 부분 적용 함수 구현
bindFunc2(6, 7); // { x: 1 } 4 5 6 7
bindFunc2(8, 9); // { x: 1 } 4 5 8 9
```

위의 예제에서 `bindFunc1`의 `bind`는 `this`만을 지정한 것이고, `bindFunc2`의 `bind`는 `this` 지정과 함께 부분 적용 함수를 구현한 것이다. 

#### name 프로퍼티

`bind` 메서드를 적용해 만든 함수는 동사 `bind`의 수동태인 'bound'라는 접두어 붙는다. 이를 통해 어떤 함수의 name 프로퍼티가 'bound xxx'라면, 이는 함수명이 xxx인 원본 함수에 `bind` 메서드를 적용한 새로운 함수라는 의미를 가지므로 기존의 `call/apply` 보다 코드를 추적하기에 더 수월하다.

```javascript
var func = function (a, b, c, d) {
  console.log(this, a, b, c, d);
};
var bindFunc = func.bind({ x: 1 }, 4, 5);
console.log(func.name); // func
console.log(bindFunc.name); // bound func

var calc = function (x, y) {
  console.log(this, x, y);
};
var bindCalc = calc.bind({ value: 45, x: 10 });
console.log('calc name: ', calc.name); // calc
console.log(bindCalc.name); // bound calc
```

#### 상위 컨텍스트의 this를 내부함수나 콜백 함수에 전달하기

메서드의 내부함수에서 메서드의 `this`를 바라보게 하기 위한 방법으로 `self` 등의 변수를 활용한 우회법 대신 `call`, `apply` 또는 `bind` 메서드를 활용할 수 있다.

```javascript
var obj = {
  outer: function () {
    console.log(this);
    var innerFunc = function () {
      console.log(this);
    };
    innerFunc.call(this);
  },
};
obj.outer();
```

```javascript
// bind 메서드를 활용한 방법
var obj = {
  outer: function () {
    console.log(this); // {outer: ƒ}
    var innerFunc = function () {
      console.log(this);
    }.bind(this);
    innerFunc(); // {outer: ƒ}
  },
};
obj.outer();
```

기본적으로 콜백 함수 내에서의 `this`에 관여하는 함수 또는 메서드에 대해서도 `bind` 메서드를 이용하면 `this`값을 사용자의 입맛에 맞게 바꿀 수 있다.z

```javascript
var obj = {
  logThis: function () {
    console.log(this);
  },
  logThisLater1: function () {
    setTimeout(this.logThis, 500);
  },
  logThisLater2: function () {
    setTimeout(this.logThis.bind(this), 1000);
  },
};

obj.logThisLater1(); // Window { ... }
obj.logThisLater2(); // {logThis: ƒ, logThisLater1: ƒ, logThisLater2: ƒ}
```

### 화살표 함수 예외 사항

화살표 함수를 사용하면 별도의 변수로 this를 우회하거나 `call`, `apply` 또는 `bind` 메서드를 적용할 필요가 없어서 간결하게 코드를 작성할 수 있다.

```javascript
var obj = {
  outer: function () {
    console.log(this); // { outer: f }
    var innerFunc = () => {
      console.log(this);
    };
    innerFunc(); // { outer: f }
  },
};

obj.outer();
```

---

**[⬆ back to top](#table-of-contents)**



### 별도의 인자로 this를 받는 경우(콜백 함수 내에서의 this)

콜백 함수를 인자로 받는 메서드 중 일부는 추가로 this로 지정할 객체(thisArg)를 인자로 지정할 수 있는 경우가 있다. 이러한 메서드의 thisArg 값을 지정해 콜백 함수 내부에서 this값을 원하는 대로 변경할 수 있다. 

```javascript
var report = {
  sum: 0,
  count: 0,
  add: function () {
    var args = Array.prototype.slice.call(arguments);
    args.forEach(function (entry) {
      this.sum += entry;
      ++this.count;
    }, this);
  },
  average: function () {
    return this.sum / this.count;
  },
};

report.add(60, 85, 95);
console.log(report.sum, report.count, report.average()); // 240 3 80
```

#### 콜백 함수와 함께 thisArg를 인자로 받는 메서드

위의 예제는 forEach를 활용했지만, 이 밖에도 thisArg를 인자로 받는 메서드는 많이 있다.

```javascript
Array.prototype.forEach(callback[, thisArg])
Array.prototype.map(callback[, thisArg])
Array.prototype.filter(callback[, thisArg])
Array.prototype.some(callback[, thisArg])
Array.prototype.every(callback[, thisArg])
Array.prototype.find(callback[, thisArg])
Array.prototype.findIndex(callback[, thisArg])
Array.prototype.flatMap(callback[, thisArg])
Array.prototype.from(callback[, thisArg])
Set.prototype.forEach(callback[, thisArg])
Map.prototype.forEach(callback[, thisArg])
```

---

**[⬆ back to top](#table-of-contents)**





