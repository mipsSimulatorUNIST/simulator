import {assemble} from '../main.js';
import {diffString2} from './diff.js';
import {log, makeInput} from '../src/utils/functions.js';
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

const test = output => {
  diffString2(testOutput, output);
};

for (let i = 1; i <= 7; i++) {
  const input = makeInput('sample_input', `example${i}.s`);
  log(1, `Input file: sample${i}`);
  const output = assemble(input);

  test(output);
}

// test symbol table
testSymbolTable(testInput, symbolTableCase);
// test record text
testRecordText(recordTextCase, recordTextOutput);
// test record data
testRecordData(recordDataCase, recordDataOutput);
