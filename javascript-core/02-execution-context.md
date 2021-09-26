# Excution Context
실행 컨텍스트(execution context)는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체인데, 자바스크립트는 어떤 실행 컨텍스트가 활성화되는 시점에 변수를 위로 끌어올리고, 외부 환경 정보를 구성하고, this 값을 설정하는 등의 동작을 수행한다. 실행 컨텍스트는 동적 언어로서의 자바스크립트 특성이 잘 드러나는 개념이며, 다른 언어에서는 발견할 수 없는 특이한 현상이 발생한다.

## table of contents
1. [실행 컨텍스트란](#1.-실행-컨텍스트란)
2. [VariableEnvironment](#2.-VariableEnvironment)
3. [LexicalEnvironment](#3.-LexicalEnvironment)




## 1. 실행 컨텍스트란
실행 컨텍스트는 실행할 코드에 제공할 환경 정보들을 모아놓은 객체라고 정의할 수 있다. 

### Stack
**스택은 출입구가 하나뿐인 우물** 같은 데이터 구조이다. 스택에 데이터 a, b, c, d를 저장했다면, 꺼낼 때는 d, c, b, a의 순서대로 꺼낼 수밖에 없다. 데이터를 100개만 저장할 수 있는 우물에 100개 이상의 데이터를 넣으려고 할 경우 넘칠 수밖에 없는데 많은 프로그래밍 언어들은 이 경우 에러를 반환한다.

### Queue
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



## 2. VariableEnvironment

VariableEnvironment에 담기는 내용은 LexicalEnvironment 와 같지만 최초 실행 시의 스내샷을 유지한다는 점이 다르다. 실행 컨텍스트를 생성할 때 VariableEnvironment에 정보를 먼저 담고서, 이를 그대로 복사해 LexicalEnvironment 를 만들고, 이후 주로 LexicalEnvironment를 활용한다. 



## 3. LexicalEnvironment

비유적으로 컨텍스트를 구성하는 환경 정보들을 모아놓은 것으로 여길 수 있다. 

### Hoisting

Hoisting은 변수 정보를 수집하는 과정을 이해하기 쉬운 방법으로 대체한 가상의 개념이다.

environmentRecord에는 매개변수의 이름, 함수 선언, 변수명 등이 담기는데, environmentRecord는 현재 실행될 컨텍스트의 대상 코드 내에 어떤 식별자들이 있는지만 신경 쓴다. 때문에 변수를 호이스팅할 때 변수명만 끌어올리고 할당 과정은 원래 자리에 그대로 남겨둔다. 매개변수의 경우도 마찬가지이다. 

#### 첫 번째 예제

매개변수와 변수에 대해 알아보기 위한 예제

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



