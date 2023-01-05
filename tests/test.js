import {assemble} from '../main.js';
import {diffString2} from './diff.js';
import {makeInput} from '../src/utils/functions.js';
import {
  recordDataCase,
  recordDataOutput,
  recordTextCase,
  recordTextOutput,
  symbolTableCase,
  testInput,
  testOutput,
  testRecordData,
  testRecordText,
  testSymbolTable,
} from './testCase.js';

const input = makeInput('sample_input', 'example1.s');

const output = assemble(input);

export const test = output => {
  diffString2(testOutput, output);
};

// test symbol table
testSymbolTable(testInput, symbolTableCase);
// test record text
testRecordText(recordTextCase, recordTextOutput);
// test record data
testRecordData(recordDataCase, recordDataOutput);

test(output);
