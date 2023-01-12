import {makeBinaryFile} from './src/simulator/assembler';

export function assemble(assemblyFile: string[]): string {
  let output: string = makeBinaryFile(assemblyFile);
  return output;
}
