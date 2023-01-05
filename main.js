import {makeBinaryFile, makeSymbolTable} from './src/simulator/assembler.js';
import {log} from './src/utils/functions.js';

export const assemble = assemblyFile => {
  log(1, `Input file: sample1`);

  const input = makeSymbolTable(assemblyFile);
  let output = makeBinaryFile(input);

  return output;
};
