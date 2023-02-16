import {simulator} from '../../index';
import {CYCLES, initializeMem} from '../../src/utils/constants';
import {
  makeInput,
  makeOutput,
  parseSimulatorOutput,
} from '../../src/utils/functions';

for (let i = 1; i <= 7; i++) {
  initializeMem();
  test(`testing example ${i}`, async () => {
    const input = makeInput('sample_input', `example${i}.s`);
    await simulator(input, 10000);
    const expectOutput = parseSimulatorOutput(
      makeOutput('simulator_sample_output', `example0${i}.o`),
    );
    console.log(expectOutput);
    const testOutput = CYCLES[CYCLES.length - 1];
    expect(expectOutput.toString()).toBe(testOutput.toString());
  });
}
