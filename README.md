# javascript-calculator-precourse

문자열에서 숫자를 추출해 합계를 계산하는 **문자열 덧셈 계산기**입니다.
쉼표(`,`) & 콜론(`:`) & 커스텀 구분자를 지원하며
유효성 검증 실패 시 `[ERROR]`로 시작하는 메시지와 함께 종료합니다.

## 플로우 차트

<img src="https://i.imgur.com/gZlB0rd.jpeg" alt="다이어그램" width="800">

---

## 🚀 실행 방법

```bash
npm start
```

```bash
npm test
```

---

## 기능 요구사항

입력한 문자열에서 숫자를 추출하여 더한다.

- **기본 구분자**: 쉼표(`,`), 콜론(`:`)
  - 예: `""` → `0`, `"1,2"` → `3`, `"1,2,3"` → `6`, `"1,2:3"` → `6`
- **커스텀 구분자 지정**: `"//" + 구분자 + "\\n"`
  - 예: `"//;\n1;2;3"` → 커스텀 `;` 사용, 결과 `6`
- 잘못된 값 입력 시 `[ERROR]`로 시작하는 메시지와 함께 **Error 발생** 후 애플리케이션 종료

---

## 🏡 설계 및 구현 목록

### **Validator**

**역할**: 입력값의 유효성 검증

- [x] 음수 포함 여부 검증
- [x] 숫자와 구분자로만 구성되어 있는지 검증
- [x] 커스텀 구분자 형식(`//` + 구분자 + `\n`) 검증

### Separator

**역할**: 입력 문자열에서 구분자 추출/관리

- [x] 커스텀 구분자 탐지 및 추출
- [x] 모든 구분자 목록 제공 (기본 구분자 & 커스텀 구분자)
- [x] 커스텀 패턴(`//x\n`) 제거 후 **실제 계산 문자열** 반환

### Calculator

**역할**: 구분자 기준 분리 → 숫자 변환 → 합계 반환

- [x] 구분자 목록을 입력받아 문자열 분리
- [x] 분리된 토큰 숫자 변환
- [x] 합계 계산 및 반환

## 모노레포 구조

이 프로젝트는 여러 미션을 **모노레포**로 관리하며, 공통 성능 측정 유틸리티를 공유합니다.

```
precourse-woowa08/                # 모노레포 루트
├── package.json                  # 루트 package.json (변경 가능)
├── packages/
│   └── performance-utils/        # 공유 성능 측정 유틸리티
│       └── index.js
├── week01-string-calculator/     # 이 미션 (독립 저장소)
│   ├── package.json              # 미션 package.json (변경 불가)
│   └── src/
└── week02-xxx/                   # 다른 미션들...
```

### 모노레포 활용 포인트

- 공통 유틸(성능 측정) **재사용**
- 여러 미션 간 **일관된 개발 경험**
- 각 미션은 **독립 제출/관리** 가능

---

## ⚡️ 성능 벤치마크

### 1. Format Validation

| 방식                        | Total(ms) | Avg(ms/call) | Ratio | 비고                 |
| --------------------------- | --------- | ------------ | ----- | -------------------- |
| 🥇 Built-in (`indexOf`)     | **4.196** | 0.000042     | 1.00x | ✅ **가장 빠름**     |
| — 네이티브 문자열 탐색 활용 |
| 🥈 Regex (Pattern)          | 6.203     | 0.000062     | 1.48x | 패턴 초기화 오버헤드 |
| 🥉 Manual (Pointer)         | 15.746    | 0.000157     | 3.75x | 반복 제어 비용 큼    |

> [!NOTE]
> 포맷 검증은 `indexOf`/`includes` 위주가 최적

### 2. Character Validation

- **Simple/Custom Delimiter/Decimal** 세 케이스 공통적으로 *Manual(Loop)*가 가장 빠름
- 복잡 규칙(Complex)에서는 **Regex**가 오히려 효율적
  | 케이스 | 🥇 추천 | 코멘트 |
  | --------------------- | ------------ | -------------------- |
  | Simple | Manual(Loop) | 반복 오버헤드 최소 |
  | With Custom Delimiter | Manual(Loop) | Regex 대비 1.7~3.3x 빠름 |
  | With Decimal | Manual(Loop) | Regex 대비 ~1.3x 빠름 |
  | **Complex** | **Regex** | 정규식 엔진 최적화 유리 |

> [!NOTE]
> 단순(Loop) & 복잡(Regex) 하이브리드 전략이 가장 실용적이다.

### 상세 리포트

- **결과 파일**: [performance-2025-10-18T10-30-45.txt](https://github.com/mindaaaa/javascript-calculator-8/blob/mindaaaa/src/performance/results/performance-2025-10-18T10-30-45.txt)

---

## 입출력 요구 사항

- **입력**: 구분자와 양수로 구성된 문자열
- **출력 예시**:

```
결과 : 6
```

- **실행 예시**:

```
덧셈할 문자열을 입력해 주세요.
1,2:3
결과 : 6
```

---

## Dev-log

> [!IMPORTANT]
> 이번 미션은 `Validator`의 **두 검증 함수**에 대해
> 각각 3가지 방식(포인터/빌트인/정규식)을 적용해 벤치마크했습니다.abs
> 실제 미션 범위에선 가장 좋은 성능을 보인 빌트인 & 포인터를 각 케이스에 채택했습니다.
> 이 밖에도 소수 연산 지원과, `함수형(Functional)` 시도 등을 별도 디렉터리에서 실험했습니다.

---

### 👨‍💻 개발자

[mindaaaa](https://github.com/mindaaaa)

---

## 참고 자료

| 주제               | 링크                                                                                                                                                                 | 요약                                         |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| 퍼포먼스 결과 원본 | [performance-2025-10-18T10-30-45.txt](https://github.com/mindaaaa/javascript-calculator-8/blob/mindaaaa/src/performance/results/performance-2025-10-18T10-30-45.txt) | 벤치마크 원문(케이스별 Total/Avg/Ratio 정리) |
| FP 실험 코드       | [FP로 구현하는 문자열 계산기](https://github.com/mindaaaa/javascript-calculator-8/tree/mindaaaa/src/functional)                                                      | 함수형 스타일로 파이프라인 구성 실험         |
| 저장소/프로필      | [mindaaaa 프로필](https://github.com/mindaaaa)                                                                                                                       | 프로젝트 전반 및 개인 레포 확인              |
