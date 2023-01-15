import {
  makeSymbolTable,
  recordDataSection,
} from '../../src/simulator/assembler';
import {resetSymbolTable} from '../../src/utils/constants';

const testInput = [
  '\t.data',
  'data1:\t.word\t100',
  'data2:\t.word\t200',
  'data3:\t.word\t0x12345678',
  '\t.text',
  'main:',
  '\tand\t$17, $17, $0',
  '\tand\t$18, $18, $0',
  '\tla\t$8, data1',
  '\tla\t$9, data2',
  '\tand\t$10, $10, $0',
  'lab1:',
  '\tand\t$11, $11, $0',
  'lab2:',
  '\taddi\t$17, $17, 0x1',
  '\taddi\t$11, $11, 0x1',
  '\tor\t$9, $9, $0',
  '\tbne\t$11, $8, lab2',
  'lab3:',
  '\taddi\t$18, $18, 0x2',
  '\taddi\t$11, $11, 1',
  '\tsll\t$18, $17, 1',
  '\tsrl\t$17, $18, 1',
  '\tand\t$19, $17, $18',
  '\tbne\t$11, $9, lab3',
  'lab4:',
  '\tadd\t$5, $5, $31',
  '\tnor\t$16, $17, $18',
  '\tbeq\t$10, $8, lab5',
  '\tj\tlab1',
  'lab5:',
  '\tori\t$16, $16, 0xf0f0',
];

const recordDataCase = ['100', '200', '0x12345678'];

const recordDataOutput = [
  '00000000000000000000000001100100',
  '00000000000000000000000011001000',
  '00010010001101000101011001111000',
];

test('testing recordDataSection', () => {
  resetSymbolTable();
  makeSymbolTable(testInput);

  const output = recordDataSection(recordDataCase);
  expect(output).toEqual(recordDataOutput);
});
