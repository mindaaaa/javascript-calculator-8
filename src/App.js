import { MissionUtils } from '@woowacourse/mission-utils';
import Validator from './domain/Validator.js';
import Separator from './domain/Separator.js';
import AdditionCalculator from './domain/AdditionCalculator.js';

class App {
  async run() {
    const input = await MissionUtils.Console.readLineAsync(
      '덧셈할 문자열을 입력해 주세요.\n'
    );

    const parsedInput = input.replace(/\\n/g, '\n');

    if (parsedInput.startsWith('//')) {
      Validator.validateFormatManual(parsedInput);
    }
    const delimiters = Separator.getDelimiters(parsedInput);
    Validator.validateCharactersManual(parsedInput, delimiters);

    const calculator = new AdditionCalculator(delimiters);
    const strNum = calculator.split(parsedInput);

    const numbers = strNum.map(Number);
    Validator.validateNumbers(numbers);

    const result = calculator.sum(numbers);
    MissionUtils.Console.print(`결과 : ${result}`);
  }
}

export default App;
