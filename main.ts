import {makeBinaryFile} from './src/simulator/assembler';

export function assemble(assemblyFile: string[]): string {
  const output: string = makeBinaryFile(assemblyFile);
  return output;
}
