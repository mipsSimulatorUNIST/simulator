import {makeBinaryFile} from './src/simulator/assembler';

export function assemble(assemblyFile: object): string {
  let output: string = makeBinaryFile(assemblyFile);
  return output;
}
