import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {CYCLES, initialize, initializeMem} from './src/utils/constants';
import {
  mainProcess,
  makeInput,
  makeOutput,
  parseSimulatorOutput,
  simulatorUnitTest,
} from './src/utils/functions';

export function assemble(assemblyFile: string[]): string {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  const output = makeBinaryFile(
    dataSectionSize,
    textSectionSize,
    binaryText,
    binaryData,
  );

  return output;
}

export function simulator(assemblyFile: string[], cycle: number): string {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);
  initializeMem();
  const {INST_INFO} = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  const output: string = mainProcess(INST_INFO, cycle);
  return output;
}

for (let i = 3; i <= 3; i++) {
  console.log(`testing example ${i}`);
  simulator(makeInput('sample_input', `example${i}.s`), 10000);
  const testOutput = parseSimulatorOutput(
    makeOutput('simulator_sample_output', `example0${i}.o`),
  );
  const output = parseSimulatorOutput(CYCLES[CYCLES.length - 1]);
  simulatorUnitTest(testOutput, output);
}
