import Validator from '../../domain/Validator.js';

describe('Validator 클래스', () => {
  test('validateNumbers는 입력값에 양수만 포함되었는지 확인한다.', () => {
    // given
    const numbers = [1, 2, 3];

    // when & then
    expect(() => {
      Validator.validateNumbers(numbers);
    }).not.toThrow();
  });

  test('validateNumbers는 입력값이 음수가 포함되었다면 [ERROR]로 시작하는 에러메시지를 던진다.', () => {
    // given
    const numbers = [-1, 2, 3];

    // when & then
    expect(() => {
      Validator.validateNumbers(numbers);
    }).toThrow('[ERROR]');
  });
});
