import Calculator from '../../domain/AdditionCalculator.js';

describe('AdditionCalculator 클래스', () => {
  describe('split', () => {
    test('기본 구분자로 문자열을 분리한다', () => {
      // given
      const calculator = new Calculator([',', ':']);
      const input = '1,2:3';

      // when
      const result = calculator.split(input);

      // then
      expect(result).toEqual(['1', '2', '3']);
    });

    test('커스텀 구분자로 문자열을 분리한다', () => {
      // given
      const calculator = new Calculator([',', ':', ';']);
      const input = '//;\n1;2;3';

      // when
      const result = calculator.split(input);

      // then
      expect(result).toEqual(['1', '2', '3']);
    });

    test('빈 문자열은 빈 배열을 반환한다', () => {
      // given
      const calculator = new Calculator([',', ':']);
      const input = '';

      // when
      const result = calculator.split(input);

      // then
      expect(result).toEqual([]);
    });
  });

  describe('sum', () => {
    test('숫자 배열의 합계를 계산한다', () => {
      // given
      const calculator = new Calculator([',', ':']);
      const stringNumbers = [1, 2, 3];

      // when
      const result = calculator.sum(stringNumbers);

      // then
      expect(result).toBe(6);
    });

    test('빈 배열은 0을 반환한다', () => {
      // given
      const calculator = new Calculator([',', ':']);
      const stringNumbers = [];

      // when
      const result = calculator.sum(stringNumbers);

      // then
      expect(result).toBe(0);
    });
  });
});
