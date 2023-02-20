import {simulator} from '@root/index';
import {initializeMem} from '@utils/constants';
import {makeInput, makeOutput, parseSimulatorOutput} from '@utils/functions';

for (let i = 1; i <= 7; i++) {
  initializeMem();
  test(`testing example ${i}`, async () => {
    const input = makeInput('sample_input', `example${i}.s`);
    const {history} = await simulator(input, 10000, true);
    const expectOutput = parseSimulatorOutput(
      makeOutput('simulator_sample_output', `example0${i}.o`),
    );
    const testOutput = history[history.length - 1];
    expect(expectOutput.toString()).toBe(testOutput.toString());
  });
}
