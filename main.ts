import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {MIPS} from './src/utils/constants';

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

export function simulator(assemblyFile: string[]) {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  const output: object = new MIPS(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  return output;
}
