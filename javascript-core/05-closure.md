# Closure
클로저(Closure)는 여러 함수형 프로그래밍 언어에서 등장하는 보편적인 특성이다. 자바스크립트의 고유 개념이 아닌 까닭에 ECMAScript의 명세에서도 클로저의 정의를 다루지 않으며 클로저를 설명하는 문장도 어려운 경우가 많다.

클로저는 **함수 내부에서 선언된 변수를 참조하는 내부 함수를 외부로 전달할 때, 내부 함수가 참조하는 변수가 GC 되지 않는 것**이라고 설명할 수 있다.

## table of contents
1. [클로저의 의미 및 원리 이해](#클로저의-의미-및-원리-이해)


## 클로저의 의미 및 원리 이해
MDN(Mozilla Developer Network)에서는 클로저에 대해 "A closure is the combination of a function and the lexical environment within which that function was declared" 라고 소개한다. 직역하면, "클로저는 함수와 그 함수가 선언될 당시의 lexical environment의 상호관계에 따른 현상" 정도가 된다. 

### 외부 함수의 변수를 참조하는 내부 함수

```javascript
var outer = function () {
  var a = 1;
  var inner = function () {
    console.log(++a);
  };
  inner();
};

outer();
```

