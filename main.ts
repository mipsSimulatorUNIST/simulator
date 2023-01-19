import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';

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
