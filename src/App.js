import { MissionUtils } from '@woowacourse/mission-utils';
import Validator from './domain/Validator.js';
import Separator from './domain/Separator.js';
import AdditionCalculator from './domain/AdditionCalculator.js';

class App {
  static MESSAGES = {
    INPUT_PROMPT: '덧셈할 문자열을 입력해 주세요.\n',
    OUTPUT_PREFIX: '결과 : ',
  };

  async run() {
    const input = await MissionUtils.Console.readLineAsync(
      App.MESSAGES.INPUT_PROMPT
    );

    const parsedInput = input.replace(/\\n/g, '\n');

    if (parsedInput.startsWith(Validator.CUSTOM_DELIMITER_PREFIX)) {
      Validator.validateFormat(parsedInput);
    }
    const delimiters = Separator.getDelimiters(parsedInput);
    Validator.validateCharacters(parsedInput, delimiters);

    const calculator = new AdditionCalculator(delimiters);
    const strNum = calculator.split(parsedInput);

    const numbers = strNum.map(Number);
    Validator.validateNumbers(numbers);

    const result = calculator.sum(numbers);
    MissionUtils.Console.print(`${App.MESSAGES.OUTPUT_PREFIX}${result}`);
  }
}

export default App;
