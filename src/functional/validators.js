const CUSTOM_DELIMITER_PREFIX = '//';
const MIN_NEWLINE_INDEX = 2;

const ERROR_MESSAGES = {
  NEGATIVE_NUMBER: '[ERROR] 양수만 계산할 수 있습니다.',
  INVALID_FORMAT: '[ERROR] 커스텀 구분자 형식이 올바르지 않습니다.',
  INVALID_CHARACTER: '[ERROR] 허용되지 않은 문자가 포함되어 있습니다.',
};

/**
 * 커스텀 구분자로 시작하는지 확인
 * @param {string} input - 입력 문자열
 * @returns {boolean}
 */
export const hasCustomDelimiter = (input) =>
  input.startsWith(CUSTOM_DELIMITER_PREFIX);

/**
 * 커스텀 구분자 형식 검증
 * @param {string} input - 입력 문자열
 * @throws {Error} 형식이 잘못된 경우
 */
export const validateFormat = (input) => {
  if (!hasCustomDelimiter(input)) return input;

  const newlineIndex = input.indexOf('\n');
  if (newlineIndex <= MIN_NEWLINE_INDEX) {
    throw new Error(ERROR_MESSAGES.INVALID_FORMAT);
  }

  return input;
};

/**
 * 허용된 문자인지 검증 (커링)
 * @param {string[]} delimiters - 허용할 구분자 배열
 * @returns {Function} 입력을 받아 검증하는 함수
 */
export const validateCharacters = (delimiters) => (input) => {
  const expression = hasCustomDelimiter(input)
    ? input.slice(input.indexOf('\n') + 1)
    : input;

  if (!expression) return input;

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
      throw new Error(ERROR_MESSAGES.INVALID_CHARACTER);
    }
  }

  return input;
};

/**
 * 음수가 포함되어 있는지 검증
 * @param {number[]} numbers - 숫자 배열
 * @returns {number[]} 검증된 숫자 배열
 * @throws {Error} 음수가 포함된 경우
 */
export const validateNumbers = (numbers) => {
  if (numbers.some((n) => n < 0)) {
    throw new Error(ERROR_MESSAGES.NEGATIVE_NUMBER);
  }
  return numbers;
};
