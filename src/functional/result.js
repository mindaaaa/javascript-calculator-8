import { MissionUtils } from '@woowacourse/mission-utils';
import { pipe, when } from './pipeline.js';
import {
  hasCustomDelimiter,
  validateFormat,
  validateCharacters,
  validateNumbers,
} from './validators.js';
import {
  parseInput,
  extractDelimiters,
  splitByDelimiters,
  toNumbers,
} from './parser.js';
import { sum } from './calculators.js';

const MESSAGES = {
  INPUT_PROMPT: '덧셈할 문자열을 입력해 주세요.\n',
  OUTPUT_PREFIX: '결과 : ',
};

/**
 * 순수 계산 파이프라인(단일 진입점)
 * @param {string} rawInput
 * @returns {number}
 */
export const calculate = (rawInput) => {
  const parsed = parseInput(rawInput);
  const validatedFormat = when(hasCustomDelimiter, validateFormat)(parsed);

  const delimiters = extractDelimiters(validatedFormat);

  return pipe(
    validateCharacters(delimiters),
    splitByDelimiters(delimiters),
    toNumbers,
    validateNumbers,
    sum
  )(validatedFormat);
};

/**
 * 결과 포맷팅 (순수)
 */
export const formatResult = (result) => `${MESSAGES.OUTPUT_PREFIX}${result}`;

/**
 * IO 경계: 입력/출력만 담당
 */
export const run = async () => {
  try {
    const input = await MissionUtils.Console.readLineAsync(
      MESSAGES.INPUT_PROMPT
    );
    const result = calculate(input);
    MissionUtils.Console.print(formatResult(result));
  } catch (error) {
    throw error;
  }
};

/**
 * 간단 데모 (테스트용)
 */
export const demo = () => {
  console.log('\n함수형 문자열 계산기 데모\n');

  const testCases = ['1,2:3', '//;\n1;2;3', '1.5,2.5:3', '//|\n10|20|30'];

  for (const input of testCases) {
    try {
      const result = calculate(input);
      console.log(`입력: "${input}" → 결과: ${result}`);
    } catch (error) {
      console.log(`입력: "${input}" → 에러: ${error.message}`);
    }
  }
};

/**
 * 직접 실행시에만 데모 실행
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  demo();
}
