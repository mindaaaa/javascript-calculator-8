# 함수형 문자열 계산기

OOP 버전의 문자열 계산기를 **함수형 프로그래밍** 패러다임으로 재구현한 버전입니다.

## 파일 구조

```
functional/
├── validators.js     # 검증 함수들 (순수 함수)
├── parser.js         # 파싱 & 변환 함수들
├── calculators.js    # 계산 함수들
├── pipeline.js       # 함수 합성 유틸리티
└── result.js         # 메인 실행 파일
```

## 핵심 개념

### 1. 순수 함수 (Pure Functions)

모든 함수는 동일한 입력에 대해 항상 동일한 출력을 반환하며, 사이드 이펙트가 없습니다.

```javascript
// 순수한 경우 😇
export const sum = (numbers) => numbers.reduce((a, b) => a + b, 0);

// 순수하지 않음 (외부 상태 변경) 😈
let total = 0;
const addToTotal = (n) => {
  total += n;
};
```

### 2. 커링 (Currying)

함수의 인자를 하나씩 받는 함수로 변환합니다.

```javascript
// 일반 함수
const validate = (delimiters, input) => {
  /* ... */
};

// 커링된 함수
const validateCharacters = (delimiters) => (input) => {
  /* ... */
};
```

### 3. 함수 합성 (Function Composition)

작은 함수들을 조합하여 복잡한 로직을 구성합니다.

```javascript
const calculate = pipe(
  parseInput, // 1. 파싱
  validateFormat, // 2. 검증
  extractDelimiters, // 3. 구분자 추출
  splitByDelimiters, // 4. 분리
  toNumbers, // 5. 숫자 변환
  sum // 6. 합계
);
```

## 🚀 사용 방법

### 1. 직접 실행 (데모)

```bash
cd week01-string-calculator
node src/functional/result.js
```

### 2. 모듈로 사용

```javascript
import { calculateFromInput } from './functional/result.js';

const result = calculateFromInput('1,2:3');
console.log(result); // 6
```

### 3. 개별 함수 사용

```javascript
import { sum } from './functional/calculators.js';
import { toNumbers } from './functional/parser.js';
import { pipe } from './functional/pipeline.js';

const calculate = pipe((str) => str.split(','), toNumbers, sum);

calculate('1,2,3'); // 6
```

## OOP vs 함수형 비교

| 항목       | OOP 버전            | 함수형 버전      |
| ---------- | ------------------- | ---------------- |
| **구조**   | 클래스 기반         | 순수 함수 기반   |
| **상태**   | 인스턴스 변수       | 불변 데이터      |
| **재사용** | 상속, 인터페이스    | 함수 합성, 커링  |
| **테스트** | Mock 필요할 수 있음 | 순수 함수라 쉬움 |
| **가독성** | 객체의 책임 명확    | 데이터 흐름 명확 |

### OOP 버전 (domain/)

```javascript
class Validator {
  static validateFormat(input) {
    /* ... */
  }
}

class Calculator {
  constructor(delimiters) {
    this.delimiters = delimiters; // 상태 보유
  }
  calculate(input) {
    /* ... */
  }
}
```

### 함수형 버전 (functional/)

```javascript
const validateFormat = (input) => {
  /* ... */
};

const calculate = (delimiters) => (input) => {
  /* ... */
}; // 커링
```

## 🪈 파이프라인 구성 예시

### 기본 파이프라인

```javascript
const result = pipe(parseInput, validateFormat, calculateSum)('1,2:3');
```

### 조건부 실행

```javascript
const result = pipe(
  parseInput,
  when(hasCustomDelimiter, validateFormat), // 조건부
  calculateSum
)('//;\n1;2;3');
```

### 디버깅

```javascript
const result = pipe(
  parseInput,
  tap(console.log), // 중간값 출력
  validateFormat,
  tap(console.log), // 중간값 출력
  calculateSum
)('1,2:3');
```

## 💡 핵심 함수 설명

### validators.js

- `hasCustomDelimiter(input)` - 커스텀 구분자 여부 확인
- `validateFormat(input)` - 형식 검증
- `validateCharacters(delimiters)(input)` - 문자 검증 (커링)
- `validateNumbers(numbers)` - 음수 검증

### parser.js

- `parseInput(input)` - 이스케이프 처리
- `extractDelimiters(input)` - 구분자 추출
- `splitByDelimiters(delimiters)(expression)` - 분리 (커링)
- `toNumbers(strings)` - 숫자 변환

### calculators.js

- `sum(numbers)` - 합계
- `average(numbers)` - 평균
- `max/min(numbers)` - 최대/최소값

### pipeline.js

- `pipe(...fns)` - 왼쪽→오른쪽 합성
- `compose(...fns)` - 오른쪽→왼쪽 합성
- `when(predicate, fn)` - 조건부 실행
- `tap(fn)` - 사이드 이펙트 (디버깅용)
- `curry(fn)` - 커링 헬퍼

## 테스트 예시

> [!NOTE]
> 순수 함수는 테스트가 정말 매우 쉽다!

```javascript
import { sum } from './calculators.js';
import { toNumbers } from './parser.js';

// 단위 테스트
expect(sum([1, 2, 3])).toBe(6);
expect(toNumbers(['1', '2', '3'])).toEqual([1, 2, 3]);

// 함수 합성 테스트
const calculate = pipe(toNumbers, sum);
expect(calculate(['1', '2', '3'])).toBe(6);
```

## 장점

1. **테스트 용이성**: 순수 함수라 입출력만 확인
2. **재사용성**: 작은 함수들을 자유롭게 조합
3. **예측 가능성**: 사이드 이펙트 없음
4. **병렬 처리**: 상태 공유 없어 병렬화 쉬움
5. **디버깅**: `tap` 함수로 중간값 쉽게 확인
