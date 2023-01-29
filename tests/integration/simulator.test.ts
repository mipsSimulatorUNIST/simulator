import {simulator} from '../../main';
import {CYCLES} from '../../src/utils/constants';
import {
  makeInput,
  makeOutput,
  parseSimulatorOutput,
} from '../../src/utils/functions';

for (let i = 1; i <= 7; i++) {
  test(`testing example ${i}`, () => {
    const input = makeInput('sample_input', `example${i}.s`);
    simulator(input, 10000);
    const testOutput = parseSimulatorOutput(
      makeOutput('simulator_sample_output', `example0${i}.o`),
    );
    const expectOutput = parseSimulatorOutput(CYCLES[CYCLES.length - 1]);
    expect(expectOutput).toEqual(testOutput);
  });
}
