import {DEBUG, pType, SYMBOL_TABLE} from './constants.js';
import * as fs from 'fs';

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
    log(1, `${symbol.name}: 0x${toHexAndPad(symbol.address)}`)
  }
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
