import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {initialize, CYCLES} from './src/utils/constants';
import {
  makeInput,
  makeOutput,
  mainProcess,
  parseSimulatorOutput,
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

//const output = simulator(makeInput('sample_input', 'example1.s'), 10000);
const testOutput = makeOutput('simulator_sample_output', 'example01.o');
parseSimulatorOutput(testOutput);
//console.log('OUTPUT');
//console.log(output);
// console.log('TEST');
// console.log(testOutput);
// console.log('CYCLES');
// console.log(CYCLES[CYCLES.length - 1]);
