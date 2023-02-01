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

export function simulator(
  assemblyFile: string[],
  cycle: number,
  returnCycles = false,
): object {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);
  initializeMem();
  const {INST_INFO} = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  const output = mainProcess(INST_INFO, cycle);
  return returnCycles ? {output, cycles: CYCLES} : output;
}
