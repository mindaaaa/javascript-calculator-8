class AdditionCalculator {
  static CUSTOM_DELIMITER_PATTERN = /^\/\/.+\n/;
  static DELIMITER_SEPARATOR = '|';
  static EMPTY_STRING = '';
  static INITIAL_SUM = 0;

  constructor(delimiters) {
    this.delimiters = delimiters;
  }

  /**
   * 구분자를 기준으로 문자열 분리
   * @param {string} expression - 계산할 문자열
   * @returns {string[]} 분리된 문자열 배열
   */
  split(expression) {
    const cleanExpression = expression.replace(
      AdditionCalculator.CUSTOM_DELIMITER_PATTERN,
      AdditionCalculator.EMPTY_STRING
    );
    if (!cleanExpression) return [];

    const pattern = this.delimiters.join(
      AdditionCalculator.DELIMITER_SEPARATOR
    );
    const regex = new RegExp(pattern);

    return cleanExpression
      .split(regex)
      .filter((str) => str !== AdditionCalculator.EMPTY_STRING);
  }

  /**
   * 숫자 배열의 합계 계산
   * @param {number[]} stringNumbers - 숫자 배열
   * @returns {number} 합계
   */
  sum(numbers) {
    if (!numbers.length) return AdditionCalculator.INITIAL_SUM;
    return numbers.reduce(
      (acc, num) => acc + num,
      AdditionCalculator.INITIAL_SUM
    );
  }
}

export default AdditionCalculator;
