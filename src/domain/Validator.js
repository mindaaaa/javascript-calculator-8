class Validator {
  /**
   * 숫자 배열에 음수가 포함되어 있는지 검증합니다.
   * 음수가 있으면 에러를 발생시킵니다.
   *
   * @param {number[]} numbers - 검증할 숫자 배열
   * @throw {Error} 음수가 포함된 경우 "[ERROR]"로 시작하는 에러 발생
   */
  static validateNumbers(numbers) {
    if (numbers.some((n) => n < 0)) {
      throw new Error('[ERROR] 양수만 계산할 수 있습니다.');
    }
  }

  /**
   * 포인터/인덱스 방식으로 커스텀 구분자 형식 검증
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 형식이 잘못된 경우
   */
  static validateFormatManual(input) {
    if (input.length < 2 || input[0] !== '/' || input[1] !== '/') return;

    let newlineIndex = -1;
    for (let i = 2; i < input.length; i++) {
      if (input[i] === '\n') {
        newlineIndex = i;
        break;
      }
    }

    if (newlineIndex <= 2)
      throw new Error('[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.');
  }

  /**
   * 내장 메서드로 커스텀 구분자 형식 검증
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 형식이 잘못된 경우
   */
  static validateFormatBuiltIn(input) {
    if (!input.startsWith('//')) return;

    const newlineIndex = input.indexOf('\n');

    if (newlineIndex <= 2)
      throw new Error('[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.');
  }

  /**
   * 정규표현식으로 커스텀 구분자 형식 검증
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 허용되지 않는 문자가 포함된 경우
   */
  static validateFormatRegex(input) {
    if (!input.startsWith('//')) return;

    if (!/^\/\/.+\n/.test(input)) {
      throw new Error('[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.');
    }
  }

  /**
   * 포인터/인덱스 방식으로 허용 문자 검증
   * @param {string} input - 검증할 입력 문자열
   * @param {string[]} delimiters - 허용할 구분자 배열 (예: [',', ':', ';'])
   * @throws {Error} 허용되지 않은 문자가 포함된 경우
   */
  static validateCharactersManual(input, delimiters) {
    let startIndex = 0;

    if (input.length >= 2 && input[0] === '/' && input[1] === '/') {
      for (let i = 2; i < input.length; i++) {
        if (input[i] === '\n') {
          startIndex = i + 1;
          break;
        }
      }
    }

    for (let i = startIndex; i < input.length; i++) {
      const currentChar = input[i];
      const isDigit = currentChar >= '0' && currentChar <= '9';
      const isDelimiter = delimiters.includes(currentChar);

      const isDecimalPoint = currentChar === '.' && !delimiters.includes('.');

      if (!isDigit && !isDelimiter && !isDecimalPoint) {
        throw new Error('[ERROR] 허용되지 않은 문자가 포함되어 있습니다.');
      }
    }
  }

  /**
   * 내장 메서드로 허용 문자 검증
   * @param {string} input - 검증할 입력 문자열
   * @param {string[]} delimiters - 허용할 구분자 배열
   * @throws {Error} 허용되지 않은 문자가 포함된 경우
   */
  // TODO: let 쓰기 싫음
  static validateCharactersBuiltIn(input, delimiters) {
    let expression = input;

    if (input.startsWith('//')) {
      const newlineIndex = input.indexOf('\n');
      if (newlineIndex !== -1) {
        expression = input.slice(newlineIndex + 1);
      }
    }

    if (!expression) return;
    const allowedChars = new Set([
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      ...delimiters,
    ]);

    if (!delimiters.includes('.')) {
      allowedChars.add('.');
    }

    for (const char of expression) {
      if (!allowedChars.has(char)) {
        throw new Error('[ERROR] 허용되지 않은 문자가 포함되어 있습니다.');
      }
    }
  }

  /**
   * 정규표현식으로 허용 문자 검증
   * @param {string} input - 검증할 입력 문자열
   * @param {string[]} delimiters - 허용할 구분자 배열
   * @throws {Error} 허용되지 않은 문자가 포함된 경우
   */
  static validateCharactersRegex(input, delimiters) {
    const expression = input.replace(/^\/\/.+\n/, '');
    if (!expression) return;

    const escapedDelimiters = delimiters.join('');
    const decimalPoint = delimiters.includes('.') ? '' : '\\.';

    const pattern = new RegExp(`^[0-9${escapedDelimiters}${decimalPoint}]+$`);
    if (!pattern.test(expression)) {
      throw new Error('[ERROR] 허용되지 않은 문자가 포함되어 있습니다.');
    }
  }
}

export default Validator;
