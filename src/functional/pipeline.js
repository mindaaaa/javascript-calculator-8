/**
 * 왼쪽에서 오른쪽으로 함수 합성 (파이프라인)
 * @param {...Function} fns - 합성할 함수들
 * @returns {Function} 합성된 함수
 *
 * @example
 * const process = pipe(parseInput, validate, calculate);
 * const result = process(input);
 */
export const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

/**
 * 값을 그대로 반환하는 항등 함수
 * @param {*} value - 입력값
 * @returns {*} 입력값 그대로
 */
export const identity = (value) => value;

/**
 * 조건에 따라 함수 실행 (tap)
 * 값을 변경하지 않고 사이드 이펙트만 실행
 * @param {Function} fn - 실행할 함수
 * @returns {Function} 값을 그대로 반환하는 함수
 *
 * @example
 * pipe(
 *   parseInput,
 *   tap(console.log),  // 중간값 확인
 *   validate
 * )
 */
export const tap = (fn) => (value) => {
  fn(value);
  return value;
};

/**
 * 조건부 실행
 * @param {Function} predicate - 조건 함수
 * @param {Function} fn - 조건이 참일 때 실행할 함수
 * @returns {Function} 조건부로 실행하는 함수
 *
 * @example
 * const validateIfCustom = when(
 *   hasCustomDelimiter,
 *   validateFormat
 * );
 */
export const when = (predicate, fn) => (value) =>
  predicate(value) ? fn(value) : value;
