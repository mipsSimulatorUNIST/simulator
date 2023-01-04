import {
  recordDataSection,
  recordTextSection,
  makeBinaryFile,
  makeSymbolTable,
} from '../src/simulator/assembler.js';
import {diffList, diffList2, diffString, diffString2} from './diff.js';

const exSymbolTable1 = {
  dataSeg: [ '100', '200', '0x12345678' ],
  textSeg: [
    ' and  $17, $17, $0',
    ' and  $18, $18, $0',
    ' la $8, data1',
    ' la $9, data2',
    ' and  $10, $10, $0',
    ' and  $11, $11, $0',
    ' addi $17, $17, 0x1',
    ' addi $11, $11, 0x1',
    ' or $9, $9, $0',
    ' bne  $11, $8, lab2',
    ' addi $18, $18, 0x2',
    ' addi $11, $11, 1',
    ' sll  $18, $17, 1',
    ' srl  $17, $18, 1',
    ' and  $19, $17, $18',
    ' bne  $11, $9, lab3',
    ' add  $5, $5, $31',
    ' nor  $16, $17, $18',
    ' beq  $10, $8, lab5',
    ' j  lab1',
    ' ori  $16, $16, 0xf0f0'
  ],
  dataSectionSize: 12,
  textSectionSize: 88
}

const testSymbolTable = (sInput, sOutput) => {
  const stOutput = makeSymbolTable(sInput);
  console.log("DATA SEGMENT");
  diffList(stOutput.dataSeg, sOutput.dataSeg);
  console.log("TEXT SEGMENT");
  diffList(stOutput.textSeg, sOutput.textSeg);
  console.log("DATA SECTION SIZE");
  diffString2(stOutput.dataSectionSize, sOutput.dataSectionSize);
  console.log("TEXT SECTION SIZE");
  diffList(stOutput.textSectionSize, sOutput.textSectionSize);
};

const testRecordText = (sInput, sOutput) => {
  const testOutput = recordTextSection(sInput);
  diffList(testOutput, sOutput);
};

const testRecordData = (sInput, sOutput) => {
  const testOutput = recordDataSection(sInput);
  diffList(testOutput, sOutput);
};

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

const recordDataCase = ['100', '200', '0x12345678'];

const recordDataOutput = [
  '00000000000000000000000001100100',
  '00000000000000000000000011001000',
  '00010010001101000101011001111000',
];