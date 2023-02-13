import {
  makeSymbolTable,
  recordTextSection,
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

const recordTextCase = [
  '    and	$17, $17, $0',
  '    and	$18, $18, $0',
  '    la	$8, data1',
  '    la	$9, data2',
  '    and	$10, $10, $0',
  '    and	$11, $11, $0',
  '    addi	$17, $17, 0x1',
  '    addi	$11, $11, 0x1',
  '    or	$9, $9, $0',
  '    bne	$11, $8, lab2',
  '    addi	$18, $18, 0x2',
  '    addi	$11, $11, 1',
  '    sll	$18, $17, 1',
  '    srl	$17, $18, 1',
  '    and	$19, $17, $18',
  '    bne	$11, $9, lab3',
  '    add	$5, $5, $31',
  '    nor	$16, $17, $18',
  '    beq	$10, $8, lab5',
  '    j	lab1',
  '    ori	$16, $16, 0xf0f0',
];

const recordTextOutput = [
  '00000010001000001000100000100100',
  '00000010010000001001000000100100',
  '00111100000010000001000000000000',
  '00111100000010010001000000000000',
  '00110101001010010000000000000100',
  '00000001010000000101000000100100',
  '00000001011000000101100000100100',
  '00100010001100010000000000000001',
  '00100001011010110000000000000001',
  '00000001001000000100100000100101',
  '00010101011010001111111111111100',
  '00100010010100100000000000000010',
  '00100001011010110000000000000001',
  '00000000000100011001000001000000',
  '00000000000100101000100001000010',
  '00000010001100101001100000100100',
  '00010101011010011111111111111010',
  '00000000101111110010100000100000',
  '00000010001100101000000000100111',
  '00010001010010000000000000000001',
  '00001000000100000000000000000110',
  '00110110000100001111000011110000',
];

const mappingTableOutput = [
  [0],
  [1],
  [2],
  [3, 4],
  [5],
  [6],
  [7],
  [8],
  [9],
  [10],
  [11],
  [12],
  [13],
  [14],
  [15],
  [16],
  [17],
  [18],
  [19],
  [20],
  [21],
];

test('testing recordTextSection [binary Text]', () => {
  resetSymbolTable();
  makeSymbolTable(testInput);

  const [binaryText, mappingTable] = recordTextSection(recordTextCase);
  expect(binaryText).toEqual(recordTextOutput);
});

test('testing recordTextSection [mapping Table]', () => {
  resetSymbolTable();
  makeSymbolTable(testInput);

  const [binaryText, mappingTable] = recordTextSection(recordTextCase);
  expect(mappingTable).toEqual(mappingTableOutput);
});
