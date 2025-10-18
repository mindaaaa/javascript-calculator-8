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
}

export default Calculator;
