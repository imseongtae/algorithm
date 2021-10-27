# Closure
클로저(Closure)는 여러 함수형 프로그래밍 언어에서 등장하는 보편적인 특성이다. 자바스크립트의 고유 개념이 아닌 까닭에 ECMAScript의 명세에서도 클로저의 정의를 다루지 않으며 클로저를 설명하는 문장도 어려운 경우가 많다.

클로저는 **함수 내부에서 선언된 변수를 참조하는 내부 함수를 외부로 전달할 때, 내부 함수가 참조하는 변수가 GC 되지 않는 것**이라고 설명할 수 있다.

## table of contents
1. [클로저의 의미 및 원리 이해](#클로저의-의미-및-원리-이해)
1. [클로저와 메모리 관리](#클로저와-메모리-관리)
1. [클로저 활용 사례](#클로저-활용-사례)


## 클로저의 의미 및 원리 이해
MDN(Mozilla Developer Network)에서는 클로저에 대해 "A closure is the combination of a function and the lexical environment within which that function was declared" 라고 소개한다. 직역하면, "클로저는 함수와 그 함수가 선언될 당시의 lexical environment의 상호관계에 따른 현상" 정도가 된다. 

'선언될 당시의 lexical environment'는 실행 컨텍스트의 구성 요소 중 하나인 outerEnvironmentReference에 해당한다. LexicalEnvironment의 environmentRecord와 outerEnvironmentReference에 의해 변수의 유효범위인 스코프가 결정되고 스코프 체인이 가능해진다. 이 때문에 내부함수의 실행 컨텍스트가 활성화되는 시점에 outerEnvironmentReference가 참조하는 외부함수의 LexicalEnvironment(선언한 변수)에 접근이 가능해진다.

### 외부 함수의 변수를 참조하는 내부 함수 예제

#### 별도로 inner 함수를 호출할 수 없는 경우

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    // inner에서는 a가 없으므로 outer의 LexicalEnvironment으로 접근
    console.log(++a);
  };
  inner();
  // outer의 실행 컨텍스트가 종료되면 LexicalEnvironment에 대한 식별자 참조를 지움
};

outer(); // 2
```

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner();
  // outer 함수의 실행 컨텍스트가 종료된 이후 a변수를 참조하는 대상이 없어짐
};

var closure = outer();
console.log(closure);
```

#### outer의 실행 컨텍스트가 종료된 이후에도 inner가 호출 가능한 경우
`inner` 함수의 실행 시점에 `outer` 함수의 실행이 종료된 상태일지라도, 가비지 컬렉터의 동작 방식으로 인해 `outer` 함수의 LexicalEnvironment에 접근할 수 있다. 가비지 컬렉터는 어떤 값을 참조하는 변수가 하나라도 있다면 그 값은 수집 대상에 포함시키지 않는다. 

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  // inner 함수 반환
  return inner;
};

// closure 변수는 outer의 실행 결과를 참조
var closure = outer();
console.log(closure()); // 2
console.log(closure()); // 3
```

위의 예제에서 외부함수인 `outer`의 실행이 종료되더라도 내부함수인 `inner`는 언젠가 `closure`를 실행함으로써 호출될 가능성이 열리게 된다. 언젠가 `inner` 함수의 실행 컨텍스트가 활성화되면 outerEnvironmentReference가 `outer` 함수의 LexicalEnvironment를 필요하게 되므로 GC의 수집 대상에서 제외된다. 이러한 까닭에 `inner` 함수가 내부 변수에 접근할 수 있게 된다.


#### return이 없이 클로저가 발생하는 경우
아래의 두 예제는 `return` 없이도 지역변수를 참조하는 내부함수를 외부로 전달하는 경우이다. 

```javascript
// window의 메서드에 전달할 콜백함수 내부에서 지역변수를 참조
(function () {
  var a = 0;
  var intervalId = null;
  var inner = function () {
    if (++a >= 10) {
      clearInterval(intervalId);
    }
    console.log(a);
  };
  intervalId = setInterval(inner, 250);
})();
```

```javascript
// 별도의 외부 객체인 DOM의 메서드에 등록할 handler 함수 내부에서 지역 변수 참조
(function () {
  var count = 0;
  var $button = document.createElement('button');
  $button.innerText = 'click';
  $button.addEventListener('click', function () {
    console.log(++count, 'times clicked');
  });
  document.body.appendChild($button);
})();
```

---

**[⬆ back to top](#table-of-contents)**


## 클로저와 메모리 관리
클로저는 객체지향과 함수형 모두를 아우르는 매우 중요한 개념이지만 메모리 누수의 위험을 이유로 클로저 사용을 지양해야 한다고 주장하는 사람들도 있다. 메모리 소모는 클로저의 본질적인 특성일 뿐이며, 개발자가 의도적으로 참조 카운트가 0이 되지 않도록 설계한 경우는 누수가 아니다.

### 클로저의 메모리 관리 예제
클로저의 관리 방법은 간단하다. 클로저는 어떤 필요에 의해 함수의 지역변수가 의도적으로 메모리 소모를 일으키면서 발생하는데, 필요성이 사라진 시점에 더 이상 메모리를 소모하지 않도록 참조 카운트를 0으로 만들어 GC가 수거하도록 관리하면 된다. 참조 카운트를 0으로 만들기 위해선 식별자에 참조형이 아닌 기본형 데이터(`null`)를 할당하면 된다. 

#### return에 의한 클로저의 메모리 해제

```javascript
var outer = (function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
})();

console.log(outer());
console.log(outer());
outer = null; // outer 식별자의 inner 함수 참조를 끊음
```

#### setInterval에 의한 클로저의 메모리 해제

```javascript
(function () {
  var a = 0;
  var intervalId = null;
  var inner = function () {
    if (++a >= 10) {
      clearInterval(intervalId);
      inner = null; // inner 식별자의 함수 참조를 끊음
    }
    console.log(a);
  };
  intervalId = setInterval(inner, 250);
})();
```

#### eventListener에 의한 클로저의 메모리 해제

```javascript
(function () {
  var count = 0;
  var $button = document.createElement('button');
  $button.innerText = 'click';

  var clickHandler = function () {
    console.log(++count, 'times clicked');
    if (count >= 10) {
      $button.removeEventListener('click', clickHandler);
      clickHandler = null; // clickHandler 식별자의 참조 함수를 끊음
    }
  };

  $button.addEventListener('click', clickHandler);
  document.body.appendChild($button);
})();
```

---

**[⬆ back to top](#table-of-contents)**


## 클로저 활용 사례

### 콜백 함수 내부에서 외부 데이터를 사용하고자 할 때

#### 콜백 함수를 내부함수로 선언해서 외부변수를 참조하는 예시

```javascript
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

fruits.forEach(function (fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', function () {
    alert('your choice is ' + fruit);
  });
  $ul.appendChild($li);
});

document.body.appendChild($ul);
```

#### bind 활용 예시
`alertFruit` 함수의 활용이 콜백 함수에 국한되지 않는다면 반복을 줄이기 위해 `alertFruit` 함수를 외부로 분리해야 하는 경우가 생길 수도 있다. 이 경우에는 bind 메서드나 고차함수를 활용할 수 있다.

```javascript
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

var alertFruit = function (fruit) {
  alert('your choice is ' + fruit);
};

fruits.forEach(function (fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', alertFruit.bind(null, fruit));
  $ul.appendChild($li);
});

document.body.appendChild($ul);
```

#### 콜백 함수 대신 고차함수를 활용한 클로저 활용 예시

```javascript
var fruits = ['apple', 'banana', 'peach'];
var $ul = document.createElement('ul');

var alertFruitBuilder = function (fruit) {
  return function () {
    alert('your choice is ' + fruit);
  };
};

fruits.forEach(function (fruit) {
  var $li = document.createElement('li');
  $li.innerText = fruit;
  $li.addEventListener('click', alertFruitBuilder(fruit));
  $ul.appendChild($li);
});

document.body.appendChild($ul);
```

### 접근 권한 제어(정보 은닉)
정보 은닉은 어떤 모듈의 내부 로직에 대해 외부로의 노출을 최소화해서 모듈간의 결합도를 낮추고 유연성을 높이고자 하는 현대 프로그래밍 언어의 중요한 개념 중 하나이다. 흔히 접근 권한에는 public(외부에서 접근 가능), private(내부에서만 사용), protected까지 세 종류가 있다. 

자바스크립트는 변수에 접근 권한을 부여하도록 설계되어 있지 않지만 클로저를 이용함녀 함수 차원에서 public한 값과 private한 값을 구분할 수 있다.

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    return ++a;
  };
  return inner;
};

var closure = outer();
console.log(closure());
console.log(closure());
```

### 클로저 변수를 보호하는 예제

```javascript
var car = {
  fuel: Math.ceil(Math.random() * 10 + 10), // 연료(L)
  power: Math.ceil(Math.random() * 3 + 2), // 연비(km / L)
  moved: 0, // 총 이동거리
  run: function () {
    var km = Math.ceil(Math.random() * 6);
    var wasteFuel = km / this.power;
    if (this.fuel < wasteFuel) {
      console.log('이동불가');
      return;
    }
    this.fuel -= wasteFuel;
    this.moved += km;
    console.log(km + 'km 이동 (총 ' + this.moved + 'km)');
  },
};

car.run();
```

위의 코드는 아래처럼 무작위로 정해지는 연료, 연비, 이동거리 등을 마음대로 바꿀 수 있다. 이러한 코드는 클로저를 활용해 객체가 아닌 함수로 만들고, 필요한 멤버만을 return하도록 바꿈으로써 값을 바꾸지 못하도록 방어할 수 있다.

```javascript
car.fuel = 1000;
car.power = 100;
car.moved = 1000;
```

#### 클로저로 변수를 보호하도록 바꾼 예제
아래 예제는 `createCar` 함수를 실행하면 객체가 생성된다. `fuel`, `power` 변수는 비공개 멤버로 지정해 외부에서 접근을 제한했고, `moved` 변수는 `getter` 속성을 부여하여 읽기 전용 속성으로 설정했다. 이제 외부에서는 오직 `run` 메서드를 실행하는 것과 현재의 `moved` 값을 확인하는 두 가지 동작만 할 수 있다.

```javascript
var createCar = function () {
  var fuel = Math.ceil(Math.random() * 10 + 10); // 연료(L)
  var power = Math.ceil(Math.random() * 3 + 2); // 연비(km / L)
  var moved = 0; // 총 이동거리
  return {
    get moved() {
      return moved;
    },
    run: function () {
      var km = Math.ceil(Math.random() * 6);
      var wasteFuel = km / power;
      if (fuel < wasteFuel) {
        console.log('이동불가');
        return;
      }
      fuel -= wasteFuel;
      moved += km;
      console.log(km + 'km 이동 (총 ' + moved + 'km)');
    },
  };
};

var car = createCar();
car.run();
```


---

**[⬆ back to top](#table-of-contents)**