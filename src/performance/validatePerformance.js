import Validator from '../domain/Validator.js';
import {
  compareFunctions,
  formatResults,
  printResults,
  saveResultsToFile,
} from '../../../packages/performance-utils/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { MissionUtils } from '@woowacourse/mission-utils';

/**
 * 절대 경로 변수
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resultsDir = path.join(__dirname, 'results');

/**
 * Validator 성능 테스트를 위한 입력 데이터
 * @type {Object.<string, {input: string, delimiters: string[]}>}
 */
const testInputs = {
  simple: {
    input: '1,2:3',
    delimiters: [',', ':'],
  },
  withCustom: {
    input: '//;\n1;2;3;4;5',
    delimiters: [',', ':', ';'],
  },
  withDecimal: {
    input: '1.5,2.3:3.7',
    delimiters: [',', ':'],
  },
  complex: {
    input: '//;\n1.5;2;3.14;4.2;5;6.7;8.9;10',
    delimiters: [',', ':', ';'],
  },
};

/**
 * 커스텀 구분자 형식 검증의 성능을 비교합니다.
 * Manual, BuiltIn, Regex 세 가지 방식을 100,000회 반복 실행
 * @returns {string} 포맷팅된 성능 비교 결과
 */
function testFormatValidation() {
  const input = '//;\n1;2;3';

  const testCases = [
    {
      name: 'Manual (Pointer)',
      fn: Validator.validateFormatManual,
      args: [input],
    },
    {
      name: 'BuiltIn (indexOf)',
      fn: Validator.validateFormatBuiltIn,
      args: [input],
    },
    {
      name: 'Regex (Pattern)',
      fn: Validator.validateFormatRegex,
      args: [input],
    },
  ];

  const results = compareFunctions(testCases, 100000);
  return formatResults(results, 'Format Validation Performance');
}

/**
 * 허용된 문자 검증의 성능을 비교합니다.
 * Manual, BuiltIn, Regex 세 가지 방식을 50,000회 반복 실행하여 비교합니다.
 * @param {string} testName - 테스트 케이스 이름
 * @param {Object} testData - 테스트 데이터
 * @param {string} testData.input - 검증할 입력 문자열
 * @param {string[]} testData.delimiters - 허용된 구분자 배열
 * @returns {string} 포맷팅된 성능 비교 결과
 */
function testCharacterValidation(testName, { input, delimiters }) {
  const testCases = [
    {
      name: 'Manual (Loop)',
      fn: Validator.validateCharactersManual,
      args: [input, delimiters],
    },
    {
      name: 'BuiltIn (Set)',
      fn: Validator.validateCharactersBuiltIn,
      args: [input, delimiters],
    },
    {
      name: 'Regex (Pattern)',
      fn: Validator.validateCharactersRegex,
      args: [input, delimiters],
    },
  ];

  const results = compareFunctions(testCases, 50000);
  return formatResults(results, `Character Validation - ${testName}`);
}

/**
 * 전체 성능 테스트를 실행하고 결과를 파일로 저장합니다.
 * - 형식 검증 테스트 1회
 * - 문자 검증 테스트 4회 (Simple, Custom, Decimal, Complex)
 * - 결과를 타임스탬프 파일로 저장
 */
function runAllTests() {
  MissionUtils.Console.print(
    '\n🚀 Validator의 퍼포먼스 테스트가 진행 중입니다...\n'
  );

  let fullReport = '';
  fullReport += `Validator Performance Test Report\n`;
  fullReport += `Generated at: ${new Date().toLocaleString()}\n`;
  fullReport += '='.repeat(60) + '\n';

  const formatResult = testFormatValidation();
  fullReport += formatResult;

  const simpleResult = testCharacterValidation('Simple', testInputs.simple);
  fullReport += simpleResult;

  const customResult = testCharacterValidation(
    'With Custom Delimiter',
    testInputs.withCustom
  );
  fullReport += customResult;

  const decimalResult = testCharacterValidation(
    'With Decimal',
    testInputs.withDecimal
  );
  fullReport += decimalResult;

  const complexResult = testCharacterValidation('Complex', testInputs.complex);
  fullReport += complexResult;

  const savedPath = saveResultsToFile(fullReport, resultsDir);
  MissionUtils.Console.print(`모든 테스트가 ${savedPath}에 완료되었습니다.\n`);
}

runAllTests();
