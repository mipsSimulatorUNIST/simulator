import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {CYCLES, initialize} from './src/utils/constants';
import {mainProcess, makeInput, makeOutput} from './src/utils/functions';

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

  const {INST_INFO} = initialize(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  const output: string = mainProcess(INST_INFO, cycle);

  return output;
}
