import {makeBinaryFile, makeSymbolTable} from './src/simulator/assembler';
import {log} from './src/utils/functions';

export const assemble = assemblyFile => {
  let output = makeBinaryFile(assemblyFile);
  return output;
};
