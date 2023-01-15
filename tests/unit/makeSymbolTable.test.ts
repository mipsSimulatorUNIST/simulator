import {makeSymbolTable} from '../../src/simulator/assembler';
import {resetSymbolTable, SYMBOL_TABLE} from '../../src/utils/constants';

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

const symbolTableCase = {
  symbolTable: {
    data1: 268435456,
    data2: 268435460,
    data3: 268435464,
    main: 4194304,
    lab1: 4194328,
    lab2: 4194332,
    lab3: 4194348,
    lab4: 4194372,
    lab5: 4194388,
  },
  dataSeg: ['100', '200', '0x12345678'],
  textSeg: [
    '\tand\t$17, $17, $0',
    '\tand\t$18, $18, $0',
    '\tla\t$8, data1',
    '\tla\t$9, data2',
    '\tand\t$10, $10, $0',
    '\tand\t$11, $11, $0',
    '\taddi\t$17, $17, 0x1',
    '\taddi\t$11, $11, 0x1',
    '\tor\t$9, $9, $0',
    '\tbne\t$11, $8, lab2',
    '\taddi\t$18, $18, 0x2',
    '\taddi\t$11, $11, 1',
    '\tsll\t$18, $17, 1',
    '\tsrl\t$17, $18, 1',
    '\tand\t$19, $17, $18',
    '\tbne\t$11, $9, lab3',
    '\tadd\t$5, $5, $31',
    '\tnor\t$16, $17, $18',
    '\tbeq\t$10, $8, lab5',
    '\tj\tlab1',
    '\tori\t$16, $16, 0xf0f0',
  ],
  dataSectionSize: 12,
  textSectionSize: 88,
};

test('testing makeSymbolTable', () => {
  resetSymbolTable();

  const {dataSeg, textSeg, dataSectionSize, textSectionSize} =
    makeSymbolTable(testInput);

  expect(dataSeg).toEqual(symbolTableCase.dataSeg);
  expect(textSeg).toEqual(symbolTableCase.textSeg);
  expect(dataSectionSize).toBe(symbolTableCase.dataSectionSize);
  expect(textSectionSize).toBe(symbolTableCase.textSectionSize);
  expect(SYMBOL_TABLE).toEqual(symbolTableCase.symbolTable);

  resetSymbolTable();
});
