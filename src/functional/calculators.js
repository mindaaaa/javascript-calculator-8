/**
 * 숫자 배열의 합계 계산
 * @param {number[]} numbers - 숫자 배열
 * @returns {number} 합계
 */
export const sum = (numbers) => {
  if (!numbers.length) return 0;
  return numbers.reduce((acc, num) => acc + num, 0);
};

/**
 * 두 숫자의 합
 * @param {number} a - 첫 번째 숫자
 * @param {number} b - 두 번째 숫자
 * @returns {number} 합
 */
export const add = (a, b) => a + b;
