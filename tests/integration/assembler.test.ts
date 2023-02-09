import {assemble} from '../../index';
import {resetSymbolTable} from '../../src/utils/constants';
import {makeInput, makeOutput, IMapDetail} from '../../src/utils/functions';

const mappingDetailOutput: IMapDetail[] = [
  {key: 0, assembly: '\t.data', binary: []},
  {key: 1, assembly: 'data1:\t.word\t100', binary: []},
  {key: 2, assembly: 'data2:\t.word\t200', binary: []},
  {key: 3, assembly: 'data3:\t.word\t0x12345678', binary: []},
  {key: 4, assembly: '\t.text', binary: []},
  {key: 5, assembly: 'main:', binary: []},
  {
    key: 6,
    assembly: '\tand\t$17, $17, $0',
    binary: [{lineNumber: 2, data: '00000010001000001000100000100100'}],
  },
  {
    key: 7,
    assembly: '\tand\t$18, $18, $0',
    binary: [{lineNumber: 3, data: '00000010010000001001000000100100'}],
  },
  {
    key: 8,
    assembly: '\tla\t$8, data1',
    binary: [{lineNumber: 4, data: '00111100000010000001000000000000'}],
  },
  {
    key: 9,
    assembly: '\tla\t$9, data2',
    binary: [
      {lineNumber: 5, data: '00111100000010010001000000000000'},
      {lineNumber: 6, data: '00110101001010010000000000000100'},
    ],
  },
  {
    key: 10,
    assembly: '\tand\t$10, $10, $0',
    binary: [{lineNumber: 7, data: '00000001010000000101000000100100'}],
  },
  {key: 11, assembly: 'lab1:', binary: []},
  {
    key: 12,
    assembly: '\tand\t$11, $11, $0',
    binary: [{lineNumber: 8, data: '00000001011000000101100000100100'}],
  },
  {key: 13, assembly: 'lab2:', binary: []},
  {
    key: 14,
    assembly: '\taddi\t$17, $17, 0x1',
    binary: [{lineNumber: 9, data: '00100010001100010000000000000001'}],
  },
  {
    key: 15,
    assembly: '\taddi\t$11, $11, 0x1',
    binary: [{lineNumber: 10, data: '00100001011010110000000000000001'}],
  },
  {
    key: 16,
    assembly: '\tor\t$9, $9, $0',
    binary: [{lineNumber: 11, data: '00000001001000000100100000100101'}],
  },
  {
    key: 17,
    assembly: '\tbne\t$11, $8, lab2',
    binary: [{lineNumber: 12, data: '00010101011010001111111111111100'}],
  },
  {key: 18, assembly: 'lab3:', binary: []},
  {
    key: 19,
    assembly: '\taddi\t$18, $18, 0x2',
    binary: [{lineNumber: 13, data: '00100010010100100000000000000010'}],
  },
  {
    key: 20,
    assembly: '\taddi\t$11, $11, 1',
    binary: [{lineNumber: 14, data: '00100001011010110000000000000001'}],
  },
  {
    key: 21,
    assembly: '\tsll\t$18, $17, 1',
    binary: [{lineNumber: 15, data: '00000000000100011001000001000000'}],
  },
  {
    key: 22,
    assembly: '\tsrl\t$17, $18, 1',
    binary: [{lineNumber: 16, data: '00000000000100101000100001000010'}],
  },
  {
    key: 23,
    assembly: '\tand\t$19, $17, $18',
    binary: [{lineNumber: 17, data: '00000010001100101001100000100100'}],
  },
  {
    key: 24,
    assembly: '\tbne\t$11, $9, lab3',
    binary: [{lineNumber: 18, data: '00010101011010011111111111111010'}],
  },
  {key: 25, assembly: 'lab4:', binary: []},
  {
    key: 26,
    assembly: '\tadd\t$5, $5, $31',
    binary: [{lineNumber: 19, data: '00000000101111110010100000100000'}],
  },
  {
    key: 27,
    assembly: '\tnor\t$16, $17, $18',
    binary: [{lineNumber: 20, data: '00000010001100101000000000100111'}],
  },
  {
    key: 28,
    assembly: '\tbeq\t$10, $8, lab5',
    binary: [{lineNumber: 21, data: '00010001010010000000000000000001'}],
  },
  {
    key: 29,
    assembly: '\tj\tlab1',
    binary: [{lineNumber: 22, data: '00001000000100000000000000000110'}],
  },
  {key: 30, assembly: 'lab5:', binary: []},
  {
    key: 31,
    assembly: '\tori\t$16, $16, 0xf0f0',
    binary: [{lineNumber: 23, data: '00110110000100001111000011110000'}],
  },
];

test(`testing example 1 for [mapping detail]`, () => {
  resetSymbolTable();

  const input = makeInput('sample_input', `example1.s`);
  const {output, mappingDetail} = assemble(input, true, true);

  expect(mappingDetail).toEqual(mappingDetailOutput);
});

for (let i = 1; i <= 7; i++) {
  test(`testing example ${i} for [array output]`, () => {
    resetSymbolTable();

    const input = makeInput('sample_input', `example${i}.s`);
    const {output} = assemble(input, true);
    const testOutput = makeOutput('sample_output', `example${i}.o`)
      .split('\n') // 문자 -> 문자열 전환
      .filter(ele => ele); // "" 제거, ""는 false와 동일

    expect(output).toEqual(testOutput);
  });
}

for (let i = 1; i <= 7; i++) {
  test(`testing example ${i} for [string output]`, () => {
    resetSymbolTable();

    const input = makeInput('sample_input', `example${i}.s`);
    const {output} = assemble(input, false);
    const testOutput = makeOutput('sample_output', `example${i}.o`);
    expect(output).toEqual(testOutput);
  });
}
