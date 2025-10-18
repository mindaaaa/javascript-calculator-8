import {
  parseInput,
  extractCustomDelimiter,
  extractDelimiters,
  removeCustomDelimiterPattern,
  splitByDelimiters,
  toNumbers,
} from '../parser.js';

describe('parser - 순수 파싱 함수 테스트', () => {
  describe('parseInput', () => {
    test('이스케이프된 개행을 실제 개행으로 변환한다', () => {
      expect(parseInput('1\\n2\\n3')).toBe('1\n2\n3');
      expect(parseInput('//;\\n1;2;3')).toBe('//;\n1;2;3');
    });

    test('이스케이프가 없으면 그대로 반환한다', () => {
      expect(parseInput('1,2:3')).toBe('1,2:3');
    });

    test('빈 문자열을 처리한다', () => {
      expect(parseInput('')).toBe('');
    });

    test('여러 개의 이스케이프를 처리한다', () => {
      expect(parseInput('a\\nb\\nc')).toBe('a\nb\nc');
    });
  });

  describe('extractCustomDelimiter', () => {
    test('커스텀 구분자를 추출한다', () => {
      expect(extractCustomDelimiter('//;\n1;2;3')).toBe(';');
      expect(extractCustomDelimiter('//|\n1|2|3')).toBe('|');
      expect(extractCustomDelimiter('//*\n1*2*3')).toBe('*');
    });

    test('여러 문자 구분자를 추출한다', () => {
      expect(extractCustomDelimiter('//abc\n1abc2abc3')).toBe('abc');
    });

    test('커스텀 구분자가 없으면 null을 반환한다', () => {
      expect(extractCustomDelimiter('1,2:3')).toBe(null);
      expect(extractCustomDelimiter('1;2;3')).toBe(null);
    });

    test('개행이 없으면 null을 반환한다', () => {
      expect(extractCustomDelimiter('//;1;2;3')).toBe(null);
    });

    test('빈 문자열은 null을 반환한다', () => {
      expect(extractCustomDelimiter('')).toBe(null);
    });
  });

  describe('extractDelimiters', () => {
    test('기본 구분자를 반환한다', () => {
      expect(extractDelimiters('1,2:3')).toEqual([',', ':']);
    });

    test('커스텀 구분자를 포함하여 반환한다', () => {
      expect(extractDelimiters('//;\n1;2;3')).toEqual([',', ':', ';']);
      expect(extractDelimiters('//|\n1|2|3')).toEqual([',', ':', '|']);
    });

    test('기본 구분자는 항상 포함된다', () => {
      const delimiters = extractDelimiters('//;\n1;2;3');
      expect(delimiters).toContain(',');
      expect(delimiters).toContain(':');
      expect(delimiters).toContain(';');
    });

    test('빈 문자열은 기본 구분자만 반환한다', () => {
      expect(extractDelimiters('')).toEqual([',', ':']);
    });
  });

  describe('removeCustomDelimiterPattern', () => {
    test('커스텀 구분자 패턴을 제거한다', () => {
      expect(removeCustomDelimiterPattern('//;\n1;2;3')).toBe('1;2;3');
      expect(removeCustomDelimiterPattern('//|\n1|2|3')).toBe('1|2|3');
    });

    test('패턴이 없으면 그대로 반환한다', () => {
      expect(removeCustomDelimiterPattern('1,2:3')).toBe('1,2:3');
    });

    test('빈 문자열을 처리한다', () => {
      expect(removeCustomDelimiterPattern('')).toBe('');
    });
  });

  describe('splitByDelimiters', () => {
    test('기본 구분자로 문자열을 분리한다', () => {
      const split = splitByDelimiters([',', ':']);
      expect(split('1,2:3')).toEqual(['1', '2', '3']);
    });

    test('커스텀 구분자로 분리한다', () => {
      const split = splitByDelimiters([',', ':', ';']);
      expect(split('//;\n1;2;3')).toEqual(['1', '2', '3']);
    });

    test('여러 구분자를 혼합하여 사용할 수 있다', () => {
      const split = splitByDelimiters([',', ':', ';']);
      expect(split('1,2:3;4')).toEqual(['1', '2', '3', '4']);
    });

    test('정규식 특수문자를 구분자로 사용할 수 있다', () => {
      const split = splitByDelimiters([',', ':', '|']);
      expect(split('//|\n1|2|3')).toEqual(['1', '2', '3']);
    });

    test('빈 문자열은 빈 배열을 반환한다', () => {
      const split = splitByDelimiters([',', ':']);
      expect(split('')).toEqual([]);
    });

    test('연속된 구분자는 무시한다', () => {
      const split = splitByDelimiters([',', ':']);
      expect(split('1,,2::3')).toEqual(['1', '2', '3']);
    });

    test('커링된 함수는 재사용 가능하다', () => {
      const split = splitByDelimiters([',', ':']);

      expect(split('1,2:3')).toEqual(['1', '2', '3']);
      expect(split('4,5:6')).toEqual(['4', '5', '6']);
      expect(split('7,8:9')).toEqual(['7', '8', '9']);
    });

    test('소수점을 포함한 숫자를 처리한다', () => {
      const split = splitByDelimiters([',', ':']);
      expect(split('1.5,2.5:3.7')).toEqual(['1.5', '2.5', '3.7']);
    });
  });

  describe('toNumbers', () => {
    test('문자열 배열을 숫자 배열로 변환한다', () => {
      expect(toNumbers(['1', '2', '3'])).toEqual([1, 2, 3]);
      expect(toNumbers(['10', '20', '30'])).toEqual([10, 20, 30]);
    });

    test('빈 배열을 처리한다', () => {
      expect(toNumbers([])).toEqual([]);
    });

    test('소수점을 처리한다', () => {
      expect(toNumbers(['1.5', '2.5', '3.7'])).toEqual([1.5, 2.5, 3.7]);
    });

    test('음수를 처리한다', () => {
      expect(toNumbers(['-1', '2', '-3'])).toEqual([-1, 2, -3]);
    });

    test('0을 처리한다', () => {
      expect(toNumbers(['0', '1', '2'])).toEqual([0, 1, 2]);
    });

    test('단일 요소를 처리한다', () => {
      expect(toNumbers(['5'])).toEqual([5]);
    });
  });
});
