const DEFAULT_DELIMITERS = [',', ':'];
const CUSTOM_DELIMITER_START_INDEX = 2;
const CUSTOM_DELIMITER_PREFIX = '//';
const CUSTOM_DELIMITER_PATTERN = /^\/\/.+\n/;

/**
 * 이스케이프된 개행 문자를 실제 개행으로 변환
 * @param {string} input - 원본 입력
 * @returns {string} 변환된 입력
 */
const parseInput = (input) => input.replace(/\\n/g, '\n');

/**
 * 커스텀 구분자 추출
 * @param {string} input - 입력 문자열
 * @returns {string|null} 커스텀 구분자 또는 null
 */
const extractCustomDelimiter = (input) => {
  if (!input.startsWith(CUSTOM_DELIMITER_PREFIX)) return null;

  const newlineIndex = input.indexOf('\n');
  if (newlineIndex === -1) return null;

  return input.slice(CUSTOM_DELIMITER_START_INDEX, newlineIndex);
};

/**
 * 모든 구분자 추출 (기본 & 커스텀)
 * @param {string} input - 입력 문자열
 * @returns {string[]} 구분자 배열
 */
const extractDelimiters = (input) => {
  const customDelimiter = extractCustomDelimiter(input);
  return customDelimiter
    ? [...DEFAULT_DELIMITERS, customDelimiter]
    : DEFAULT_DELIMITERS;
};

/**
 * 커스텀 구분자 패턴 제거
 * @param {string} expression - 입력 문자열
 * @returns {string} 정제된 문자열
 */
const removeCustomDelimiterPattern = (expression) =>
  expression.replace(CUSTOM_DELIMITER_PATTERN, '');

/**
 * 정규식 특수문자 이스케이프
 * @param {string} str - 이스케이프할 문자열
 * @returns {string} 이스케이프된 문자열
 */
const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * 구분자로 문자열 분리 (부분 커링)
 * @param {string[]} delimiters - 구분자 배열
 * @returns {Function} 문자열을 받아 분리하는 함수
 */
const splitByDelimiters = (delimiters) => (expression) => {
  const cleanExpression = removeCustomDelimiterPattern(expression);
  if (!cleanExpression) return [];

  const pattern = delimiters.map(escapeRegExp).join('|');
  const regex = new RegExp(pattern);

  return cleanExpression.split(regex).filter((str) => str !== '');
};

/**
 * 문자열 배열을 숫자 배열로 변환
 * @param {string[]} strings - 문자열 배열
 * @returns {number[]} 숫자 배열
 */
const toNumbers = (strings) => strings.map(Number);

export {
  parseInput,
  extractCustomDelimiter,
  extractDelimiters,
  removeCustomDelimiterPattern,
  splitByDelimiters,
  toNumbers,
};
