import Validator from '../Validator.js';

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

  describe('형식 검증 - 3가지 방식', () => {
    const methods = [
      { name: 'Manual', fn: Validator.validateFormatManual },
      { name: 'BuiltIn', fn: Validator.validateFormatBuiltIn },
      { name: 'Regex', fn: Validator.validateFormatRegex },
    ];

    methods.forEach(({ name, fn }) => {
      describe(`validateFormat${name}`, () => {
        test(`[${name}] 올바른 커스텀 구분자 형식은 통과한다`, () => {
          expect(() => fn('//;\n1;2;3')).not.toThrow();
        });

        test(`[${name}] 커스텀 구분자가 없는 일반 입력은 통과한다`, () => {
          expect(() => fn('1,2,3')).not.toThrow();
        });

        test(`[${name}] 구분자가 비어있으면 에러를 던진다`, () => {
          expect(() => fn('//\n1')).toThrow('[ERROR]');
        });

        test(`[${name}] 개행 문자가 없으면 에러를 던진다`, () => {
          expect(() => fn('//;1;2')).toThrow('[ERROR]');
        });
      });
    });
  });

  describe('문자 검증 - 3가지 방식', () => {
    const methods = [
      { name: 'Manual', fn: Validator.validateCharactersManual },
      { name: 'BuiltIn', fn: Validator.validateCharactersBuiltIn },
      { name: 'Regex', fn: Validator.validateCharactersRegex },
    ];

    methods.forEach(({ name, fn }) => {
      describe(`validateCharacters${name}`, () => {
        test(`[${name}] 기본 구분자만 있으면 통과한다`, () => {
          const delimiters = [',', ':'];
          expect(() => fn('1,2:3', delimiters)).not.toThrow();
          expect(() => fn('123', delimiters)).not.toThrow();
        });

        test(`[${name}] 커스텀 구분자를 포함하면 통과한다`, () => {
          const delimiters = [',', ':', ';']; // ← 커스텀 구분자 포함!
          expect(() => fn('//;\n1;2;3', delimiters)).not.toThrow();
        });

        test(`[${name}] 빈 문자열은 허용한다`, () => {
          const delimiters = [',', ':'];
          expect(() => fn('', delimiters)).not.toThrow();
        });

        test(`[${name}] 허용되지 않은 문자는 에러를 던진다`, () => {
          const delimiters = [',', ':'];
          expect(() => fn('1+2', delimiters)).toThrow('[ERROR]');
          expect(() => fn('1,2,abc', delimiters)).toThrow('[ERROR]');
          expect(() => fn('1 2 3', delimiters)).toThrow('[ERROR]');
        });

        test(`[${name}] 구분자 목록에 없는 구분자는 에러를 던진다`, () => {
          const delimiters = [',', ':']; // ';'는 없음
          expect(() => fn('//;\n1;2;3', delimiters)).toThrow('[ERROR]');
        });

        test(`[${name}] 소수점이 포함된 숫자는 허용한다`, () => {
          const delimiters = [',', ':'];
          expect(() => fn('1.5,2.3:3.7', delimiters)).not.toThrow();
          expect(() => fn('0.1,0.2', delimiters)).not.toThrow();
        });

        test(`[${name}] 구분자로 점을 사용하면 소수점은 허용하지 않는다`, () => {
          const delimiters = [',', ':', '.'];
          expect(() => fn('1,2.3', delimiters)).not.toThrow(); // '.'이 구분자로 인식됨
        });

        test(`[${name}] 소수와 정수가 혼합된 입력도 허용한다`, () => {
          const delimiters = [',', ':'];
          expect(() => fn('1,2.5:3', delimiters)).not.toThrow();
          expect(() => fn('10.5,20', delimiters)).not.toThrow();
        });
      });
    });
  });
});
