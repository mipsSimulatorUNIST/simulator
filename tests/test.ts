import {assemble} from '../main';
import {diffString2} from './diff';
import {log, makeInput, makeOutput} from '../src/utils/functions';
import {
  recordDataCase,
  recordDataOutput,
  recordTextCase,
  recordTextOutput,
  symbolTableCase,
  testInput,
  testRecordData,
  testRecordText,
  testSymbolTable,
} from './testCase';

const test = (testOutput, output) => {
  diffString2(testOutput, output);
};

for (let i = 1; i <= 7; i++) {
  const input = makeInput('sample_input', `example${i}.s`);
  log(1, `Input file: sample${i}`);
  const output = assemble(input);
  const testOutput = makeOutput('sample_output', `example${i}.o`);
  test(testOutput, output);
}

// // test symbol table
// testSymbolTable(testInput, symbolTableCase);
// // test record text
// testRecordText(recordTextCase, recordTextOutput);
// // test record data
// testRecordData(recordDataCase, recordDataOutput);
