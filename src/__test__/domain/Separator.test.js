import Separator from '../../domain/Separator.js';

describe('Separator 클래스', () => {
  describe('extractCustomDelimiter', () => {
    test('커스텀 구분자를 정확히 추출한다', () => {
      // given - 이미 검증된 입력
      const input = '//;\n1;2;3';

      // when
      const result = Separator.extractCustomDelimiter(input);

      // then
      expect(result).toBe(';');
    });

    test('여러 글자 커스텀 구분자도 추출한다', () => {
      // given
      const input = '//abc\n1abc2abc3';

      // when
      const result = Separator.extractCustomDelimiter(input);

      // then
      expect(result).toBe('abc');
    });

    test('특수문자 구분자도 추출한다', () => {
      // given
      const input = '//*\n1*2*3';

      // when
      const result = Separator.extractCustomDelimiter(input);

      // then
      expect(result).toBe('*');
    });
  });

  describe('getDelimiters', () => {
    test('커스텀 구분자가 있으면 기본 구분자와 함께 반환한다', () => {
      // given - 이미 검증된 입력
      const input = '//;\n1;2;3';

      // when
      const result = Separator.getDelimiters(input);

      // then
      expect(result).toEqual([',', ':', ';']);
    });

    test('여러 글자 커스텀 구분자도 배열에 포함한다', () => {
      // given
      const input = '//abc\n1abc2';

      // when
      const result = Separator.getDelimiters(input);

      // then
      expect(result).toEqual([',', ':', 'abc']);
    });

    test('빈 문자열은 기본 구분자만 반환한다', () => {
      // given
      const input = '';

      // when
      const result = Separator.getDelimiters(input);

      // then
      expect(result).toEqual([',', ':']);
    });
  });
});
