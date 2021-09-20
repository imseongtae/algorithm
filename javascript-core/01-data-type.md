# Data Type
자바스크립트가 데이터를 처리하는 과정을 살펴보면 기본형과 참조형이 서로 다르게 동작하는 이유를 이해할 수 있다.

## table of contents
1. [데이터 타입의 종류](#1.-데이터-타입의-종류)
1. [데이터 타입을 이해하기 위한 배경지식](#2.-데이터-타입을-이해하기-위한-배경지식)
1. [변수 선언과 데이터 할당](#3.-변수-선언과-데이터-할당)
1. [기본형 데이터와 참조형 데이터](#4.-기본형-데이터와-참조형-데이터)
1. [불변 객체](#5.-불변-객체)
1. [undefined와 null](#6.-undefined와-null)



## 1. 데이터 타입의 종류

### 기본형과 참조형을 구분하는 기준
기본형은 **값이 담긴 주소값을 바로 복제**하는 반면 참조형은 **값이 담긴 주솟값들로 이루어진 묶음을 가리키는 주솟값을 복제**한다는 점이 다름


## 2. 데이터 타입을 이해하기 위한 배경지식

### 메모리와 데이터
컴퓨터는 모든 데이터를 0 또는 1로 바꿔 기억하며, 이를 표현할 수 있는 하나의 메모리 조각을 비트(bit)라고 함. 메모리는 매우 많은 비트들로 구성되어 있는데, 각 비트는 **고유한 식별자(unique identifier)**를 통해 위치를 확인할 수 있음

#### 바이트의 기원
매우 많은 비트를 한 단위로 묶으면 검색 시간은 줄이고, 표현할 수 있는 데이터의 개수도 늘어나겠지만 동시에 낭비되는 비트가 생김. 사용하지 않을 데이터를 위해 빈공간을 남겨놓기보다 크게 문제가 되지 않을 적정한 공간을 묶는 편이 효율적인 까닭에 8개의 비트로 구성되어 있는 바이트(byte)라는 단위가 생김

#### 자바스크립트의 숫자
자바스크립트는 메모리 관리에 대한 압박에서 상대적으로 자유로움. 이 때문에 **숫자의 경우 정수형인지 부동소수형인지를 구분하지 않고 64비트, 즉 8바이트**를 확보함

#### 메모리 주솟값
각 비트는 고유한 식별자를 지님. **바이트 역시 마찬가지로 시작하는 비트의 식별자**로 위치를 파악할 수 있음. 모든 데이터는 바이트 단위의 식별자, 즉 **메모리 주솟값**을 통해 서로 구분하고 연결할 수 있음

### 식별자와 변수
변수는 **변할 수 있는 수**를 의미. 수학 용어를 차용한 까닭에 수가 붙었을 뿐, 값이 숫자여야 하는 것음 아님. 변수는 **변할 수 있는 데이터**를 의미  
식별자는 어떤 데이터를 식별하는데 사용하는 이름, 즉 **변수명**을 의미함  

**[⬆ back to top](#table-of-contents)**

## 3. 변수 선언과 데이터 할당

### 변수 선언 동작 원리
변수란 결국 **변경 가능한 데이터가 담길 수 있는 공간 또는 그릇**을 의미

```js
// 1. 변할 수 있는 데이터를 만든다. 
// 2. 이 데이터의 식별자는 a로 한다.
var a;
```

### 데이터 할당 동작 원리
변수 선언과 데이터 할당을 한 문장으로 나누든 두 문장으로 나누든 자바스크립트 엔진은 같은 동작을 수행함.

```js
var a; // 변수 a 선언
a = 'abc' // 변수 a에 데이터 할당
 
var a = 'abcdef' // 변수 선언과 할당을 한 문장으로 표현
```

1. 변수 영역에서 빈 공간(@1003)을 확보한다.
1. 확보한 공간의 식별자를 a로 지정한다.
1. 데이터 영역의 빈 공간(@5004)에 문자열 'abc'를 저장한다.
1. 변수 영역에서 a라는 식별자를 검색한다(@1003).
1. 앞서 저장한 문자열의 주소를 @1003 공간에 대입한다.

**[⬆ back to top](#table-of-contents)**

## 4. 기본형 데이터와 참조형 데이터

### 불변값
변수와 상수를 구분하는 성질은 '변경 가능성'이다. 바꿀 수 있으면 변수, 바꿀 수 없으면 상수이다. 한 번 데이터 할당이 이루어진 변수 공간에 다른 데이터를 재할당할 수 있는지가 관건이다.(흔히 불변값과 상수를 같은 개념으로 오해하기 쉬운데, 이 둘을 명확히 구분할 필요가 있다)

변수와 상수를 구분 짓는 변경 가능성의 대상은 변수 영역 메모리이지만 불변성 여부를 구분할 때의 변경 가능성의 대상은 데이터 영역 메모리이다.

```javascript
var a = 'abc';
// 'abc' 이후 'def'를 다시 추갓해 할당하면 값이 'abcdef'로 바뀌는 것이 아니라 새로운 문자열 'abcdef'를 만들어서 그 주소를 변수 a에 저장
a = a + 'def';

var b = 5;
var c = 5; // 컴퓨터는 데이터 영역에서 이미 만들어놓은 값이 있으니 재활용

// 기존에 저장된 5자체를 7로 바꾸는 것이 아니라 기존에 저장했던 7을 찾아서 있으면 재활용, 없으면 새로 만들어서 저장
b = 7; 
```

***결론**

문자열 값도 한 번 만든 것을 바꿀 수 없고, 숫자 값도 다른 값으로 변경할 수 없다. 변경은 새로 만드는 동작을 통해서만 이루어지는 것이 불변값의 성질이다. 한 번 만들어진 값은 가비지 컬렉팅을 당하지 않은 한 영원히 변하지 않는다.

### 참조형 데이터를 변수에 할당하는 과정
참조형 데이터가 기본형 데이터와 갖는 차이는 **객체의 변수(프로퍼티) 영역**이 별도로 존재한다는 점이다. 객체가 별도로 할애한 영역은 변수 영역일 뿐 '데이터 영역'은 기존의 메모리 공간을 그대로 활용하고 있다. (**데이터 영역에 저장된 값은 모두 불변값**)


```js
var obj = {
  a: 1,
  b: 'bbb'
};
obj.a = 2; // 5번째, obj의 a 프로퍼티에 2를 할당
```

obj의 a 프로퍼티에 할당하는 명령 전과 후에 변수 obj가 바라보고 있는 주소는 변하지 않는다. 즉 '새로운 객체'가 만들어진 것이 아니라 기존 객체 내부의 값만 바뀐 것이다.

<img src="https://user-images.githubusercontent.com/60806840/133733827-af088f33-73c0-4d83-b093-17ffa8664f85.png" />




### 중첩된 참조형 데이터(객체)의 프로퍼티 할당
> 중첩된 참조형 데이터 할당에 대한 과정 설명할 수 있을 정도로 숙지하기

```js
var obj = {
  x: 3,
  arr: [3, 4, 5]
}
```

### 변수 복사 비교
> 중첩된 참조형 데이터의 할당 및 값 변경에 대한 과정 설명할 수 있을 정도로 숙지하기

```js
var a = 10;
var b = a;

var obj = { c: 10, d: 'ddd' };
var copiedObj = obj;

b = 20;
copiedObj.c = 20;
```

기본형 데이터를 복사한 변수 `b`의 값을 바꿨더니 메모리 주솟값이 바뀌는 반면, 참조형 데이터를 복사한 변수 `copiedObj`의 프로퍼티(`c`)의 값을 바꾸었더니 메모리 주솟값은 달라지지 않음. 즉, `a`와 `b`는 서로 다른 주소를 바라보게 되었으나, 변수 `obj`와 `copiedObj`는 여전히 같은 객체를 바라보는 상태이며, 아래처럼 표현할 수 있다.

```js
a !== b
obj === copiedObj
```

'기본형은 값을 복사하고, 참조형은 주솟값을 복사한다.'고 하지만 사실은 어떤 데이터 타입이든 변수에 할당하기 위해서는 주솟값을 복사해야 하므로 자바스크립트의 모든 데이터 타입은 참조형일 수밖에 없다. 다만 기본형은 주솟값을 복사하는 과정이 한 번만 이뤄지고, 참조형은 한 단계를 더 거치게 된다는 차이가 있다.

**[⬆ back to top](#table-of-contents)**



## 5. 불변 객체

### 어떤 상황에서 불변 객체가 필요할까?

값으로 전달 받은 객체에 변경을 가하더라도 원본 객체는 변하지 않아야 하는 경우가 종종 발생하는데, 이때 불변 객체가 필요함. 만약 사용자 정보가 바뀐 시점에 알람을 보내야 한다거나, 바뀌기 전의 정보와 바뀐 후의 정보 차이를 가시적으로 보여줘야 하는 기능을 구현하려면 **불변 객체**가 필요하다.

아래는 객체의 가변성에 따른 문제를 나타내는 예시

```javascript
var user = {
  name: 'Jaenam',
  gender: 'male',
};

var changeName = function (user, newName) {
  var newUser = user;
  newUser.name = newName;
  return newUser;
};

var user2 = changeName(user, 'Jung');

if (user !== user2) {
  console.log('유저 정보가 변경되었습니다.');
}

// 출력
// 사용자 정보가 바뀐 시점에 알람을 보내야 하는 기능 등을 구현할 때 어려움이 따름
console.log(user.name, user2.name); // Jung Jung
console.log(user === user2); // true
```



`copyObject`는 기존 정보를 **복사(얕은 복사)**해서 새로운 객체를 반환하는 함수이다. 몇 가지 아쉬운 점이 있지만 협업하는 개발자들이 `user` 객체 내부의 변경이 필요할 때 `copyObject` 함수를 사용하기로 합의하고 규칙을 지킨다는 전제하에서는 `user` 객체가 불변 객체가 될 수 있다.

```javascript
var user = {
  name: 'Jaenam',
  gender: 'male',
};

var copyObject = function (target) {
  var result = {};
  for (const prop in target) {
    result[prop] = target[prop];
  }
  return result;
};

var user2 = copyObject(user);
user2.name = 'Jung';

if (user !== user2) {
  console.log('유저 정보가 변경되었습니다.');
}

// 출력
// 유저 정보가 변경되었습니다.
console.log(user.name, user2.name); // Jaenam Jung
console.log(user === user2); // false
```

> 그렇지만 모두가 copyObject를 사용하도록 하는  규칙을 지키는 것은 어려운 일이므로 규칙을 따르지 않고 프로퍼티를 변경할 수 없게끔 시스템적으로 제약을 거는 편이 안전한데, 이런 맥락을 지키도록 돕는데 사용되는 immutable.js, baobab.js 등의 라이브러리가 있다.



### 얕은 복사와 깊은 복사

**얕은 복사(shallow copy)**: 바로 아래 단계의 값만 복사하는 방법. 이 말은 중첩된 객체에서 참조형 데이터가 저장된 프로퍼티를 복사할 때 그 주솟값만 복사한다는 의미이며, 이렇게 되면 해당 프로퍼티에 대해 원본과 사본이 모두 동일한 참조형 데이터의 주소를 가리키게 됨(사본을 바꾸면 원본이 바뀜...)

**깊은 복사(deep copy)**: 내부의 모든 값들을 하나하나 찾아서 전부 복사하는 방법



아래 코드는 참조형 데이터에 대해 다시 그 내부의 프로퍼티들을 복사하는 경우를 표현

```javascript
var user = {
  name: 'imseongtae',
  urls: {
    portfolio:
      'https://github.com/imseongtae/js-algorithm/blob/main/javascript-core/01-data-type.md',
    github: 'https://github.com/imseongtae',
  },
};

var copyObject = function (target) {
  var result = {};
  for (const prop in target) {
    result[prop] = target[prop];
  }
  return result;
};

if (user !== user2) {
  console.log('유저 정보가 변경되었습니다.');
}

var user2 = copyObject(user);
user2.name = 'hamburger';
console.log('user.name === user2.name:', user.name === user2.name);

user.urls.portfolio = 'https://portfolio.com';
console.log(
  'user.urls.portfolio === user2.urls.portfolio:',
  user.urls.portfolio === user2.urls.portfolio,
);

user.urls.github = 'https://github.com/splin';
console.log(
  'user.urls.github === user2.urls.github:',
  user.urls.github === user2.urls.github,
);
```



객체의 깊은 복사를 수행하는 범용함수를 활용하여 깊은 복사를 수행하는 코드

```javascript
var user = {
  name: 'imseongtae',
  urls: {
    portfolio:
      'https://github.com/imseongtae/js-algorithm/blob/main/javascript-core/01-data-type.md',
    github: 'https://github.com/imseongtae',
  },
};

// 객체의 깊은 복사를 수행하는 범용함수
var copyObjectDeep = function (target) {
  var result = {};
  if (typeof target === 'object' && target !== null) {
    for (const prop in target) {
      result[prop] = copyObjectDeep(target[prop]);
    }
  } else {
    result = target;
  }
  return result;
};

if (user !== user2) {
  console.log('유저 정보가 변경되었습니다.');
}

var user2 = copyObjectDeep(user);

user2.name = 'hamburger';
console.log('user.name === user2.name:', user.name === user2.name);

user.urls.portfolio = 'https://portfolio.com';
console.log(
  'user.urls.portfolio === user2.urls.portfolio:',
  user.urls.portfolio === user2.urls.portfolio,
);

user.urls.github = 'https://github.com/splin';
console.log(
  'user.urls.github === user2.urls.github:',
  user.urls.github === user2.urls.github,
);
```



### JSON 을 활용한 간단한 깊은 복사

객체를 JSON 문자열로 전환했다가 다시 JSON 객체로 바꾸는 것을 통해 간단하게 깊은 복사를 처리할 수 있다. 다만 이 메서드(함수)나 숨겨진 프로퍼티인 `__proto__` 나 `getter/setter` 등과 같이 JSON으로 변경할 수 없는 프로퍼티들은 모두 무시한다. **httpRequest로 받은 데이터나 저장한 객체를 복사할 때 등 순수한 정보만 다룰 때 활용하기 좋은 방법이다.**

```javascript
var copyObjectViaJSON = function (target) {
  return JSON.parse(JSON.stringify(target));
};

var obj = {
  a: 1,
  b: {
    c: null,
    d: [1, 2],
    func1: function () {
      console.log(3);
    },
    func2: function () {
      console.log(4);
    },
  },
};

var obj2 = copyObjectViaJSON(obj);

obj2.a = 3;
obj2.b.c = 4;
obj2.b.d[1] = 3;

console.log(obj);
console.log(obj2); // { a: 3, b: { c: 4, d: [ 1, 3 ] } 메서드는 무시됨
```



## 6. undefined와 null

자바스크립트에는 '없음'을 나타내는 값이 두 가지 있다.

`undefined`: 어떤 변수에 값이 존재하는 않을 경우

`null`: 사용자가 명시적으로 없음을 표현하기 위해 대입한 값

### undefined

자바스크립트 엔진은 사용자가 응당 어떤 값을 지정할 것이라고 예상되는 상황임에도 실제로는 그렇게 하지 않았을 때 undefined를 반환한다. 

1. 값을 대입하지 않은 변수, 즉 데이터 영역의 **메모리 주소를 지정하지 않은 식별자**에 접근할 때
2. 객체 내부에 **존재하지 않는 프로퍼티**에 접근하려고 할 때
3. return 문이 없거나 호출되지 않은 함수의 실행 결과

```javascript
var a;
console.log('a:', a); // undefined 값을 대입하지 않은 변수에 접근

var obj = { a: 1 };
console.log('obj.a:', obj.a);
console.log('obj.b:', obj.b); // 존재하지 않는 프로퍼티에 접근
console.log(b); // c.f) ReferenceError: b is not defined

var func = function () {};
var c = func(); // 반환(return)이 없으면 undefined를 반환한 것으로 간주
console.log('func():', c);

// a: undefined
// obj.a: 1
// obj.b: undefined
// func(): undefined
```



### 값을 대입하지 않은 배열의 경우

값을 대입하지 않은 배열의 경우에는 `[ <empty items> ]` 이 출력되는데, 이는 빈 요소는 확보했지만 확보한 각 요소에 어떠한 값도, 심지어 `undefined` 조차도 할당되지 않음을 나타낸다.

```javascript
var arr1 = [];
arr1.length = 3;
console.log(arr1); // [ <3 empty items> ]

var arr2 = new Array(3);
console.log(arr2); // [ <3 empty items> ]

var arr3 = [undefined, undefined, undefined];
console.log(arr3); // [ undefined, undefined, undefined ]
```



### empty 요소와 undefined의 차이 

빈(empty item) 요소와 undefined는 출력 결과에서 차이가 있는데, 빈 요소는 순회와 관련된 배열 메서드들의 순회 대상에서 제외된다.

```javascript
var arr1 = [undefined, 1];
var arr2 = [];
arr2[1] = 1;
console.log('arr1:', arr1);
console.log('arr2:', arr2);
console.log('----------divider----------');

arr1.forEach((v, i) => console.log(v, i)); // undefined 0, 1 1
arr2.forEach((v, i) => console.log(v, i)); // 1 1

console.log('map:', arr1.map((v, i) => v + i)); // map: [ NaN, 2 ]
console.log('map:', arr2.map((v, i) => v + i)); // map: [ <1 empty item>, 2 ]

console.log('filter:', arr1.filter(v => !v)); // filter: [ undefined ]
console.log('filter:', arr2.filter(v => !v)); // filter: []

// reduce의 세 번째 인자는 초기값
console.log('reduce:', arr1.reduce((p, c, i) => p + c + i, '')); // reduce: undefined011
console.log('reduce:', arr2.reduce((p, c, i) => p + c + i, '')); // reduce: 11
```

배열도 객체임을 생각해보면 이는 지극히 자연스러운 현상이다. 존재하지 않은 프로퍼티에 대해 순회할 수 없는 것은 당연한 일이다. 

배열은 객체와 마찬가지로 특정 인덱스에 값을 지정할 때 비로소 빈 공간을 확보하고 인덱스를 이름으로 지정한 후 데이터의 주솟값을 저장하는 등의 동작을 수행한다. 즉, 값이 지정되지 않은 인덱스는 '아직 존재하지 않는 프로퍼티'에 지나지 않는 것이다.



### null

'비어있음'을 나타내고 싶을 때 `undefined`가 아닌 `null`을 쓰면 된다. 이를 통해 `undefined`는 값을 대입하지 않은 변수에 접근하고자 할 때 자바스크립트 엔진이 반환해주는 값으로서만 존재할 수 있게 된다.

null은 주의할 점이 있는데 typeof null 이 object라는 점이다. 이는 자바스크립트의 버그이며, 어떤 변수 값 null 여부를 판단하기 위해셔는 일치 연산자를 써야만 정확하게 판단할 수 있다.

```javascript
var n = null;
console.log('type of null:', typeof n); // type of null: object

// equality operator
console.log(n == undefined); // true
console.log(n == null); // true

// identify operator
console.log(n === undefined); // false
console.log(n === null); // true
```



**[⬆ back to top](#table-of-contents)**



