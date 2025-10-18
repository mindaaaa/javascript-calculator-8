class Validator {
  static CUSTOM_DELIMITER_PREFIX = '//';
  static CUSTOM_DELIMITER_START_INDEX = 2;
  static MIN_NEWLINE_INDEX = 2;
  static DIGIT_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  static DECIMAL_POINT = '.';

  static ERROR_MESSAGES = {
    NEGATIVE_NUMBER: '[ERROR] 양수만 계산할 수 있습니다.',
    INVALID_FORMAT: '[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.',
    INVALID_CHARACTER: '[ERROR] 허용되지 않은 문자가 포함되어 있습니다.',
  };

  /**
   * 성능 최적화된 형식 검증 (BuiltIn 방식 사용)
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 형식이 잘못된 경우
   */
  static validateFormat(input) {
    return this.validateFormatBuiltIn(input);
  }

  /**
   * 성능 최적화된 문자 검증 (Manual 방식 사용)
   * @param {string} input - 검증할 입력 문자열
   * @param {string[]} delimiters - 허용할 구분자 배열
   * @throws {Error} 허용되지 않은 문자가 포함된 경우
   */
  static validateCharacters(input, delimiters) {
    return this.validateCharactersManual(input, delimiters);
  }

  /**
   * 숫자 배열에 음수가 포함되어 있는지 검증합니다.
   * 음수가 있으면 에러를 발생시킵니다.
   *
   * @param {number[]} numbers - 검증할 숫자 배열
   * @throw {Error} 음수가 포함된 경우 "[ERROR]"로 시작하는 에러 발생
   */
  static validateNumbers(numbers) {
    if (numbers.some((n) => n < 0)) {
      throw new Error(this.ERROR_MESSAGES.NEGATIVE_NUMBER);
    }
  }

  /**
   * 커스텀 구분자 패턴으로 시작하는지 확인
   * @param {string} input - 입력 문자열
   * @returns {boolean}
   */
  static hasCustomDelimiter(input) {
    return input.startsWith(this.CUSTOM_DELIMITER_PREFIX);
  }

  /**
   * 포인터/인덱스 방식으로 커스텀 구분자 형식 검증
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 형식이 잘못된 경우
   */
  static validateFormatManual(input) {
    if (!Validator.hasCustomDelimiter(input)) return;

    let newlineIndex = -1;
    for (
      let i = Validator.CUSTOM_DELIMITER_START_INDEX;
      i < input.length;
      i++
    ) {
      if (input[i] === '\n') {
        newlineIndex = i;
        break;
      }
    }

    if (newlineIndex <= Validator.MIN_NEWLINE_INDEX) {
      throw new Error(Validator.ERROR_MESSAGES.INVALID_FORMAT);
    }
  }

  /**
   * 내장 메서드로 커스텀 구분자 형식 검증
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 형식이 잘못된 경우
   */
  static validateFormatBuiltIn(input) {
    if (!Validator.hasCustomDelimiter(input)) return;

    const newlineIndex = input.indexOf('\n');

    if (newlineIndex <= Validator.MIN_NEWLINE_INDEX) {
      throw new Error(Validator.ERROR_MESSAGES.INVALID_FORMAT);
    }
  }

  /**
   * 정규표현식으로 커스텀 구분자 형식 검증
   * @param {string} input - 검증할 입력 문자열
   * @throws {Error} 허용되지 않는 문자가 포함된 경우
   */
  static validateFormatRegex(input) {
    if (!Validator.hasCustomDelimiter(input)) return;

    if (!/^\/\/.+\n/.test(input)) {
      throw new Error(Validator.ERROR_MESSAGES.INVALID_FORMAT);
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

    if (Validator.hasCustomDelimiter(input)) {
      for (
        let i = Validator.CUSTOM_DELIMITER_START_INDEX;
        i < input.length;
        i++
      ) {
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
      const isDecimalPoint =
        currentChar === Validator.DECIMAL_POINT &&
        !delimiters.includes(Validator.DECIMAL_POINT);

      if (!isDigit && !isDelimiter && !isDecimalPoint) {
        throw new Error(Validator.ERROR_MESSAGES.INVALID_CHARACTER);
      }
    }
  }

  /**
   * 내장 메서드로 허용 문자 검증
   * @param {string} input - 검증할 입력 문자열
   * @param {string[]} delimiters - 허용할 구분자 배열
   * @throws {Error} 허용되지 않은 문자가 포함된 경우
   */
  static validateCharactersBuiltIn(input, delimiters) {
    const expression = Validator.hasCustomDelimiter(input)
      ? input.slice(input.indexOf('\n') + 1)
      : input;

    if (!expression) return;

    const allowedChars = new Set([...Validator.DIGIT_CHARS, ...delimiters]);

    if (!delimiters.includes(Validator.DECIMAL_POINT)) {
      allowedChars.add(Validator.DECIMAL_POINT);
    }

    for (const char of expression) {
      if (!allowedChars.has(char)) {
        throw new Error(Validator.ERROR_MESSAGES.INVALID_CHARACTER);
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
    const decimalPoint = delimiters.includes(Validator.DECIMAL_POINT)
      ? ''
      : '\\.';

    const pattern = new RegExp(`^[0-9${escapedDelimiters}${decimalPoint}]+$`);
    if (!pattern.test(expression)) {
      throw new Error(Validator.ERROR_MESSAGES.INVALID_CHARACTER);
    }
  }
}

export default Validator;
