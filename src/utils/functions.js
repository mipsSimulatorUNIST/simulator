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

// Parsing an assembly file(*.s) into a list
export function makeInput(path) {
  try {
    const input = fs.readFileSync(path, 'utf-8').split('\n');
    return input;
  } catch (err) {
    console.error(err);
  }
}