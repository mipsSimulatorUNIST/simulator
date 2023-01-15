import {DEBUG, pType, SYMBOL_TABLE, SymbolTableType} from './constants';
import * as fs from 'fs';
import path from 'path';
import {exit} from 'process';

export function numToBits(num: number, pad = 32): string {
  // 10진수 정수를 2진수 bit로 변경해서 return
  if (num >= 0) {
    return num.toString(2).padStart(pad, '0'); //양수일때
  } else {
    num = 2 ** pad + num;
    return num.toString(2).padStart(pad, '0'); //음수일때;
  }
}

export function toHexAndPad(num: number, pad = 8): string {
  /*
   * num : Number or String(숫자 형식, 10진법), pad : Number
   * input : 18 => output: '00000012'
   * Recommend | num을 Number 타입으로 넣을 것
   */
  return Number(num).toString(16).padStart(pad, '0');
}

export function symbolTableAddEntry(symbol: SymbolTableType) {
  SYMBOL_TABLE[symbol.name] = symbol.address;
  if (DEBUG) {
    log(1, `${symbol.name}: 0x${toHexAndPad(symbol.address)}`);
  }
}

export function log(printType: number, content: string) {
  console.log(pType[printType] + content);
}

// Check the value is empty or not
export function isEmpty(value: string | null | undefined | object) {
  const emptyArray: string[] = [''];
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    (value !== null &&
      typeof value === 'object' &&
      !Object.keys(value).length) ||
    value === emptyArray
  ) {
    return true;
  } else {
    return false;
  }
}

// Parsing an assembly file(*.s) into a list
export function makeInput(
  inputFolderName: string,
  inputFileName: string,
): string[] {
  /*
   if the inputFilePath is /Users/junghaejune/simulator/sample_input/sample/example1.s,
    currDirectory : /Users/junghaejune/simulator
    inputFolderPath : sample_input/sample
    inputFileName: example1.s
  */

  const currDirectory: string = process.cwd();
  const inputFilePath: string = path.join(
    currDirectory,
    inputFolderName,
    inputFileName,
  );

  try {
    if (fs.existsSync(inputFilePath) === false) throw 'INPUT_PATH_ERROR';

    const input: string = fs.readFileSync(inputFilePath, 'utf-8');

    if (isEmpty(input)) throw 'INPUT_EMPTY';
    return input.split('\n');
  } catch (err) {
    if (err === 'INPUT_PATH_ERROR') {
      log(
        3,
        `No input file ${inputFileName} exists. Please check the file name and path.`,
      );
    } else if (err === 'INPUT_EMPTY') {
      log(
        3,
        `input file ${inputFileName} is not opened. Please check the file`,
      );
    } else console.error(err);
    exit(1);
  }
}

export function makeOutput(
  inputFolderName: string,
  inputFileName: string,
): string {
  /*
   if the inputFilePath is /Users/junghaejune/simulator/sample_input/sample/example1.s,
    currDirectory : /Users/junghaejune/simulator
    inputFolderPath : sample_input/sample
    inputFileName: example1.s
  */

  const currDirectory: string = process.cwd();
  const inputFilePath: string = path.join(
    currDirectory,
    inputFolderName,
    inputFileName,
  );

  try {
    if (fs.existsSync(inputFilePath) === false) throw 'INPUT_PATH_ERROR';

    const input: string = fs.readFileSync(inputFilePath, 'utf-8');

    if (isEmpty(input)) throw 'INPUT_EMPTY';
    return input;
  } catch (err) {
    if (err === 'INPUT_PATH_ERROR') {
      log(
        3,
        `No input file ${inputFileName} exists. Please check the file name and path.`,
      );
    } else if (err === 'INPUT_EMPTY') {
      log(
        3,
        `input file ${inputFileName} is not opened. Please check the file`,
      );
    } else console.error(err);
    exit(1);
  }
}

// Create an Object file(*.o) in the desired path
export function makeObjectFile(
  outputFolderPath: string,
  outputFileName: string,
  content: string[],
) {
  /*
   if the outputFilePath is /Users/junghaejune/simulator/sample_input/sample/example1.s,
    currDirectory : /Users/junghaejune/simulator
    outputFolderPath : sample_input/sample
    outputFileName: example1.o 
    content : ['01010', '01010']
  */

  const currDirectory: string = process.cwd();
  const outputFilePath: string = path.join(
    currDirectory,
    outputFolderPath,
    outputFileName,
  );

  try {
    if (fs.existsSync(outputFilePath) === true) {
      fs.unlink(outputFilePath, err => {
        err
          ? console.error(err)
          : log(0, `Output file ${outputFileName} exists. Remake the file`);
      });
    } else throw 'OUTPUT_NOT_EXISTS';
    const fd: number = fs.openSync(outputFilePath, 'a');

    for (const item of content) {
      fs.appendFileSync(fd, item + '\n', 'utf-8');
    }

    fs.closeSync(fd);
  } catch (err) {
    if (err === 'OUTPUT_NOT_EXISTS') {
      log(0, `Output file ${outputFileName} does not exists. Make the file`);
    } else console.error(err);
    exit(1);
  }
}
