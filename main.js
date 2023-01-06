import {makeBinaryFile, makeSymbolTable} from './src/simulator/assembler.js';
import {log} from './src/utils/functions.js';

export const assemble = assemblyFile => {
  let output = makeBinaryFile(assemblyFile);
  return output;
};
