import {pType} from './constants.js';
import * as fs from 'fs';

// Conver decimal to binary
export function numToBits(num) {
  // 10진수 정수를 2진수 bit로 변경해서 return
  let bits;
  bits = num.toString(2);
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

// Create an Object file(*.o) in the desired path
// 💡 미완성
export function makeObjectFile(path, content) {
  try {
    fs.writeFileSync(path, content);
  } catch (err) {
    console.error(err);
  }
}

// Compare with the object file in the desired path
// 💡 미완성
export function cmpObjectFile(path, content) {
  try {
    const cmpFile = fs.readFileSync(path, 'utf-8');
    JSON.stringify(cmpFile) === JSON.stringify(content);
  } catch (err) {
    console.error(err);
  }
}
