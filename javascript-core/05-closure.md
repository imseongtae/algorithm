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

#### 이벤트 리스너에 관한 예시

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


---

**[⬆ back to top](#table-of-contents)**