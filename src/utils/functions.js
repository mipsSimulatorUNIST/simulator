import {pType} from './constants.js';
import * as fs from 'fs';

export function numToBits(num) {
  // 10진수 정수를 2진수 bit로 변경해서 return
  let bits;
  return bits;
}

export function log(printType, content) {
  console.log(pType[printType] + content);
}

// Check the value is empty or not
export function isEmpty(value) {
  if (value === '' || value === null || value === undefined || (value !== null && typeof value === 'object' && !Object.keys(value).length) || value === ['']) {
    return true;
  } else {
    return false;
  }
}

// Parsing an assembly file(*.s) into a list
export function makeInput(inputFolderName, inputFileName) {

  const currDirectory = process.cwd();
  const inputFilePath = path.join(currDirectory, inputFolderName, inputFileName);

  try {
    if (fs.existsSync(inputFilePath) === false) {
      log(3, `No input file ${inputFileName} exists. Please check the file name and path.`);
      process.exit(1);
    }

    const input = fs.readFileSync(inputFilePath, 'utf-8');
    
    if (isEmpty(input)) {
      log(3, `input file ${inputFileName} is not opened. Please check the file`);
      process.exit(1);
    }

    return input.split('\n');
  } catch (err) {
    console.error(err);
  }
}