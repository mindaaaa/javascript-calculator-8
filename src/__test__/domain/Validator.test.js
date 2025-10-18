import Validator from '../../domain/Validator.js';

describe('Validator 클래스', () => {
  describe('validateNumbers', () => {
    test('양수만 포함된 배열은 통과한다', () => {
      // given
      const numbers = [1, 2, 3];

      // when & then
      expect(() => {
        Validator.validateNumbers(numbers);
      }).not.toThrow();
    });

    test('음수가 포함된 배열은 에러를 던진다', () => {
      // given
      const numbers = [-1, 2, 3];

      // when & then
      expect(() => {
        Validator.validateNumbers(numbers);
      }).toThrow('[ERROR]');
    });
  });

  describe('validateFormatManual', () => {
    test('올바른 커스텀 구분자 형식은 통과한다', () => {
      // given
      const input = '//;\n1;2;3';

      // when & then
      expect(() => {
        Validator.validateFormatManual(input);
      }).not.toThrow();
    });

    test('커스텀 구분자가 없는 일반 입력은 통과한다', () => {
      // given
      const input = '1,2,3';

      // when & then
      expect(() => {
        Validator.validateFormatManual(input);
      }).not.toThrow();
    });

    test('구분자가 비어있으면 에러를 던진다', () => {
      // given
      const input = '//\n1';

      // when & then
      expect(() => {
        Validator.validateFormatManual(input);
      }).toThrow('[ERROR]');
    });

    test('개행 문자가 없으면 에러를 던진다', () => {
      // given
      const input = '//;1;2';

      // when & then
      expect(() => {
        Validator.validateFormatManual(input);
      }).toThrow('[ERROR]');
    });
  });
});
