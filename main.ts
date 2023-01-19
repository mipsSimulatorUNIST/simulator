import {makeBinaryFile, makeBinaryObject} from './src/simulator/assembler';
import {MIPS} from './src/utils/constants';
import {makeInput} from './src/utils/functions';

export function assemble(assemblyFile: string[]): string {
  const {dataSectionSize, textSectionSize, binaryText, binaryData} =
    makeBinaryObject(assemblyFile);

  const output = makeBinaryFile(
    dataSectionSize,
    textSectionSize,
    binaryText,
    binaryData,
  );

  const simulator: any = new MIPS(
    binaryText.concat(binaryData),
    textSectionSize,
    dataSectionSize,
  );

  return output;
}

const input = makeInput('sample_input', `example1.s`);
const output = assemble(input);
