class Separator {
  /**
   * 커스텀 구분자 추출
   * @param {string} input - 입력 문자열
   * @returns {string} 커스텀 구분자 또는 null
   */
  static extractCustomDelimiter(input) {
    const newlineInput = input.indexOf('\n');
    return input.slice(2, newlineInput);
  }

  /**
   * 모든 구분자 반환 (기본 & 커스텀)
   * @param {string} input - 입력 문자열
   * @returns {string[]} 구분자 배열
   */
  static getDelimiters(input) {
    const defaultDelimiters = [',', ':'];
    const customDelimiter = this.extractCustomDelimiter(input);

    if (customDelimiter) {
      return [...defaultDelimiters, customDelimiter];
    }
    return defaultDelimiters;
  }
}

export default Separator;
