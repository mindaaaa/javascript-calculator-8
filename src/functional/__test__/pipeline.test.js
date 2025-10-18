import { pipe, identity, tap, when } from '../pipeline.js';

describe('pipeline - 함수 합성 유틸리티 테스트', () => {
  describe('pipe', () => {
    test('왼쪽에서 오른쪽으로 함수를 합성한다', () => {
      // given
      const add1 = (x) => x + 1;
      const mult2 = (x) => x * 2;
      const square = (x) => x * x;

      // when
      const result = pipe(add1, mult2, square)(5);
      // then: (5 + 1) * 2 = 12, 12 * 12 = 144
      expect(result).toBe(144);
    });

    test('단일 함수는 그대로 실행된다', () => {
      const double = (x) => x * 2;
      expect(pipe(double)(5)).toBe(10);
    });

    test('빈 파이프라인은 값을 그대로 반환한다', () => {
      expect(pipe()(10)).toBe(10);
    });
  });

  describe('identity', () => {
    test('입력값을 그대로 반환한다', () => {
      expect(identity(5)).toBe(5);
      expect(identity('hello')).toBe('hello');
      expect(identity([1, 2, 3])).toEqual([1, 2, 3]);
    });

    test('객체도 그대로 반환한다', () => {
      const obj = { a: 1, b: 2 };
      expect(identity(obj)).toBe(obj);
    });
  });

  describe('tap', () => {
    test('사이드 이펙트를 실행하고 값은 변경하지 않는다', () => {
      // given
      let sideEffect = 0;
      const increment = () => {
        sideEffect++;
      };

      // when
      const result = pipe(
        (x) => x + 1,
        tap(increment),
        (x) => x * 2
      )(5);

      // then
      expect(result).toBe(12); // (5 + 1) * 2
      expect(sideEffect).toBe(1);
    });

    test('여러 tap을 연결할 수 있다', () => {
      const values = [];
      const record = (x) => values.push(x);

      pipe(
        (x) => x + 1,
        tap(record),
        (x) => x * 2,
        tap(record)
      )(5);

      expect(values).toEqual([6, 12]);
    });
  });

  describe('when', () => {
    test('조건이 참이면 함수를 실행한다', () => {
      // given
      const isEven = (x) => x % 2 === 0;
      const double = (x) => x * 2;

      // when & then
      expect(when(isEven, double)(4)).toBe(8);
    });

    test('조건이 거짓이면 값을 그대로 반환한다', () => {
      // given
      const isEven = (x) => x % 2 === 0;
      const double = (x) => x * 2;

      // when & then
      expect(when(isEven, double)(5)).toBe(5);
    });

    test('파이프라인에서 사용할 수 있다', () => {
      // given
      const isPositive = (x) => x > 0;
      const square = (x) => x * x;

      // when
      const result = pipe((x) => x + 1, when(isPositive, square))(4);

      // then: 4 + 1 = 5, 5 > 0이므로 5 * 5 = 25
      expect(result).toBe(25);
    });
  });
});
