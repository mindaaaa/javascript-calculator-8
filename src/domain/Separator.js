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
}

export default Separator;
