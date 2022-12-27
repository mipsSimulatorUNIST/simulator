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

export function makeLines(path) {
    try {
      const lines = fs.readFileSync(path, 'utf-8').split('\n');
      return lines;
    } catch (err) {
      console.error(err);
      return;
    }
}
