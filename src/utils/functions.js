import {DEBUG, pType, SYMBOL_TABLE} from './constants.js';
import * as fs from 'fs';
import path from 'path';

export function numToBits(num) {
  // 10진수 정수를 2진수 bit로 변경해서 return
  let bits;
  return bits;
}

export function toHexAndPad(num, pad = 8) {
  /*
   * num : Number or String(숫자 형식, 10진법), pad : Number
   * input : 18 => output: '00000012'
   * Recommend | num을 Number 타입으로 넣을 것
   */
  return Number(num).toString(16).padStart(pad, '0');
}

export function symbolTableAddEntry(symbol) {
  SYMBOL_TABLE[symbol.name] = symbol.address;
  if (DEBUG) {
    log(1, `${symbol.name}: 0x${toHexAndPad(symbol.address)}`);
  }
}

export function log(printType, content) {
  console.log(pType[printType] + content);
}

// Check the value is empty or not
export function isEmpty(value) {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    (value !== null &&
      typeof value === 'object' &&
      !Object.keys(value).length) ||
    value === ['']
  ) {
    return true;
  } else {
    return false;
  }
}

// Parsing an assembly file(*.s) into a list
export function makeInput(inputFolderName, inputFileName) {
  const currDirectory = process.cwd();
  const inputFilePath = path.join(
    currDirectory,
    inputFolderName,
    inputFileName,
  );

  console.log(currDirectory);

  try {
    if (fs.existsSync(inputFilePath) === false) {
      log(
        3,
        `No input file ${inputFileName} exists. Please check the file name and path.`,
      );
      process.exit(1);
    }

    const input = fs.readFileSync(inputFilePath, 'utf-8');

    if (isEmpty(input)) {
      log(
        3,
        `input file ${inputFileName} is not opened. Please check the file`,
      );
      process.exit(1);
    }

    return input.split('\n');
  } catch (err) {
    console.error(err);
  }
}
