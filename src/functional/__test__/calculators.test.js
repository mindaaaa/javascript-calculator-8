import { sum, add } from '../calculators.js';

describe('calculators - 순수 계산 함수 테스트', () => {
  describe('sum', () => {
    test('숫자 배열의 합계를 반환한다', () => {
      expect(sum([1, 2, 3])).toBe(6);
      expect(sum([10, 20, 30])).toBe(60);
    });

    test('빈 배열은 0을 반환한다', () => {
      expect(sum([])).toBe(0);
    });

    test('단일 요소는 해당 값을 반환한다', () => {
      expect(sum([5])).toBe(5);
    });

    test('소수점 계산을 지원한다', () => {
      expect(sum([1.5, 2.5, 3])).toBe(7);
    });

    test('음수 계산을 지원한다', () => {
      expect(sum([-1, 2, 3])).toBe(4);
    });
  });

  describe('add', () => {
    test('두 숫자의 합을 반환한다', () => {
      expect(add(1, 2)).toBe(3);
      expect(add(10, 20)).toBe(30);
    });

    test('음수를 지원한다', () => {
      expect(add(-5, 3)).toBe(-2);
    });

    test('소수점을 지원한다', () => {
      expect(add(1.5, 2.5)).toBe(4);
    });
  });
});
