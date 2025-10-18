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
   * 정규표현식 방식
   */
  static validateFormatRegex(input) {}

  static validateCharactersManual(input) {
    // for loop + input[i]
  }

  static validateCharactersBuiltIn(input) {
    // includes, split 등
  }

  static validateCharactersRegex(input) {
    // /^[0-9,:]+$/
  }
}

export default Validator;
