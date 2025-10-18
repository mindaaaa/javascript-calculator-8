class Calculator {
  constructor(delimiters) {
    this.delimiters = delimiters;
  }

  /**
   * 구분자를 기준으로 문자열 분리
   * @param {string} expression - 계산할 문자열
   * @returns {string[]} 분리된 문자열 배열
   */
  split(expression) {
    const cleanExpression = expression.replace(/^\/\/.+\n/, '');
    if (!cleanExpression) return [];

    const pattern = this.delimiters.join('|');
    const regex = new RegExp(pattern);

    return cleanExpression.split(regex).filter((str) => str !== '');
  }

  /**
   * 문자열 배열을 숫자로 변환하여 합계 계산
   * @param {string[]} stringNumbers - 문자열 숫자 배열
   * @returns {number} 합계
   */
  sum(strNum) {
    if (!strNum.length) return 0;

    const operand = strNum.map(Number);
    return operand.reduce((acc, num) => acc + num, 0);
  }

  /**
   * 전체 계산 (split & sum)
   * @param {string} expression - 계산할 문자열
   * @returns {number} 계산 결과
   */
  calculate(expression) {
    const stringNumbers = this.split(expression);
    return this.sum(stringNumbers);
  }
}

export default Calculator;
