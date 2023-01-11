import {makeBinaryFile, makeSymbolTable} from './src/simulator/assembler';
import {log} from './src/utils/functions';

export const assemble = assemblyFile => {
  log(1, `Input file: sample1`);
  let output = makeBinaryFile(assemblyFile);
  return output;
};
