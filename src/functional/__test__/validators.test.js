import {
  hasCustomDelimiter,
  validateFormat,
  validateCharacters,
  validateNumbers,
} from '../validators.js';

describe('validators - 순수 검증 함수 테스트', () => {
  describe('hasCustomDelimiter', () => {
    test('커스텀 구분자로 시작하면 true를 반환한다', () => {
      expect(hasCustomDelimiter('//;\n1;2;3')).toBe(true);
      expect(hasCustomDelimiter('//|\n1|2|3')).toBe(true);
      expect(hasCustomDelimiter('//*\n1*2*3')).toBe(true);
    });

    test('커스텀 구분자가 없으면 false를 반환한다', () => {
      expect(hasCustomDelimiter('1,2:3')).toBe(false);
      expect(hasCustomDelimiter('1;2;3')).toBe(false);
      expect(hasCustomDelimiter('/1,2,3')).toBe(false);
    });

    test('빈 문자열은 false를 반환한다', () => {
      expect(hasCustomDelimiter('')).toBe(false);
    });
  });

  describe('validateFormat', () => {
    test('올바른 커스텀 구분자 형식을 통과한다', () => {
      expect(() => validateFormat('//;\n1;2;3')).not.toThrow();
      expect(() => validateFormat('//|\n1|2|3')).not.toThrow();
      expect(() => validateFormat('//*\n1*2*3')).not.toThrow();
    });

    test('커스텀 구분자가 없으면 통과한다', () => {
      expect(() => validateFormat('1,2:3')).not.toThrow();
      expect(() => validateFormat('1;2;3')).not.toThrow();
    });

    test('입력값을 그대로 반환한다 (순수 함수)', () => {
      const input = '//;\n1;2;3';
      expect(validateFormat(input)).toBe(input);
    });

    test('개행 문자가 없으면 에러를 던진다', () => {
      expect(() => validateFormat('//;1;2;3')).toThrow(
        '[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.'
      );
    });

    test('구분자가 없으면 에러를 던진다', () => {
      expect(() => validateFormat('//\n1,2,3')).toThrow(
        '[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.'
      );
    });
  });

  describe('validateCharacters', () => {
    test('허용된 문자만 있으면 통과한다', () => {
      const validator = validateCharacters([',', ':']);
      expect(() => validator('1,2:3')).not.toThrow();
    });

    test('숫자와 구분자만 허용한다', () => {
      const validator = validateCharacters([',', ':']);
      expect(() => validator('123,456:789')).not.toThrow();
    });

    test('소수점을 허용한다 (구분자가 아닐 때)', () => {
      const validator = validateCharacters([',', ':']);
      expect(() => validator('1.5,2.5:3.7')).not.toThrow();
    });

    test('커스텀 구분자를 허용한다', () => {
      const validator = validateCharacters([',', ':', ';']);
      expect(() => validator('//;\n1;2;3')).not.toThrow();
    });

    test('입력값을 그대로 반환한다 (순수 함수)', () => {
      const validator = validateCharacters([',', ':']);
      const input = '1,2:3';
      expect(validator(input)).toBe(input);
    });

    test('허용되지 않은 문자가 있으면 에러를 던진다', () => {
      const validator = validateCharacters([',', ':']);
      expect(() => validator('1,2a:3')).toThrow(
        '[ERROR] 허용되지 않은 문자가 포함되어 있습니다.'
      );
    });

    test('공백이 있으면 에러를 던진다', () => {
      const validator = validateCharacters([',', ':']);
      expect(() => validator('1, 2:3')).toThrow(
        '[ERROR] 허용되지 않은 문자가 포함되어 있습니다.'
      );
    });

    test('소수점이 구분자일 때는 숫자로 사용 불가', () => {
      const validator = validateCharacters([',', ':', '.']);
      expect(() => validator('1.5,2:3')).not.toThrow();
    });

    test('빈 문자열은 통과한다', () => {
      const validator = validateCharacters([',', ':']);
      expect(() => validator('')).not.toThrow();
    });

    test('커링된 함수는 재사용 가능하다', () => {
      const validator = validateCharacters([',', ':']);

      expect(() => validator('1,2:3')).not.toThrow();
      expect(() => validator('4,5:6')).not.toThrow();
      expect(() => validator('7,8:9')).not.toThrow();
    });
  });

  describe('validateNumbers', () => {
    test('모든 숫자가 양수이면 통과한다', () => {
      expect(() => validateNumbers([1, 2, 3])).not.toThrow();
      expect(() => validateNumbers([10, 20, 30])).not.toThrow();
    });

    test('0을 포함해도 통과한다', () => {
      expect(() => validateNumbers([0, 1, 2])).not.toThrow();
    });

    test('소수를 포함해도 통과한다', () => {
      expect(() => validateNumbers([1.5, 2.5, 3.7])).not.toThrow();
    });

    test('배열을 그대로 반환한다 (순수 함수)', () => {
      const numbers = [1, 2, 3];
      expect(validateNumbers(numbers)).toBe(numbers);
    });

    test('음수가 있으면 에러를 던진다', () => {
      expect(() => validateNumbers([1, -2, 3])).toThrow(
        '[ERROR] 양수만 계산할 수 있습니다.'
      );
    });

    test('여러 음수가 있어도 에러를 던진다', () => {
      expect(() => validateNumbers([-1, -2, -3])).toThrow(
        '[ERROR] 양수만 계산할 수 있습니다.'
      );
    });

    test('빈 배열은 통과한다', () => {
      expect(() => validateNumbers([])).not.toThrow();
    });
  });
});
