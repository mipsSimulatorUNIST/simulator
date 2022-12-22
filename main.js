import {makeBinaryFile, makeSymbolTable} from './src/simulator/assembler.js';
import {log} from './src/utils/functions.js';

export const assemble = assemblyFile => {
  log(1, `Input file: sample1`);

  const input = assemblyFile;

  let output = '';

  makeSymbolTable(input);
  makeBinaryFile(output);
  output = '001010';

  return output;
};
