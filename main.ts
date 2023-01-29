import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {initialize, CYCLES} from './src/utils/constants';
import {
  makeInput,
  makeOutput,
  mainProcess,
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

export function simulator(assemblyFile: string[], cycles: number) {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  const {INST_INFO} = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );
  mainProcess(INST_INFO, cycles);
}

// console.log('TEST');
// console.log(testOutput);
// console.log('CYCLES');
//console.log(output);

for (let i = 7; i <= 7; i++) {
  simulator(makeInput('sample_input', `example${i}.s`), 10000);
  const testOutput = parseSimulatorOutput(
    makeOutput('simulator_sample_output', `example0${i}.o`),
  );
  const output = parseSimulatorOutput(CYCLES[CYCLES.length - 1]);
  simulatorUnitTest(testOutput, output);
}
